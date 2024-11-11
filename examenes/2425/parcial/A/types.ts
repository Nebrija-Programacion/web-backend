import { ObjectId, OptionalId } from "mongodb";

export type Friend = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  phone: string;
  friends: Friend[];
};

export type PersonModel = OptionalId<{
  name: string;
  email: string;
  phone: string;
  friends: ObjectId[];
}>;
