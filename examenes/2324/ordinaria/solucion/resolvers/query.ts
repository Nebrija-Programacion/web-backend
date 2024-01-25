import { GraphQLError } from "graphql";
import { ContactModel } from "../db/contact.ts";

export const Query = {
  getContacts: async () => {
    try {
      const contacts = await ContactModel.find();
      return contacts;
    } catch (err) {
      console.log(err);
      throw new GraphQLError(err);
    }
  },
  getContact: async (_: unknown, args: { id: string }) => {
    try {
      const contact = await ContactModel.findById(args.id);
      return contact;
    } catch (err) {
      console.log(err);
      throw new GraphQLError(err);
    }
  },
};
