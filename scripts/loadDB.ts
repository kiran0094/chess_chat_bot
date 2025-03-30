import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";
import { OllamaEmbeddings } from "@langchain/ollama";

type simlaritymeasure = "cosine" | "euclidean"|"dot_product"


dotenv.config();
const {ASTRA_DB_NAMESPACE,ASTRA_DB_COLLLECTION,ASTRA_DB_ENDPOINT,ASTRA_DB_TOKEN} = process.env
const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large", // Default value
  baseUrl: "http://localhost:11434", // Default value
});


const data=[
  "https://en.wikipedia.org/wiki/Chess",
  "https://en.wikipedia.org/wiki/World_Chess_Championship",
  "https://en.wikipedia.org/wiki/Women%27s_World_Chess_Championship",
  "https://en.wikipedia.org/wiki/World_Junior_Chess_Championship",
  "https://en.wikipedia.org/wiki/World_Senior_Chess_Championship"
  
]

const client = new DataAPIClient(ASTRA_DB_TOKEN)
const db = client.db(ASTRA_DB_ENDPOINT,{
  namespace: ASTRA_DB_NAMESPACE,

})

const createCollection = async (simlaritymeasure:simlaritymeasure="dot_product") => {
 const res = await db.createCollection(ASTRA_DB_COLLLECTION, {
    vector: {
      dimension: 512,
      metric: simlaritymeasure,
    },
  });
  console.log(res)
    }

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 10,
});


