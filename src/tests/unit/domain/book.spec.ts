import { describe, it, expect } from "vitest";
import { Book } from "../../../frontend/domain/book";

describe('The Book', () => {
  it('should create a Book with valid title and cover', () => {
    const book = Book.create('Book title', 'https://example.com/cover.jpg');

    expect(book.title).toBe('Book title');
    expect(book.pictureUrl).toBe('https://example.com/cover.jpg');
    expect(book.id).toMatch(/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/);
  });

  it('should not create a Book with an invalid cover url', () => {
    expect(() => {
      Book.create('Book title', 'httpsexample.com/cover.jpg');
    }).toThrow('Error: The cover url is not valid');
  });

  it('should not create a Book with a title shorter than 3 characters', () => {
    expect(() => {
      Book.create('Bo', 'https://example.com/cover.jpg');
    }).toThrow('Error: The title must be between 3 and 100 characters long.');
  });

  it('should not create a Book with a title that contains invalid characters', () => {
    expect(() => {
      Book.create('Book!', 'https://example.com/cover.jpg');
    }).toThrow('Error: The title can only contain letters, numbers, and spaces');
  });

  it('should not create a Book with a title that contains forbidden words', () => {
    expect(() => {
      Book.create('Book banned', 'https://example.com/cover.jpg');
    }).toThrow('Error: The title cannot include the prohibited word "banned"');
  });
});
