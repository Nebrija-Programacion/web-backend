// The GraphQL schema
export const typeDefs = `#graphql
  type Pet {
    id: ID!
    name: String!
    breed: String!
    owner: Person!
  }

  type Person {
    id: ID!
    name: String!
    age: Int!
    pets: [Pet!]!
  }

  type Query {
    pets: [Pet!]!
    pet(id: ID!): Pet!
    persons: [Person!]!
    person(id: ID!): Person!
  }
  type Mutation {
    addPet(name: String!, breed: String!, owner:ID!): Pet!
    deletePet(id: ID!): Pet!
    updatePet(id: ID!, name: String, breed: String, owner:ID): Pet!
    addPerson(name: String!, age: Int!): Person!
    deletePerson(id: ID!): Person!
    updatePerson(id: ID!, name: String, age: Int): Person!
  }
`;
