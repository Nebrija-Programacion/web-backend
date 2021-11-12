import { Db, MongoClient } from "mongodb";

export const connectDB = async (): Promise<Db> => {
  const usr = "avalero";
  const pwd = "nebrija";
  const dbName: string = "parcial";
  const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster-nebrija.gcxdd.gcp.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  const client = new MongoClient(mongouri);

  try {
    await client.connect();
    console.info("MongoDB connected");

    return client.db(dbName);
  } catch (e) {
    throw e;
  }
};
