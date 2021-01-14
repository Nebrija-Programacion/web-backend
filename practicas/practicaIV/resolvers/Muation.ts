import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { TaskSchema, UserSchema } from "../mongo/schema.ts";
import { IContext, IUser, ITask } from "../types.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
interface IAddTaskArgs {
  task: {
    id: string;
    name: string;
    description: string;
    year: number;
    month: number;
    day: number;
    status: string;
    assignee: string;
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

interface IAddUserArgs{
  email: string,
  name: string,
}

const Mutation = {
  addTask: async (
    parent: any,
    args: IAddTaskArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      console.log("Estoy aquí");
      const db: Database = ctx.db;
      const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>(
        "Tasks"
      );

      console.log(`id: ${args.task.id}`);
      const found = await tasksCollection.findOne({ id: args.task.id });
      if (found) throw new GQLError("task with id already in DB");

      const { name, description, id, status, year, day, month, assignee } = args.task;
      const task = {
        name,
        description,
        id,
        status,
        assignee,
        date: new Date(year, month, day),
        reporter: ctx.user.email,
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
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>(
        "Users"
      );

      const found = await UsersCollection.findOne({ email: args.email });
      if (found) throw new GQLError("user with email already in DB");
      await UsersCollection.insertOne({ name: args.name, email: args.email });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  removeTask: async (
    parent: any,
    args: IRemoveTaskArgs,
    ctx: IContext
  ): Promise<boolean> => {
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
  ): Promise<boolean> => {
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

  completeTask: async (
    parents: any,
    args: { id: string },
    ctx: IContext
  ): Promise<boolean> => {
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

  startTask: async (
    parent: any,
    args: { id: string },
    ctx: IContext
  ): Promise<boolean> => {
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

  signin: async (
    parent: any,
    args: { email: string; password: string },
    ctx: IContext
  ):Promise<Boolean> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("Users")
        .findOne({ email: args.email });
      if (exists) {
        throw new GQLError(`User with email ${args.email} already exists`);
      }
      await ctx.db
        .collection<UserSchema>("Users")
        .insertOne({ email: args.email, password: args.password, token: "" });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  login: async (
    parent: any,
    args: { email: string; password: string },
    ctx: IContext
  ): Promise<string> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("Users")
        .findOne({ email: args.email, password: args.password });
      if (exists) {
        const token = v4.generate();
        await ctx.db
          .collection<UserSchema>("Users")
          .updateOne({ email: args.email }, { $set: { token } });
        setTimeout(() => {
          ctx.db
            .collection<UserSchema>("Users")
            .updateOne({ email: args.email }, { $set: { token: "" } });
        }, 60 * 60 * 1000);
        return token;
      } else {
        throw new GQLError("User and password do not match");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  logout: async (parent: any, args: {}, ctx: IContext): Promise<boolean> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("Users")
        .findOne({ email: ctx.user.email, token: ctx.user.token });
      if (exists) {
        await ctx.db
          .collection<UserSchema>("Users")
          .updateOne({ email: ctx.user.email }, { $set: { token: "" } });
        return true;
      } else {
        throw new GQLError("Unexpected error");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  deleteUser: async (parent: any, args: {}, ctx: IContext): Promise<boolean> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("Users")
        .findOne({ email: ctx.user.email, token: ctx.user.token });
      if (exists) {
        await ctx.db
          .collection<UserSchema>("Users")
          .deleteOne({ email: ctx.user.email });
        return true;
      } else {
        throw new GQLError("Unexpected error");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },
};

export {Mutation }