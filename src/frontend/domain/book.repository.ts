import { Book } from "./book";

export interface BookRepository {
  getAll(): Promise<Book[]>
  add(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  remove(book: Book): Promise<void>;
}
