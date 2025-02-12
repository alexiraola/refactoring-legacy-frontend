import { Book, BookDto } from "../domain/book";
import { BookRepository } from "../domain/book.repository";

export class ApiBookRepository implements BookRepository {
  constructor(private readonly baseUrl: string) { }

  async getAll(): Promise<Book[]> {
    const response = await fetch(this.baseUrl);
    const data = await response.json() as BookDto[];
    return data.map(b => Book.createFromDto(b));
  }

  async add(book: Book): Promise<void> {
    await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book.toDto()),
    });
  }

  async update(book: Book): Promise<void> {
    await fetch(`${this.baseUrl}/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book.toDto()),
    })
  }

  async remove(book: Book): Promise<void> {
    await fetch(`${this.baseUrl}/${book.id}`, { method: 'DELETE' });
  }
}
