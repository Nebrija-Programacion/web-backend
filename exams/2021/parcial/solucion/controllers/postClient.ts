import { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import { IClientSchema, IClient } from "../types.ts";
import type { IContext } from "../types.ts"

const postClient = async (ctx: IContext) => {
  try {
    if (ctx.request.headers.get("content-type") !== "application/json") {
      ctx.response.status = 400;
      ctx.response.body = "Incorrect content-type";
      return;
    }

    const data = await ctx.request.body().value;

    const requiredData = ["name", "cif", "address", "mail", "phone"];
    Object.keys(data).forEach(key => {
      if (!requiredData.includes(key)) throw new Error("Invalid data");
    });

    if (!(data.name && data.cif && data.mail)) throw new Error("Invalid data");
    
    const db:Database = ctx.state.db;
    const clientsCollection = db.collection<IClientSchema>("ClientsCollection");

    const found = await clientsCollection.find({ cif: data.cif });
    if (found) throw new Error("Existing Client");

    await clientsCollection.insertOne(data);
    
    ctx.response.status = 200;
    ctx.response.body = "OK";


  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = "Unextected Server Error";
  }
}

export {postClient}