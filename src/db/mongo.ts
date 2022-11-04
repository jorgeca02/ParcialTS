import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { SlotSchema } from "./schemas.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const dbName = Deno.env.get("DB_NAME")
const connectMongoDB = async (): Promise<Database> => {
    
    const usr = Deno.env.get("MONGO_USR")
    const pwd = Deno.env.get("MONGO_PWRD")
    const cluster = Deno.env.get("CLUSTER")
    const mongo_url = `mongodb+srv://${usr}:${pwd}@${cluster}/${dbName}?authMechanism=SCRAM-SHA-1`;
  console.log("conectando...");
  const client = new MongoClient();
  await client.connect(mongo_url);
  console.log("conectado");
  const db = client.database(dbName);
  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${dbName} connected`);

export const slotsCollection = db.collection<SlotSchema>("Slots");