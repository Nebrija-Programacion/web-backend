import "babel-polyfill";
import { ObjectID } from "mongodb";

const Query = {
  recipes: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const { author } = args;
    const collection = db.collection("recipes");
    if (author) collection.find({ author }).toArray();
    else return collection.find({}).toArray();
  },

  recipe: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const collection = db.collection("recipes");
    return collection.findOne({ _id: args.id });
  },

  authors: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const collection = db.collection("authors");
    return collection.find({}).toArray();
  },
  author: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const collection = db.collection("authors");
    return collection.findOne({ _id: ObjectID(args.id) });
  },

  ingredients: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const collection = db.collection("ingredients");
    return collection.find({}).toArray();
  },

  ingredient: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const collection = db.collection("ingredients");
    return collection.findOne({ _id: ObjectID(args.id) });
  },
};

export { Query as default };
