import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Book } from "../types.ts";

export type BookSchema = Omit<Book, "id"> & { _id: ObjectId };
