import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";
import { OllamaEmbeddings } from "@langchain/ollama";

dotenv.config();

const { ASTRA_DB_NAMESPACE, ASTRA_DB_COLLLECTION, ASTRA_DB_ENDPOINT, ASTRA_DB_TOKEN } = process.env;

if (!ASTRA_DB_NAMESPACE || !ASTRA_DB_COLLLECTION || !ASTRA_DB_ENDPOINT || !ASTRA_DB_TOKEN) {
  throw new Error("Missing required environment variables.");
}

const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large",
  baseUrl: "http://localhost:11434",
});

const urls = [
  "https://en.wikipedia.org/wiki/Chess",
  "https://en.wikipedia.org/wiki/World_Chess_Championship",
  "https://en.wikipedia.org/wiki/Women%27s_World_Chess_Championship",
];

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 600, chunkOverlap: 60 });
const client = new DataAPIClient(ASTRA_DB_TOKEN);
const db = client.db(ASTRA_DB_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const createCollection = async () => {
  const vectorSize = (await embeddings.embedQuery("test")).length;
  console.log(`Vector size: ${vectorSize}`);
  return db.createCollection(ASTRA_DB_COLLLECTION, {
    vector: { dimension: vectorSize, metric: "dot_product" },
  });
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, { launchOptions: { headless: true } });
  return (await loader.scrape())?.replace(/<[^>]+>/g, "");
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLLECTION);
  for (const url of urls) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for (const chunk of chunks) {
      const vector = await embeddings.embedQuery(chunk);
      await collection.insertOne({ text: chunk, $vector: vector });
    }
  }
};

createCollection()
  .then(loadSampleData)
  .catch(console.error);





