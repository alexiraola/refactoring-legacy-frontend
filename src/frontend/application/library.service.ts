import { Book } from "../domain/book";
import { BookRepository } from "../domain/book.repository";

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
    book.updateTitle(title);
    book.updateCover(cover);

    this.ensureThatBookIsNotRepeated(book, books);

    await this.bookRepository.update(book);

    return book;
  }

  async deleteBook(book: Book) {
    return this.bookRepository.remove(book);
  }

  async toggleComplete(book: Book) {
    book.toggleCompleted();
    await this.bookRepository.update(book);

    return book;
  }

  private ensureThatBookIsNotRepeated(book: Book, books: Book[]) {
    books.forEach(b => {
      if (b.toDto().title == book.toDto().title) {
        throw new Error('Error: The title is already in the collection.');
      }
    });
  }
}
