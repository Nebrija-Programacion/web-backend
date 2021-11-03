import {
  Database
} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";

import { TaskSchema, UserSchema } from "../mongo/schema.ts";

import {IUser, IContext} from "../types.ts"

const Task = {
  assignee: async (
    parent: {assignee: string},
    args: any,
    ctx: IContext
  ): Promise<IUser | null> => {
    const db: Database = ctx.db;
    const UsersCollection = db.collection<UserSchema>("Users");
    const user = await UsersCollection.findOne({ email: parent.assignee })
    return user;
  },

  reporter: async (
    parent: {reporter: string},
    args: any,
    ctx: IContext
  ): Promise<IUser | null> => {
    const db: Database = ctx.db;
    const UsersCollection = db.collection<UserSchema>("Users");
    const user = await UsersCollection.findOne({ email: parent.reporter })
    return user;
  }
}

export {Task}