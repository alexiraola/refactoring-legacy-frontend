import { Book } from "../book";

export function countCompletedBooks(books: Book[]): number {
  return books.filter(b => b.completed).length;
}
