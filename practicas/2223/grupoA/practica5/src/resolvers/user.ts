import { UserSchema } from "../db/schema.ts";

export const User = {
  id: (user: UserSchema): string => user._id.toString(),
};
