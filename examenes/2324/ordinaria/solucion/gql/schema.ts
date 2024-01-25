export const typeDefs = `#graphql
  type Contact {
    id: ID!
    name: String!
    phone: String!
    country: String!
    time: String!
}
    
type Query {
    getContacts: [Contact!]!
    getContact(id: ID!): Contact!
}

type Mutation {
    addContact(name: String!, phone: String!): Contact!
    updateContact(id: ID!, name: String, phone: String): Contact!
    deleteContact(id: ID!): Boolean!
} 
`;
