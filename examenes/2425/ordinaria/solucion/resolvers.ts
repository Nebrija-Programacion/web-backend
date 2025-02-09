import { Collection, ObjectId } from "mongodb";
import { RestaurantModel } from "./types.ts";
import {
  getCityData,
  getPhoneData,
  getTemperature,
  getWorldTime,
} from "./utils.ts";
import { GraphQLError } from "graphql";

type Context = {
  ResturantsCollection: Collection<RestaurantModel>;
};

type AddRestaurantMutationArgs = {
  name: string;
  address: string;
  phone: string;
  city: string;
};

/**
 * Resolvers for the GraphQL schema
 */
export const resolvers = {
  Restaurant: {
    id: (parent: RestaurantModel) => parent._id!.toString(),
    address: (parent: RestaurantModel) =>
      `${parent.address}, ${parent.city}, ${parent.country}`,
    localtime: async (parent: RestaurantModel, _: unknown, ctx: Context) => {
      const { latitude, longitude } = parent;
      return await getWorldTime(latitude, longitude);
    },
    temperature: async (parent: RestaurantModel) => {
      const { latitude, longitude } = parent;
      return await getTemperature(latitude, longitude);
    },
  },
  Query: {
    getRestaurants: async (
      _: unknown,
      { city }: { city: string },
      ctx: Context
    ): Promise<RestaurantModel[]> => {
      return await ctx.ResturantsCollection.find({ city }).toArray();
    },
    getRestaurant: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context
    ): Promise<RestaurantModel | null> => {
      return await ctx.ResturantsCollection.findOne({ _id: new ObjectId(id) });
    },
  },

  Mutation: {
    deleteRestaurant: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context
    ): Promise<boolean> => {
      const result = await ctx.ResturantsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      return result.deletedCount === 1;
    },
    addRestaurant: async (
      _: unknown,
      args: AddRestaurantMutationArgs,
      ctx: Context
    ): Promise<RestaurantModel> => {
      const { name, address, phone, city } = args;
      // check if phone is already present in the DDBB
      const phoneExists = await ctx.ResturantsCollection.findOne({
        phone,
      });

      if (phoneExists) {
        throw new GraphQLError("Phone number already in use");
      }

      // check if phone is valid using API NINJAS
      const phoneData = await getPhoneData(phone);

      if (!phoneData.is_valid) {
        throw new GraphQLError("Invalid phone number");
      }

      // get city data from API NINJAS
      const cityData = await getCityData(city);

      // check if there is any city in the phone data country
      const cityExists = cityData.find(
        (city) => city.country === phoneData.country
      );

      if (!cityExists) {
        throw new GraphQLError("City not found in phone country");
      }

      // get latitude and longitude for the right city

      const { latitude, longitude, country } = cityExists;

      // insert restaurant
      const { insertedId } = await ctx.ResturantsCollection.insertOne({
        name,
        address,
        phone,
        city,
        country,
        latitude,
        longitude,
      });

      return {
        _id: insertedId,
        name,
        address,
        phone,
        city,
        country,
        latitude,
        longitude,
      };
    },
  },
};
