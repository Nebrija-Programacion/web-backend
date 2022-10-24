import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { BookSchema } from "./schemas.ts";

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = "avalero";
  const mongo_pwd = "xxxxxxxxxxx";
  const db_name = "bookstore";
  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster-nebrija.gcxdd.gcp.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();

export const booksCollection = db.collection<BookSchema>("Books");
