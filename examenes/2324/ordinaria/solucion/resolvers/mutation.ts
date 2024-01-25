import { GraphQLError } from "graphql";
import { getInformationFromPhone } from "../lib/apifunctions.ts";
import { getInformationFromCountry } from "../lib/apifunctions.ts";
import { ContactModel, ContactModelType } from "../db/contact.ts";

export const Mutation = {
  addContact: async (
    _: unknown,
    args: { name: string; phone: string }
  ): Promise<ContactModelType> => {
    try {
      const phoneInformation = await getInformationFromPhone(args.phone);
      if (!phoneInformation.is_valid) {
        throw new GraphQLError("Invalid phone number");
      }

      const countryInfo = await getInformationFromCountry(
        phoneInformation.country
      );

      if (countryInfo.length === 0) {
        throw new GraphQLError("Invalid country");
      }

      const contact = new ContactModel({
        name: args.name,
        phone: args.phone,
        country: phoneInformation.country,
        capital: countryInfo[0].capital,
      });

      await contact.save();

      return contact;
    } catch (err) {
      console.log(err);
      throw new GraphQLError(err);
    }
  },

  deleteContact: async (_: unknown, args: { id: string }): Promise<Boolean> => {
    try {
      const deleted = await ContactModel.deleteOne({ _id: args.id });
      return deleted.deletedCount === 1;
    } catch (err) {
      console.log(err);
      throw new GraphQLError(err);
    }
  },

  updateContact: async (
    _: unknown,
    args: { id: string; name: string; phone: string }
  ): Promise<ContactModelType> => {
    try {
      const contact = await ContactModel.findById(args.id);
      if (!contact) {
        throw new GraphQLError("Contact not found");
      }

      if (args.phone && args.phone !== contact.phone) {
        const phoneInformation = await getInformationFromPhone(args.phone);
        if (!phoneInformation.is_valid) {
          throw new GraphQLError("Invalid phone number");
        }

        const countryInfo = await getInformationFromCountry(
          phoneInformation.country
        );

        contact.phone = args.phone;
        contact.country = phoneInformation.country;
        contact.capital = countryInfo[0].capital;
      }

      if (args.name) {
        contact.name = args.name;
      }

      await contact.save();

      return contact;
    } catch (err) {
      console.log(err);
      throw new GraphQLError(err);
    }
  },
};
