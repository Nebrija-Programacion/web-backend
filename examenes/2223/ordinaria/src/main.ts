import { Server } from "std/http/server.ts";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";

import { Query } from "./resolvers/query.ts";
import { Character } from "./resolvers/character.ts";
import { Episode } from "./resolvers/episode.ts";
import { Location } from "./resolvers/location.ts";
import { typeDefs } from "./schema.ts";

const resolvers = {
  Query,
  Character,
  Episode,
  Location,
};

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:3000/graphql`);
