import { afterEach, describe, it } from "vitest";
import { Book } from "../../frontend/domain/book";
import { ApiBookRepository } from "../../frontend/infrastructure/api.book.repository";

describe('Book repository', () => {
  const repository = new ApiBookRepository('http://localhost:3000/api');

  afterEach(async () => {
    const books = await repository.getAll();

    for (const book of books) {
      await repository.remove(book);
    }
  });

  it('should get all books', async () => {
    const book = Book.create('Book', 'https://example.com/cover.jpg');

    await repository.add(book);

    const books = await repository.getAll();

    expect(books).toEqual([book]);
  });

  it('should add a book', async () => {
    const book = Book.create('Book', 'https://example.com/cover.jpg');

    await repository.add(book);

    const books = await repository.getAll();

    expect(books).toContainEqual(book);
  });

  it('should remove a book', async () => {
    const book = Book.create('Book', 'https://example.com/cover.jpg');

    await repository.add(book);

    const books = await repository.getAll();

    expect(books).toEqual([book]);

    await repository.remove(book);

    const booksAfterRemove = await repository.getAll();

    expect(booksAfterRemove).toEqual([]);
  });

  it('should update a book', async () => {
    const book = Book.create('Book', 'https://example.com/cover.jpg');

    await repository.add(book);

    const books = await repository.getAll();

    expect(books).toEqual([book]);

    book.updateTitle('Updated book');

    await repository.update(book)

    const updatedBooks = await repository.getAll();

    expect(updatedBooks).toEqual([book]);
  });
});
