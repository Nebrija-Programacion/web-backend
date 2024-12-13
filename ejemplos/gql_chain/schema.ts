export const schema = `#graphql
type User{
    id: ID!
    name: String!
    email: String!
    friends: [User!]!
    numberOfFriends: Int!
}

type Query{
    users: [User!]!
    user(email: String!): User
}

type Mutation{
    addUser(name: String!, email: String!, friends: [ID!]!): User!
    addFriend(user: ID!, friend: ID!):User!
}


`