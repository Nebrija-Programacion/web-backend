import { ObjectId } from "mongo";
import { UsersCollection } from "../db/dbconnection.ts";
import { UserSchema } from "../db/schema.ts";
import { User } from "../types.ts";
import * as bcrypt from "bcrypt";
import { createJWT } from "../lib/jwt.ts";

export const Mutation = {
  register: async (
    parent: unknown,
    args: {
      username: string;
      email: string;
      password: string;
      name: string;
      surname: string;
    }
  ): Promise<UserSchema & { token: string }> => {
    try {
      const user: UserSchema | undefined = await UsersCollection.findOne({
        username: args.username,
      });
      if (user) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.password);
      const _id = new ObjectId();
      const token = await createJWT(
        {
          username: args.username,
          email: args.email,
          name: args.name,
          surname: args.surname,
          id: _id.toString(),
        },
        Deno.env.get("JWT_SECRET")!
      );
      const newUser: UserSchema = {
        _id,
        username: args.username,
        email: args.email,
        password: hashedPassword,
        name: args.name,
        surname: args.surname,
      };
      await UsersCollection.insertOne(newUser);
      return {
        ...newUser,
        token,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  login: async (
    parent: unknown,
    args: {
      username: string;
      password: string;
    }
  ): Promise<string> => {
    try {
      const user: UserSchema | undefined = await UsersCollection.findOne({
        username: args.username,
      });
      if (!user) {
        throw new Error("User does not exist");
      }
      const validPassword = await bcrypt.compare(args.password, user.password);
      if (!validPassword) {
        throw new Error("Invalid password");
      }
      const token = await createJWT(
        {
          username: user.username,
          email: user.email,
          name: user.name,
          surname: user.surname,
          id: user._id.toString(),
        },
        Deno.env.get("JWT_SECRET")!
      );
      return token;
    } catch (e) {
      throw new Error(e);
    }
  },
};
