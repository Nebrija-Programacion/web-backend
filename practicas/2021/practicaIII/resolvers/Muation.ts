import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";

import { TaskSchema, UserSchema } from "../mongo/schema.ts";

interface IAddTaskArgs {
  task: {
    id: string;
    name: string;
    description: string;
    year: number;
    month: number;
    day: number;
    status: string;
  }
}

interface IUpdateTaskArgs {
  task: {
    id: string;
    name: string;
    description: string;
    year: number;
    month: number;
    day: number;
    status: string;
  };
}

interface IRemoveTaskArgs {
  id: string
}

interface IContext {
  db: Database
}

interface ITask{
  id: string,
  name: string,
  description?: string,
  status: string,
  date: string,
}

interface IAddUserArgs{
  email: string,
  name: string,
}

const Mutation = {
  addTask: async (
    parent: any,
    args: IAddTaskArgs,
    ctx: IContext
  ): Promise<Boolean> => {
    try {
      console.log("Estoy aquí");
      const db: Database = ctx.db;
      const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>(
        "Tasks"
      );

      console.log(`id: ${args.task.id}`);
      const found = await tasksCollection.findOne({ id: args.task.id });
      if (found) throw new GQLError("task with id already in DB");

      const { name, description, id, status, year, day, month } = args.task;
      const task = {
        name,
        description,
        id,
        status,
        date: new Date(year, month, day),
      };
      await tasksCollection.insertOne(task);
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },
  addUser: async (
    parent: any,
    args: IAddUserArgs,
    ctx: IContext
  ): Promise<Boolean> => {
    try {
      const db: Database = ctx.db;
      const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>(
        "Users"
      );

      const found = await UsersCollection.findOne({ email: args.email });
      if (found) throw new GQLError("user with email already in DB");
      await UsersCollection.insertOne({name: args.name, email: args.email});
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  removeTask: async (
    parent: any,
    args: IRemoveTaskArgs,
    ctx: IContext
  ): Promise<Boolean> => {
    try {
      const db: Database = ctx.db;
      const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>(
        "Tasks"
      );
      await tasksCollection.deleteOne({ id: args.id });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  updateTask: async (
    parent: any,
    args: IUpdateTaskArgs,
    ctx: IContext
  ): Promise<Boolean> => {
    try {
      const db: Database = ctx.db;
      const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>(
        "Tasks"
      );

      const found = await tasksCollection.find({ id: args.task.id });
      if (!found) throw new GQLError("task with id does not exist");

      const { name, description, id, status, year, day, month } = args.task;
      const task = {
        name,
        description,
        id,
        status,
        date: new Date(year, month, day),
      };

      await tasksCollection.updateOne({ id: args.task.id }, task);
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  completeTask: async (parents: any, args: { id: string }, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>(
        "Tasks"
      );

      const found = await tasksCollection.findOne({ id: args.id });
      if (!found) throw GQLError("Task with id not found");

      await tasksCollection.updateOne({ id: args.id }, { status: "DONE" });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  startTask: async (parent: any, args: { id: string }, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>(
        "Tasks"
      );

      const found = await tasksCollection.findOne({ id: args.id });
      if (!found) throw GQLError("Task with id not found");

      await tasksCollection.updateOne({ id: args.id }, { status: "DOING" });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },
};

export {Mutation }