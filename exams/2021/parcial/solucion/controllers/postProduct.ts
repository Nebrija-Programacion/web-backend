import { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import { IProductSchema, IProduct } from "../types.ts";
import type { IContext } from "../types.ts"

const postProduct = async (ctx: IContext) => {
  try {
    if (ctx.request.headers.get("content-type") !== "application/json") {
      ctx.response.status = 400;
      ctx.response.body = "Incorrect content-type";
      return;
    }

    const data: IProductSchema = await ctx.request.body().value;

    const requiredData = ["sku", "name", "price"];
    Object.keys(data).forEach(key => {
      if (!requiredData.includes(key)) throw new Error("Invalid data");
    });

    if (!(data.sku && data.name && data.price)) throw new Error("Invalid data");
    
    const db:Database = ctx.state.db;
    const productsCollection = db.collection<IProductSchema>("ProductsCollection");

    const found = await productsCollection.find({ sku: data.sku });
    if (found) throw new Error("Existing Product");

    await productsCollection.insertOne(data);
    
    ctx.response.status = 200;
    ctx.response.body = "OK";


  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = "Unextected Server Error";
  }
}

export {postClient}