import { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.2/mod.ts";

import { IBillSchema, IBill, IProductSchema, IClientSchema } from "../types.ts";
import type { IContext } from "../types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";


const getInvoice = async (ctx: IContext) => {
  const { id } = helpers.getQuery(ctx, { mergeParams: true });
  const db: Database = ctx.state.db;
  const InvoceCollection = db.collection<IBillSchema>("BillsCollection");
  const invoice = await InvoceCollection.findOne({ _id: ObjectId(id) });
  if (!invoice) {
    ctx.response.status = 404;
    return;
  }

  const ClientsCollection = db.collection<IClientSchema>("ClientsCollection");
  const client: IClientSchema | null = await ClientsCollection.findOne({ cif: invoice.client })
  if (!client) {
    ctx.response.status = 500;
    return;
  }

  const ProductsCollection = db.collection<IProductSchema>("ProductsCollection");
  const products = await Promise.all(invoice.products.map(async (pr) => {
    return ProductsCollection.findOne({ sku: pr.product });
  }))

  let price: number = 0;
  for (let i = 0; i < products.length; i++){
    price = price + products[i]!.price * invoice.products[i].amount;
  }
  

  ctx.response.status = 200;
  ctx.response.body = {
    client,
    products,
    price,
  }
}