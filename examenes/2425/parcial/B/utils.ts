import { Collection, ObjectId } from "mongodb";
import { Author, AuthorModel, Book, BookModel } from "./types.ts";

export const fromAuthorModelToAuthor = (
  authorModel: AuthorModel
): Partial<Author> => {
  return {
    id: authorModel._id!.toString(),
    name: authorModel.name,
  };
};

export const fromBookModelToBook = async (
  bookModel: BookModel,
  AuthorsCollection: Collection<AuthorModel>
): Promise<Book> => {
  const authors = await AuthorsCollection.find({
    _id: { $in: bookModel.authors },
  }).toArray();
  return {
    id: bookModel._id!.toString(),
    title: bookModel.title,
    authors: authors.map(fromAuthorModelToAuthor),
    numberOfCopies: bookModel.numberOfCopies,
  };
};

export const verifyAuthors = async (
  ids: string[],
  AuthorsCollection: Collection<AuthorModel>
): Promise<boolean> => {
  const authors = await AuthorsCollection.find({
    _id: { $in: ids.map((id) => new ObjectId(id)) },
  }).toArray();
  return authors.length === ids.length;
};
