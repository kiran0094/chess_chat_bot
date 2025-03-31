import { NextResponse } from 'next/server';
import { DataAPIClient } from "@datastax/astra-db-ts";
import { OllamaEmbeddings, Ollama } from "@langchain/ollama";

// Initialize environment variables and DB client once
const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLLECTION,
  ASTRA_DB_ENDPOINT,
  ASTRA_DB_TOKEN,
} = process.env;

// Validate environment variables early to prevent runtime errors
if (!ASTRA_DB_NAMESPACE || !ASTRA_DB_COLLLECTION || !ASTRA_DB_ENDPOINT || !ASTRA_DB_TOKEN) {
  console.error("Missing required environment variables for Astra DB");
}

// Pre-initialize clients for better performance with error handling
let client, db, embeddings, ollama;
try {
  client = new DataAPIClient(ASTRA_DB_TOKEN);
  db = client.db(ASTRA_DB_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
  embeddings = new OllamaEmbeddings({
    model: "mxbai-embed-large",
    baseUrl: "http://localhost:11434",
  });
  ollama = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2",
    temperature: 0.7,
    maxRetries: 2,
    timeout: 60000, // 60 seconds timeout
  });
} catch (error) {
  console.error("Error initializing services:", error);
}

// Cache for vector queries to reduce duplicate embeddings generation
const vectorCache = new Map();
const TTL = 3600 * 10; // Cache TTL: 1 hour

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    // Parse request
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage) {
      return NextResponse.json({ message: "No message content provided." }, { status: 400 });
    }

    // Check cache for this query
    if (vectorCache.has(lastMessage)) {
      const { vector, timestamp } = vectorCache.get(lastMessage);
      if (Date.now() - timestamp < TTL) {
        console.log("Cache hit for query embedding");
        var vectorResult = vector;
      }
    }

    // Start vector search and collection prep in parallel only if needed
    const [vector, collection] = await Promise.all([
      vectorResult || embeddings.embedQuery(lastMessage),
      db.collection(ASTRA_DB_COLLLECTION)
    ]);

    // Store in cache if newly generated
    if (!vectorResult) {
      vectorCache.set(lastMessage, { vector, timestamp: Date.now() });
      // Prune cache if it gets too large
      if (vectorCache.size > 100) {
        const oldestKey = [...vectorCache.entries()]
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
        vectorCache.delete(oldestKey);
      }
    }

    // Vector search with error handling and timing
    let docContext = "";
    try {
      console.time('vectorSearch');
      const cursor = collection.find(null, {
        sort: { $vector: vector },
        limit: 5,
      });
      
      const documents = await cursor.toArray();
      console.timeEnd('vectorSearch');
      
      if (documents?.length > 0) {
        docContext = documents.map((doc: any) => doc.text).join("\n\n");
      }
    } catch (error) {
      console.error("Error fetching from collection:", error);
    }

    // Create optimized system prompt
    const systemPrompt = `Chess expert context: ${docContext || "No specific information available."}\nQuery: ${lastMessage} [Be concise but friendly. Use emojis sparingly if appropriate]`;
    
    // Get response from Ollama with timing
    try {
      console.time('ollamaInvoke');
      const response = await ollama.invoke(systemPrompt);
      console.timeEnd('ollamaInvoke');
      
      const totalTime = Date.now() - startTime;
      console.log(`Total processing time: ${totalTime}ms`);
      
      // Return JSON response
      return NextResponse.json({ 
        message: response,
        metadata: { processingTime: totalTime }
      }, { status: 200 });
    } catch (llmError) {
      console.error("LLM error:", llmError);
      return NextResponse.json({ message: "Failed to generate response" }, { status: 500 });
    }
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}


