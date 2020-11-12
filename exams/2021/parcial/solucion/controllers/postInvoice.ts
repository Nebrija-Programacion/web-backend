import { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import { IBillSchema, IBill, IProductSchema, IClientSchema } from "../types.ts";
import type { IContext } from "../types.ts"

const postInvoice = async (ctx: IContext) => {
  try {
    if (ctx.request.headers.get("content-type") !== "application/json") {
      ctx.response.status = 400;
      ctx.response.body = "Incorrect content-type";
      return;
    }

    const data: IBillSchema = await ctx.request.body().value;

    const requiredData = ["cif", "products"];
    Object.keys(data).forEach(key => {
      if (!requiredData.includes(key)) throw new Error("Invalid data");
    });

    if (!(data.client && data.products)) throw new Error("Invalid data");

    data.products.forEach(pr => {
      if (pr.amount <= 0) throw new Error("Invalid data");
    });
    
    const db:Database = ctx.state.db;
    const BillsCollection = db.collection<IBillSchema>("BillsCollection");
    const ProductsCollection = db.collection<IProductSchema>("ProductsCollection");
    const ClientsCollection = db.collection<IClientSchema>("ClientsCollection");

    const clientFound = await ClientsCollection.findOne({ cif: data.client });
    if (!clientFound) {
      ctx.response.status = 404;
      return;
    }

    const foundProductsPromises = data.products.map(async (elem) => ProductsCollection.findOne({ sku: elem.product }));
    const foundProducts = await Promise.all(foundProductsPromises);
    
    foundProducts.forEach(found => {
      if (!found) throw new Error("Not found");
    });


    await BillsCollection.insertOne(data);
    
    ctx.response.status = 200;
    ctx.response.body = "OK";


  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = "Unextected Server Error";
  }
}

export {postInvoice}