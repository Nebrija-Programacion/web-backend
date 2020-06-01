import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    recipes(author: ID): [Recipe]!
    recipe(id: ID!): Recipe!
    authors: [Author]!
    author(id: ID!): Author!
    ingredients: [Ingredient]!
    ingredient(id: ID!): Ingredient!
  }
  # type Mutation {
  #   addRecipe(
  #     title: String!
  #     description: String!
  #     author: ID!
  #     ingredients: [ID]!
  #   ): Recipe!
  #   updateRecipe(
  #     id: ID!
  #     title: String!
  #     description: String!
  #     author: ID!
  #     ingredients: [ID]!
  #   ): Recipe!
  #   addAuthor(name: String!, mail: String!): Author!
  #   addIngredient(name: String!): Ingredient!
  #   deleteRecipe(id: ID!): Recipe
  #   deleteAuthor(id: ID!): Author
  #   deleteIngredient(id: ID!): Ingredient
  # }

  type Recipe {
    _id: ID!
    title: String!
    description: String!
    date: String!
    author: Author!
    ingredients: [Ingredient!]
  }
  type Author {
    _id: ID!
    name: String!
    mail: String!
    recipes: [ID]!
  }
  type Ingredient {
    name: String!
    recipes: [ID]!
  }
`;

export { typeDefs as default };
