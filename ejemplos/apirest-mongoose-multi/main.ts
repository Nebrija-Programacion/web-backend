// @deno-types="npm:@types/express@4"
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { postSubject } from "./resolvers/postSubject.ts";
import { putSubject } from "./resolvers/putSubject.ts";
import { deleteSubject } from "./resolvers/deleteSubject.ts";
import { getSubjects } from "./resolvers/getSubjects.ts";
import { getSubject } from "./resolvers/getSubject.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
  .get("/teachers", async (req: Request, res: Response) => {})
  .get("/students", async (req: Request, res: Response) => {})
  .get("/subjects", getSubjects)
  .get("/teacher/:id", async (req: Request, res: Response) => {})
  .get("/student/:id", async (req: Request, res: Response) => {})
  .get("/subject/:id", getSubject)
  .post("/teacher", async (req: Request, res: Response) => {})
  .post("/student", async (req: Request, res: Response) => {})
  .post("/subject", postSubject)
  .put("/teacher/:id", async (req: Request, res: Response) => {})
  .put("/student/:id", async (req: Request, res: Response) => {})
  .put("/subject/:id", putSubject)
  .delete("/teacher/:id", async (req: Request, res: Response) => {})
  .delete("/student/:id", async (req: Request, res: Response) => {})
  .delete("/subject/:id", deleteSubject);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
