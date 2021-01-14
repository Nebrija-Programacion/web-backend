import {  Application, Router, RouterContext } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  applyGraphQL, GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { Schema } from "./schema/schema.ts"
import { Query } from "./resolvers/Query.ts";
import { Mutation } from "./resolvers/Muation.ts";
import { Task } from "./resolvers/Task.ts";
import { User } from "./resolvers/User.ts";
import { UserSchema } from "./mongo/schema.ts";

const resolvers = {
  Query,
  Mutation,
  Task,
  User
}

try {
  // connect to Mongo DB
  const DB_URL = Deno.env.get("DB_URL");
  const DB_NAME = Deno.env.get("DB_NAME");

  if (!DB_URL || !DB_NAME) {
    throw Error("Please define DB_URL and DB_NAME on .env file");
  }

  const client = new MongoClient();
  client.connectWithUri(DB_URL);
  const db = client.database(DB_NAME);

  const app = new Application();

  app.use(async (ctx, next) => {
    const value = await ctx.request.body().value;
    // it allows launching of graphql playground

    if (!value || value.operationName === "IntrospectionQuery") {
      await next();
    } else {
      const noAuthResolvers = ["login", "signin"];
      if (noAuthResolvers.some((elem) => value.query.includes(elem))) {
        await next();
      } else {
        const token = ctx.request.headers.get("token") || "none";
        console.log(token);
        const user = await db.collection<UserSchema>("Users").findOne({ token });
        if (user) {
          ctx.state.user = user;
          await next();
        } else {
          ctx.response.status = 401;
          ctx.response.body = { error: "Authentication Error" };
        }
      }
    }
  });

  const GraphQLService = await applyGraphQL<Router>({
    Router,
    path: "/graphql",
    typeDefs: Schema,
    resolvers,
    context: (ctx: RouterContext) => {
      return {
        ctx,
        db,
        user: ctx.state.user,
      };
    },
  });

  

  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

  const port = Deno.env.get("PORT") || "4000";

  console.log(`Server start at http://localhost:${port}`);
  await app.listen({ port: parseInt(port) });
} catch (e) {
  console.error(e);
}