import express from "npm:express@4.17.1";
import mongoose from "npm:mongoose@8.0.0";

// import endpoints
import { getAllContacts } from "./resolvers/getContacts.ts";
import { getContactFromDNI } from "./resolvers/getContacts.ts";
import { pushContact } from "./resolvers/pushContact.ts";
import { putContact } from "./resolvers/putContact.ts";
import { deleteContact } from "./resolvers/deleteContact.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
const DB = Deno.env.get("DB") || "contactos";

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
  .get("/api/contactos", getAllContacts)
  .get("/api/contactos/:dni", getContactFromDNI)
  .post("/api/contactos", pushContact)
  .put("/api/contactos/:dni", putContact)
  .delete("/api/contactos/:dni", deleteContact);

// start express server
app.listen(6000, () => {
  console.info("Server started on port 6000");
});
