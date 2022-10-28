import { MongoClient, Database } from "mongo";
import { CarSchema } from "./schemas.ts";

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = "avalero";
  const mongo_pwd = "123456789abc";
  const db_name = "kabifai";
  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster-nebrija.gcxdd.gcp.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const carsCollection = db.collection<CarSchema>("Cars");
