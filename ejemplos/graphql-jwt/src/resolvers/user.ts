import { ObjectId } from "mongo";
import { UserSchema } from "../db/schema.ts";
import { User } from "../types.ts";

const UserResolver = {
  id: (parent: UserSchema | User) =>
    (parent as User).id
      ? (parent as User).id
      : new ObjectId((parent as UserSchema)._id),
};

export default UserResolver;
