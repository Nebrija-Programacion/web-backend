export const schema = `#graphql
type Dinosaur {
  id: ID!
  name: String!
  type: String!
}

type Query {
  dinosaurs: [Dinosaur!]!
  dinosaur(id: ID!): Dinosaur
}

type Mutation {
  addDinosaur(name: String!, type: String!): Dinosaur!
  deleteDinosaur(id: ID!): Dinosaur
}
`;
