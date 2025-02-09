import { APIPhone, APITime, ContactModel } from "./type"
import { Collection, ObjectId } from "mongodb"
import { GraphQLError } from "graphql";

type GetContactQueryArgs = {
  id: string
}

type DeleteContactMutationArgs = {
  id: string;
}

type AddContactMutationArgs = {
  name: string,
  phone: string,
}

type UpdateContactMutationArgs = {
  id: string,
  name?: string,
  phone?: string,
}

type Context = {
  ContactsCollection: Collection<ContactModel>
}

export const resolvers = {
  Query: {
    getContact: async (_: unknown, args: GetContactQueryArgs, ctx: Context): Promise<ContactModel | null> => {
      return await ctx.ContactsCollection.findOne({ _id: new ObjectId(args.id) });
    },
    getContacts: async (_: unknown, __: unknown, ctx: Context): Promise<ContactModel[]> => await ctx.ContactsCollection.find().toArray()

  },

  Mutation: {
    deleteContact: async (_: unknown, args: DeleteContactMutationArgs, ctx: Context): Promise<boolean> => {
      const { deletedCount } = await ctx.ContactsCollection.deleteOne({ _id: new Object(args.id) });
      return deletedCount === 1;
    },
    addContact: async (_: unknown, args: AddContactMutationArgs, ctx: Context): Promise<ContactModel> => {
      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new GraphQLError("You need the Api Ninja API_KEY");

      const { phone, name } = args;
      const phoneExist = await ctx.ContactsCollection.countDocuments({ phone });
      if (phoneExist >= 1) throw new GraphQLError("Phone exists");

      const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`;
      const data = await fetch(url,
        {
          headers: {
            "X-Api-Key": API_KEY
          }
        }
      );
      if (data.status !== 200) throw new GraphQLError("API Ninja Error");

      const response: APIPhone = await data.json();

      if (!response.is_valid) throw new GraphQLError("Not valid phone format")
      const country = response.country;
      const timezone = response.timezones[0];

      const { insertedId } = await ctx.ContactsCollection.insertOne({
        name,
        phone,
        country,
        timezone,
      })

      return {
        _id: insertedId,
        name,
        phone,
        country,
        timezone,
      }
    },
    updateOne: async (_: unknown, args: UpdateContactMutationArgs, ctx: Context): Promise<ContactModel> => {
      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new GraphQLError("You need the Api Ninja API_KEY");

      const { id, phone, name } = args;
      if (!phone && !name) {
        throw new GraphQLError("You must at least update one value");
      }

      if (!phone) {
        const newUser = await ctx.ContactsCollection.findOneAndUpdate({
          _id: new ObjectId(id)
        }, {
          $set: { name }
        });
        if (!newUser) throw new GraphQLError("User not found!");
        return newUser;
      }

      const phoneExists = await ctx.ContactsCollection.findOne({ phone });
      if (phoneExists && phoneExists._id.toString() !== id) throw new GraphQLError("Phone already taken by Diego");

      if (phoneExists) {
        const newUser = await ctx.ContactsCollection.findOneAndUpdate({
          _id: new ObjectId(id)
        }, {
          $set: { name: name || phoneExists.name }
        });
        if (!newUser) throw new GraphQLError("User not found!");
        return newUser;
      }
      // phone has changed
      const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`;
      const data = await fetch(url,
        {
          headers: {
            "X-Api-Key": API_KEY
          }
        }
      );
      if (data.status !== 200) throw new GraphQLError("API Ninja Error");

      const response: APIPhone = await data.json();

      if (!response.is_valid) throw new GraphQLError("Not valid phone format")

      const country = response.country;
      const timezone = response.timezones[0];

      const newUser = await ctx.ContactsCollection.findOneAndUpdate({
        _id: new ObjectId(id)
      }, {
        name,
        phone,
        country,
        timezone,
      })
      return newUser;
    }
  },

  Contact: {
    id: (parent: ContactModel): string => parent._id!.toString(),
    time: async (parent: ContactModel): Promise<string> => {
      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new GraphQLError("You need the Api Ninja API_KEY");

      const timezone = parent.timezone;
      const url = `https://api.api-ninjas.com/v1/worldtime?timezone=${timezone}`;

      const data = await fetch(url,
        {
          headers: {
            "X-Api-Key": API_KEY
          }
        }
      );
      if (data.status !== 200) throw new GraphQLError("API NINJA ERROR");

      const response: APITime = await data.json();
      return response.datetime;
    }
  }
}