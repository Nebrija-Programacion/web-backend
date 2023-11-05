import express from "npm:express@4.17.1";
import mongoose from "npm:mongoose@8.0.0";

// import endpoints
import { getAllMonuments } from "./resolvers/getMonument.ts";
import { getMonumentFromID } from "./resolvers/getMonument.ts";
import { pushMonument } from "./resolvers/pushMonument.ts";
import { putMonument } from "./resolvers/putMonument.ts";
import { deleteMonument } from "./resolvers/deleteMonument.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
const DB = Deno.env.get("DB") || "monumentos";

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
  Deno.exit(-1);
}

// connecto to MongoDB

const uri = `${MONGO_URL}/${DB}?retryWrites=true&w=majority`;
await mongoose.connect(uri);
console.info("MongoDB connected");

// create express app
const app = express();
app.use(express.json());

// create endpoints
app
  .get("/api/monumentos", getAllMonuments)
  .get("/api/monumentos/:dni", getMonumentFromID)
  .post("/api/monumentos", pushMonument)
  .put("/api/monumentos/:dni", putMonument)
  .delete("/api/monumentos/:dni", deleteMonument);

// start express server
app.listen(6000, () => {
  console.info("Server started on port 6000");
});
