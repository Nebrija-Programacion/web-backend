import "babel-polyfill";
import { ObjectID } from "mongodb";

const Mutation = {
  addAuthor: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const { mame, email } = args;
    const collection = db.collection("authors");
    const authorData = await collection.findOne({ email });

    if (authorData) {
      throw new Error(`Author with email ${email} exists in database`);
    }

    const author = {
      name,
      email,
    };

    const result = await collection.insertOne(author);
    return result.ops[0];
  },

  addIngredient: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const collection = db.collection("ingredients");
    const ingredientData = await collection.findOne({ name: args.name });

    if (ingredientData) {
      throw new Error(`Ingredient with name ${args.name} exists in database`);
    }
    const ingredient = {
      name: args.name,
    };

    const result = await collection.insertOne(ingredient);
    return result.ops[0];
  },

  addRecipe: async (parent, args, ctx, info) => {
    const { title, description, author, ingredients } = args;
    const { db } = ctx;
    const collectionRecipes = db.collection("recipes");
    const collectionIngredients = db.collection("ingredients");
    const collectionAuthors = db.collection("authors");

    const authorData = collectionAuthors.findOne({ _id: ObjectID(author) });
    if (!authorData) throw new Error(`Unknown author ${author}`);

    const ingredientsIDs = ingredients.map((obj) => ObjectID(obj));

    const query = { _id: { $in: ingredients.map((obj) => ObjectID(obj)) } };

    const ingredientsFound = await collectionIngredients.find(query).toArray();

    if (ingredients.length !== ingredientsFound.length)
      throw new Error(`Unknown ingredient`);

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const recipe = {
      title,
      description,
      author: ObjectID(author),
      ingredients: ingredients.map((obj) => ObjectID(obj)),
      date: `${day}/${month}/${year}`,
    };

    const result = await collectionRecipes.insertOne(recipe);

    return result.ops[0];
  },

  removeRecipe: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const collection = db.collection("recipes");
    const toRemove = await collection.findOne({ _id: ObjectID(args.id) });
    if (toRemove) await collection.deleteOne({ _id: ObjectID(args.id) });

    return toRemove;
  },
  removeAuthor: async (parent, args, ctx, info) => {
    const { db } = ctx;
    const authorsCollection = db.collection("authors");
    const recipesCollection = db.collection("recipes");
    const author = await authorsCollection.findOne({
      _id: ObjectID(args.id),
    });

    if (author) {
      await Promise.all([
        authorsCollection.deleteOne({ _id: ObjectID(args.id) }),
        recipesCollection.deleteMany({ author: ObjectID(args.id) }),
      ]);
    }

    return author;
  },
};

export { Mutation as default };
