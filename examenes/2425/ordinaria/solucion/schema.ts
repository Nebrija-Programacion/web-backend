export const typeDefs = `#graphql

type Restaurant {
  id: ID!
  name: String!
  address: String!
  phone: String!
  localtime: String!
  temperature: Int!
}

type Query {
  getRestaurants(city: String!): [Restaurant!]!
  getRestaurant(id: ID!): Restaurant
}

type Mutation {
  addRestaurant(
    name: String!
    address: String!
    phone: String!
    city: String!
  ): Restaurant
  deleteRestaurant(id: ID!): Boolean!
}
`;
