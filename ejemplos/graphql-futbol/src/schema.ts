import { gql } from "graphql_tag";

export const typeDefs = gql`
  scalar Date
  type Team {
    id: ID!
    name: String!
    matches: [Match!]!
    players: [Player!]!
    goals_for: Int!
    goals_against: Int!
    classified: Boolean!
  }

  enum MatchStatus {
    PENDING
    FINISHED
    PLAYING
  }

  type Match {
    id: ID!
    team1: Team!
    team2: Team!
    goals_team1: Int!
    goals_team2: Int!
    date: String!
    status: MatchStatus!
  }

  type Player {
    id: ID!
    name: String!
    team: Team
  }

  type Query {
    teams(classified: Boolean): [Team!]!
    team(id: ID!): Team!
    matches(status: MatchStatus, team: ID, date: Date): [Match!]!
    match(id: ID!): Match!
    players(team_id: ID): [Player!]!
    player(id: ID!): Player!
  }

  type Mutation {
    createTeam(name: String!, players: [ID!]!, classified: Boolean!): Team!
    updateTeam(id: ID!, players: [ID!], classified: Boolean): Team!
    deleteTeam(id: ID!): Team!

    createMatch(
      team1: ID!
      team2: ID!
      goals_team1: Int!
      goals_team2: Int!
      date: String!
      status: MatchStatus!
    ): Match!
    updateMatch(
      id: ID!
      goals_team1: Int!
      goals_team2: Int!
      status: MatchStatus!
    ): Match!
    deleteMatch(id: ID!): Match!

    createPlayer(name: String): Player!
    deletePlayer(id: ID!): Player!
  }
`;
