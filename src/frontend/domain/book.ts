import { v4 as uuid } from "uuid";
import { BookCover } from "./valueObjects/book.cover";
import { BookTitle } from "./valueObjects/book.title";

export type BookDto = {
  id: string;
  title: string;
  pictureUrl: string;
  completed: boolean;
}

export class Book {
  constructor(
    private readonly id: string,
    private title: BookTitle,
    private cover: BookCover,
    public completed: boolean
  ) { }

  static create(title: string, cover: string): Book {
    const bookTitle = BookTitle.create(title);
    const bookCover = BookCover.create(cover);
    return new Book(uuid(), bookTitle, bookCover, false);
  }

  static createFromDto(book: BookDto): Book {
    const title = BookTitle.create(book.title);
    const cover = BookCover.create(book.pictureUrl);
    return new Book(book.id, title, cover, book.completed);
  }

  static createFromBook(book: Book): Book {
    return Book.createFromDto(book.toDto());
  }

  updateTitle(title: string) {
    this.title = BookTitle.create(title);
  }

  updateCover(cover: string) {
    this.cover = BookCover.create(cover);
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  equals(otherBook: Book) {
    return this.id === otherBook.id;
  }

  toDto(): BookDto {
    return {
      id: this.id,
      title: this.title.toString(),
      pictureUrl: this.cover.toString(),
      completed: this.completed
    }
  }
}
