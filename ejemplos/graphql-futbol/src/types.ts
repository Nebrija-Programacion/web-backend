export type Team = {
  id: string;
  name: string;
  matches: Match[];
  players: Player[];
  goals_for: number;
  goals_against: number;
  classified: boolean;
};

export enum MatchStatus {
  PENDING = "PENDING",
  FINISHED = "FINISHED",
  PLAYING = "PLAYING",
}

export type Match = {
  id: string;
  team1: Team;
  team2: Team;
  goals_team1: number;
  goals_team2: number;
  date: Date;
  status: MatchStatus;
};

export type Player = {
  id: string;
  name: string;
  team?: Team;
};
