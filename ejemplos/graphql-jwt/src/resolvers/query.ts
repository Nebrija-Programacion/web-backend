import { ObjectId } from "mongo";
import { verifyJWT } from "../lib/jwt.ts";
import { User } from "../types.ts";

export const Query = {
  Me: async (parent: unknown, args: { token: string }) => {
    try {
      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;
      return user;
    } catch (e) {
      throw new Error(e);
    }
  },
};
