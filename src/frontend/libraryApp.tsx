import * as React from "react";
import { LibraryService } from "./application/library.service";
import BookItem from "./Book";
import { Book, BookDto } from "./domain/book";
import { filterBooks } from "./domain/services/filter.books";

type FilterType = 'all' | 'completed' | 'incomplete';

type LibraryProps = { service: LibraryService };
type LibraryState = {
  collection: BookDto[];
  bookTitle: string;
  bookCover: string;
  counter: number;
  filter: FilterType;
}

export class LibraryApp extends React.Component<LibraryProps, LibraryState> {
  collection: BookDto[] = [];
  bookTitle = '';
  bookCover = '';
  counter = 0;
  filter: FilterType = 'all';

  constructor(props: LibraryProps) {
    super(props);

    this.initialize();
  }

  async initialize() {
    const data = await this.props.service.getBooks();
    this.collection = data.map(b => b.toDto());
    this.forceUpdate();
  }

  onTitleChange(event) {
    var value = event.target.value;
    this.bookTitle = value;
    this.forceUpdate();
  }

  onCoverChange(event) {
    var value = event.target.value;
    this.bookCover = value;
    this.forceUpdate();
  }

  async add() {
    try {
      const book = await this.props.service.addBook(this.collection.map(b => Book.createFromDto(b)), this.bookTitle, this.bookCover);
      this.collection.push(book.toDto());
      this.bookTitle = '';
      this.bookCover = '';
      this.forceUpdate();
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  async update(bookDto: BookDto, bookTitle: string, bookCover: string) {
    try {
      const book = await this.props.service.updateBook(this.collection.map(b => Book.createFromDto(b)), bookDto, bookTitle, bookCover);
      const index = this.collection.findIndex(b => b.id == book.id);
      this.collection[index] = book.toDto();
      this.forceUpdate();
    } catch (e) {
      alert(e.message);
    }
  }

  async delete(bookDto: BookDto) {
    const book = Book.createFromDto(bookDto);
    await this.props.service.deleteBook(book);
    const index = this.collection.findIndex(b => b.id == book.id);

    if (this.collection[index].completed) {
      this.counter--;
    }
    this.collection.splice(index, 1);
    this.forceUpdate();
  }

  async toggleComplete(bookDto: BookDto) {
    const book = await this.props.service.toggleComplete(Book.createFromDto(bookDto));
    const index = this.collection.findIndex(b => b.id == book.id);
    this.collection[index] = book.toDto();
    this.forceUpdate();
  }

  setFilter(filter) {
    this.filter = filter;
    this.forceUpdate();
  }

  render() {
    const books = filterBooks(this.collection, this.filter);

    return (
      <div className="app-container">
        <h1>LIBRARY APP</h1>
        <div>
          <input
            data-testid="title"
            className="library-input"
            value={this.bookTitle}
            placeholder={'Book Title'}
            onChange={this.onTitleChange.bind(this)}
          />
          <input
            data-testid="cover"
            className="library-input"
            value={this.bookCover}
            placeholder={'Cover Url'}
            onChange={this.onCoverChange.bind(this)}
          />
        </div>
        <button data-testid="add" className="library-button add-book-button" onClick={this.add.bind(this)}>
          Add Book
        </button>
        <h2>Books Read: {this.counter}</h2>
        <div>
          <button data-testid="showAllBooks" className="library-button all-filter" onClick={this.setFilter.bind(this, 'all')}>All</button>
          <button data-testid="showReadBooks" className="library-button completed-filter" onClick={this.setFilter.bind(this, 'completed')}>Read</button>
          <button data-testid="showUnreadBooks" className="library-button incomplete-filter" onClick={this.setFilter.bind(this, 'incomplete')}>Unread</button>
        </div>
        <ul data-testid="books" className="book-list">
          {books.map((book, index) => <BookItem book={Book.createFromDto(book)}
            onMarkAsReadClicked={() => this.toggleComplete(book)}
            onDeleteClicked={() => this.delete(book)}
            onEdit={(title, cover) => {
              this.update(book, title, cover);
            }}
          />
          )}
        </ul>
      </div>
    );
  }
}
