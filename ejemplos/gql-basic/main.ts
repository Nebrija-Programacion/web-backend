import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { Pet } from "./types.ts";

// Data

let pets: Pet[] = [
  { id: "1", name: "Pippin", breed: "Setter" },
  { id: "2", name: "Arwen", breed: "Labrador" },
  { id: "3", name: "Frodo", breed: "Pointer" },
  { id: "4", name: "Sam", breed: "Spaniel" },
  { id: "5", name: "Merry", breed: "Poodle" },
];

// The GraphQL schema
const typeDefs = `#graphql
  type Pet {
    id: ID!
    name: String!
    breed: String!
  }
  type Query {
    hello: String!
    pets: [Pet!]!
    pet(id: ID!): Pet!
  }
  type Mutation {
    addPet(id: ID!, name: String!, breed: String!): Pet!
    deletePet(id: ID!): Pet!
    updatePet(id: ID!, name: String!, breed: String!): Pet!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => "world",
    pets: () => pets,
    pet: (_: unknown, args: { id: string }) => {
      const pet = pets.find((pet) => pet.id === args.id);
      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return pet;
    },
  },
  Mutation: {
    addPet: (_: unknown, args: { id: string; name: string; breed: string }) => {
      const pet = {
        id: args.id,
        name: args.name,
        breed: args.breed,
      };
      pets.push(pet);
      return pet;
    },
    deletePet: (_: unknown, args: { id: string }) => {
      const pet = pets.find((pet) => pet.id === args.id);
      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      pets = pets.filter((pet) => pet.id !== args.id);
      return pet;
    },
    updatePet: (
      _: unknown,
      args: { id: string; name: string; breed: string }
    ) => {
      const pet = pets.find((pet) => pet.id === args.id);
      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      pet.name = args.name;
      pet.breed = args.breed;
      return pet;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
