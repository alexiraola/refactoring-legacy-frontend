import { v4 as uuid } from "uuid";
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
    public pictureUrl: string,
    public completed: boolean
  ) { }

  static create(title: string, cover: string): Book {
    const bookTitle = BookTitle.create(title);
    // this.ensureIsValidTitle(title);
    this.ensureIsValidCover(cover);
    return new Book(uuid(), bookTitle, cover, false);
  }

  static createFromDto(book: BookDto): Book {
    const title = BookTitle.create(book.title);
    // this.ensureIsValidTitle(book.title);
    this.ensureIsValidCover(book.pictureUrl);
    return new Book(book.id, title, book.pictureUrl, book.completed);
  }

  updateTitle(title: string) {
    // Book.ensureIsValidTitle(title);
    this.title = BookTitle.create(title);
  }

  updateCover(cover: string) {
    Book.ensureIsValidCover(cover);
    this.pictureUrl = cover;
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
      pictureUrl: this.pictureUrl,
      completed: this.completed
    }
  }

  private static ensureIsValidCover(cover: string) {
    if (!isValidUrl(cover)) {
      throw new Error('Error: The cover url is not valid');
    }
  }
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  }
  catch (e) {
    return false;
  }
}
