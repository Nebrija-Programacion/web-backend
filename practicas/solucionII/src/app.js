import fs from "fs";
import * as uuid from "uuid";

import { GraphQLServer } from "graphql-yoga";

let receiptsData = [
  {
    id: "1",
    title: "Tarta de queso",
    description: "Hay que hacerla",
    date: "28/02/2012",
    author: "1",
    ingredients: ["1", "2"]
  }
];

let authorsData = [
  {
    id: "1",
    name: "Alberto",
    email: "alberto.valero.gomez@gmail.com"
  },
  {
    id: "2",
    name: "Nieves",
    email: "nieves@gmail.com"
  }
];

let ingredientsData = [
  {
    name: "Fresas",
    id: "1"
  },
  {
    name: "Queso",
    id: "2"
  },
  {
    name: "Frambuesas",
    id: "3"
  }
];

const runApp = function(receiptsData, ingredientData, authorsData) {
  const typeDefs = `
    type Query {
      receipts: [Receipt!]
      authors: [Author!]
      ingredients: [Ingredient!]
    }

    type Mutation {
      addAuthor(name: String!, email: String!): Author!
      addIngredient(name: String!): Ingredient!
      addReceipt(title: String!, description: String!, author: ID!, ingredients: [ID!]): Receipt!
      removeAuthor(id: ID!): Author
      removeReceipt(id: ID!): Receipt
      removeIngredient(id: ID!): Ingredient
      updateIngredient(id: ID!, name: String!): Ingredient!
      updateAuthor(id: ID!, name: String, email: String): Author!
      udpateReceipt(id:ID!, title: String, description: String, author: ID, ingredients: [ID!]): Receipt!
    }

    type Receipt {
      id: ID!
      title: String!
      description: String!
      date: String!
      author: Author!
      ingredients: [Ingredient!]!
    }

    type Author {
      id: ID!
      name: String!
      email: String!
      receipts: [Receipt!]
    }

    type Ingredient {
      id: ID!
      name: String!
      receipts: [Receipt!]

    }
  `;

  const resolvers = {
    Query: {
      receipts: (parent, args, ctx, info) => {
        return receiptsData;
      },
      authors: (parent, args, ctx, info) => {
        return authorsData;
      },
      ingredients: (parent, args, ctx, info) => {
        return ingredientsData;
      }
    },
    Mutation: {
      addAuthor: (parent, args, ctx, info) => {
        const { name, email } = args;
        if (authorsData.some(author => author.email === email))
          throw new Error(`Author with email ${args.email} exists in database`);
        const author = {
          name,
          email,
          id: uuid.v4()
        };

        authorsData.push(author);
        return author;
      },

      addIngredient: (parent, args, ctx, info) => {
        if (ingredientData.some(ing => ing.name === args.name))
          throw new Error(`Ingrediente ${args.name} already in database`);

        const ingredient = {
          name: args.name,
          id: uuid.v4()
        };

        ingredientData.push(ingredient);
        return ingredient;
      },

      addReceipt: (parent, args, ctx, info) => {
        const { title, description, author, ingredients } = args;
        if (!authorsData.some(obj => obj.id === author))
          throw new Error(`Unknown author ${author}`);

        ingredients.forEach(ing => {
          if (!ingredientData.some(obj => obj.id === ing))
            throw new Error(`Unknown ingredient ${ing}`);
        });

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const receipt = {
          title,
          description,
          author,
          ingredients,
          id: uuid.v4(),
          date: `${day}/${month}/${year}`
        };

        receiptsData.push(receipt);
        return receipt;
      },

      removeReceipt: (parent, args, ctx, info) => {
        const receipt = receiptsData.find(obj => obj.id === args.id);
        if (receipt) receiptsData.splice(receiptsData.indexOf(receipt), 1);
        return receipt;
      },

      removeAuthor: (parent, args, ctx, info) => {
        const author = authorsData.find(obj => obj.id === args.id);
        if (author) {
          authorsData.splice(authorsData.indexOf(author), 1);
          receiptsData = receiptsData.filter(
            receipt => receipt.author !== author.id
          );
        }

        return author;
      },

      removeIngredient: (parent, args, ctx, info) => {
        const ingredient = ingredientsData.find(obj => obj.id === args.id);
        if (ingredient) {
          ingredientsData.splice(ingredientsData.indexOf(ingredients), 1);
          receiptsData = receiptsData.filter(receipt =>
            receipt.ingredients.includes(ingredient.id)
          );
        }

        return ingredient;
      },

      updateIngredient: (parent, args, ctx, info) => {
        const { name, id } = args;
        const ingredient = ingredientsData.find(obj => obj.id === id);
        if (!ingredient) throw new Error(`Ingredient with id ${id} not found`);

        ingredient.name = name || ingredient.name;
        return ingredient;
      },

      updateAuthor: (parent, args, ctx, info) => {
        const { id, name, email } = args;
        const author = authorsData.find(obj => obj.id === id);
        if (!author) {
          throw new Error(`Unknown author with id ${id}`);
        }

        author.name = name || author.name;
        author.email = email || author.email;

        return author;
      },

      udpateReceipt: (parent, args, ctx, info) => {
        const { id, title, description, author, ingredients } = args;
        const receipt = receiptsData.find(obj => obj.id === id);
        if (!receipt) {
          throw new Error(`Receipt with id ${id} not found`);
        }

        receipt.title = title || receipt.title;
        receipt.description = description || receipt.description;
        receipt.author = author || receipt.author;
        receipt.ingredients = ingredients || receipt.ingredients;

        return receipt;
      }
    },

    Receipt: {
      author: (parent, args, ctx, info) => {
        return authorsData.find(obj => obj.id === parent.author);
      },
      ingredients: (parent, args, ctx, info) => {
        return ingredientData.filter(obj =>
          parent.ingredients.some(ing => ing === obj.id)
        );
      }
    },

    Author: {
      receipts: (parent, args, ctx, info) => {
        return receiptsData.filter(obj => obj.author === parent.id);
      }
    },

    Ingredient: {
      receipts: (parent, args, ctx, info) => {
        return receiptsData.filter(receipt =>
          receipt.ingredients.includes(parent.id)
        );
      }
    }
  };

  const server = new GraphQLServer({ typeDefs, resolvers });

  const options = {
    port: 4000
  };

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
  }
};

// Fetch Data and then run app
runApp(receiptsData, ingredientsData, authorsData);
