import { ClientSession, Collection, ObjectId } from "mongodb";
import { UserModel } from "./types.ts";
import { GraphQLError } from "graphql";

type Context = {
  UserCollection: Collection<UserModel>;
};

type QueryUserArgs = {
  email: string;
};

type MutationAddUserArgs = {
  email: string;
  name: string;
  friends: string[];
};

export const resolvers = {
  User: {
    id: (parent: UserModel) => {
      return parent._id?.toString();
    },
    friends: async (parent: UserModel, _: unknown, ctx: Context) => {
      const ids = parent.friends;
      return await ctx.UserCollection.find({ _id: { $in: ids } }).toArray();
    },
    numberOfFriends: (parent: UserModel) => parent.friends.length,
  },
  Query: {
    users: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<UserModel[]> => {
      const users = await ctx.UserCollection.find().toArray();
      return users;
    },

    user: async (
      _: unknown,
      args: QueryUserArgs,
      ctx: Context,
    ): Promise<UserModel | null> => {
      const email = args.email;

      const user = await ctx.UserCollection.findOne({ email });
      return user;
    },
  },
  Mutation: {
    addUser: async (
      _: unknown,
      args: MutationAddUserArgs,
      ctx: Context,
    ): Promise<UserModel> => {
      const { email, name, friends } = args;
      const existsUser = await ctx.UserCollection.findOne({ email });
      if (existsUser) throw new GraphQLError("Uses Exists");

      const friendsExist = await ctx.UserCollection.find({
        _id: { $in: friends.map((f) => new ObjectId(f)) },
      }).toArray();
      if (friendsExist.length !== friends.length) {
        throw new GraphQLError("Not all friends exist");
      }

      const user = await ctx.UserCollection.insertOne({
        email,
        name,
        friends: friends.map((f) => new ObjectId(f)),
      });

      return {
        _id: user.insertedId,
        email,
        name,
        friends: friends.map((f) => new ObjectId(f)),
      };
    },
  },
};
