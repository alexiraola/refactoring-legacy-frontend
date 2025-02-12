import { describe, expect, it } from "vitest";
import { Book } from "../../../../frontend/domain/book";
import { filterBooks } from "../../../../frontend/domain/services/FilterBooks";

describe('Filter book', () => {
  it('retrieves all books when the filter is all', () => {
    const aBook = Book.create('Book 1', 'https://example.com/cover.jpg');
    const anotherBook = Book.create('Book 2', 'https://example.com/cover.jpg');

    aBook.toggleCompleted();

    const books = [aBook, anotherBook];

    const filteredBooks = filterBooks(books, 'all');

    expect(filteredBooks).toEqual(books);
  });

  it('retrieves only completed books when the filter is completed', () => {
    const aBook = Book.create('Book 1', 'https://example.com/cover.jpg');
    const anotherBook = Book.create('Book 2', 'https://example.com/cover.jpg');

    aBook.toggleCompleted();

    const books = [aBook, anotherBook];

    const filteredBooks = filterBooks(books, 'completed');

    expect(filteredBooks).toEqual([aBook]);
  });

  it('retrieves only incompleted books when the filter is incomplete', () => {
    const aBook = Book.create('Book 1', 'https://example.com/cover.jpg');
    const anotherBook = Book.create('Book 2', 'https://example.com/cover.jpg');

    aBook.toggleCompleted();

    const books = [aBook, anotherBook];

    const filteredBooks = filterBooks(books, 'incomplete');

    expect(filteredBooks).toEqual([anotherBook]);
  });
});
