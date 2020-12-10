import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

const Schema = gql`
  type User {
    email: String!
    name: String!
  }

  type Task {
    id: String!
    name: String!
    description: String
    year: Int!
    date: String!
    assignee: User!
    reporter: User!
  }

  input TaskInput {
    id: String!
    name: String!
    description: String
    year: Int!
    month: Int!
    day: Int!
    status: String!
    assignee_mail: String!
    reporter_mail: String!
  }

  type Query {
    getTask(id: String!): Task
    getTasks: [Task!]!
    getTaskByStatus(status: String!): [Task!]!
    getTaskByDate(year: Int!, month: Int!, day: Int!): [Task!]!
  }

  type Mutation {
    addUser(name: String!, email:String!): Boolean!
    addTask(task: TaskInput!): Boolean!
    removeTask(id: String!): Boolean!
    updateTask(task: TaskInput!): Boolean!
    completeTask(id: String!): Boolean!
    startTask(id: String!): Boolean!
  }
`;

export { Schema };
