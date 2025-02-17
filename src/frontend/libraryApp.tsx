import * as React from "react";
import BookItem from "./Book";
import { Book, BookDto } from "./domain/book";
import { filterBooks } from "./domain/services/filter.books";
import { Factory } from "./infrastructure/factory";

type FilterType = 'all' | 'completed' | 'incomplete';

export class LibraryApp extends React.Component<any, any> {
  collection: BookDto[] = [];
  bookTitle = '';
  bookCover = '';
  counter = 0;
  filter: FilterType = 'all';
  libraryService = Factory.createLibraryService();

  constructor(props) {
    super(props);

    this.libraryService.getBooks().then(this.onGetBooks)
      .catch(error => console.log(error));
  }

  onGetBooks = (data: Book[]) => {
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
      const book = await this.libraryService.addBook(this.collection.map(b => Book.createFromDto(b)), this.bookTitle, this.bookCover);
      this.onAddBook(book);
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  onAddBook(book: Book) {
    this.collection.push(book.toDto());
    this.bookTitle = '';
    this.bookCover = '';
    this.forceUpdate();
  }

  async update(bookDto: BookDto, bookTitle: string, bookCover: string) {
    try {
      const book = await this.libraryService.updateBook(this.collection.map(b => Book.createFromDto(b)), bookDto, bookTitle, bookCover);
      this.onUpdateBook(book);
    } catch (e) {
      alert(e.message);
    }
  }

  onUpdateBook(book: Book) {
    const index = this.collection.findIndex(b => b.id == book.id);
    this.collection[index] = book.toDto();
    this.forceUpdate();
  }

  async delete(bookDto: BookDto) {
    const book = Book.createFromDto(bookDto);
    await this.libraryService.deleteBook(book);
    this.onDeleteBook(book);
  }

  onDeleteBook = (book: Book) => {
    const index = this.collection.findIndex(b => b.id == book.id);

    if (this.collection[index].completed) {
      this.counter--;
    }
    this.collection.splice(index, 1);
    this.forceUpdate();
  }

  async toggleComplete(bookDto: BookDto) {
    const book = await this.libraryService.toggleComplete(Book.createFromDto(bookDto));
    this.onToggleComplete(book);
  }

  onToggleComplete(book: Book) {
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
