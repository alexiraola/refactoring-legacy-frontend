import { BookDto } from "../book";

export function countCompletedBooks(books: BookDto[]): number {
  return books.filter(b => b.completed).length;
}
