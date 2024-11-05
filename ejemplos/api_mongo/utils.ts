import type { Collection } from "mongodb";
import type { BookModel, User, UserModel } from "./types.ts";
import type { Book } from "./types.ts";

export const fromModelToUser = async (
  userDB: UserModel,
  booksCollection: Collection<BookModel>
): Promise<User> => {
  const books = await booksCollection
    .find({ _id: { $in: userDB.books } })
    .toArray();
  return {
    id: userDB._id!.toString(),
    name: userDB.name,
    email: userDB.email,
    age: userDB.age,
    books: books.map((b) => fromModelToBook(b)),
  };
};

export const fromModelToBook = (model: BookModel): Book => ({
  id: model._id!.toString(),
  title: model.title,
  pages: model.pages,
});
