import { OptionalId, ObjectId } from "mongodb";
export type BookModel = OptionalId<{
  title: string;
  authors: ObjectId[];
  numberOfCopies: number;
}>;

export type AuthorModel = OptionalId<{
  name: string;
  biography: string;
}>;

export type Author = {
  id: string;
  name: string;
  biography: string;
};

export type Book = {
  id: string;
  title: string;
  authors: Partial<Author>[];
  numberOfCopies: number;
};
