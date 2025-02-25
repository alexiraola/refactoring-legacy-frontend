import { Book } from "../domain/book";
import { BookRepository } from "../domain/book.repository";

export class RepeatedTitleError extends Error {
  constructor() {
    super("Error: The title is already in the collection.");
  }
}

export class LibraryService {
  constructor(private readonly bookRepository: BookRepository) { }

  getBooks() {
    return this.bookRepository.getAll();
  }

  async addBook(books: Book[], title: string, cover: string) {
    const book = Book.create(title, cover);

    this.ensureThatBookIsNotRepeated(book, books);

    await this.bookRepository.add(book);

    return book;
  }

  async updateBook(books: Book[], book: Book, title: string, cover: string) {
    const updatedBook = Book.createFromBook(book);
    updatedBook.updateTitle(title);
    updatedBook.updateCover(cover);

    this.ensureThatBookIsNotRepeated(updatedBook, books);

    await this.bookRepository.update(updatedBook);

    return updatedBook;
  }

  async deleteBook(book: Book) {
    return this.bookRepository.remove(book);
  }

  async toggleComplete(book: Book) {
    const updatedBook = Book.createFromBook(book);
    updatedBook.toggleCompleted();
    await this.bookRepository.update(updatedBook);

    return updatedBook;
  }

  private ensureThatBookIsNotRepeated(book: Book, books: Book[]) {
    books.filter(b => !book.equals(b)).forEach(b => {
      if (b.toDto().title == book.toDto().title) {
        throw new RepeatedTitleError();
      }
    });
  }
}
