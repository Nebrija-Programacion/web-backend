import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";

export interface ITask {
  id: string;
  name: string;
  description?: string;
  status: string;
  date: string;
  reporter: string;
  assignee: string;
}


export interface IUser {
  name: string;
  email: string;
  token: string;
}

export interface IContext {
  db: Database;
  user: IUser;
}

