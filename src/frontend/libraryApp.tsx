import * as React from "react";
import BookItem from "./Book";
import { Book, BookDto } from "./domain/book";
import { filterBooks } from "./domain/services/FilterBooks";
import { ApiBookRepository } from "./infrastructure/api.book.repository";

type FilterType = 'all' | 'completed' | 'incomplete';

export class LibraryApp extends React.Component<any, any> {
  collection: BookDto[] = [];
  bookTitle = '';
  bookCover = '';
  counter = 0;
  filter: FilterType = 'all';
  bookRepository = new ApiBookRepository('http://localhost:3000/api');

  constructor(props) {
    super(props);
    this.bookRepository.getAll().then(data => {
      this.collection = data.map(b => b.toDto());
      this.forceUpdate();
    })
      .catch(error => console.log(error));
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

  ensureThatBookIsNotRepeated(book: Book, books: BookDto[]) {
    books.forEach(b => {
      if (b.title == book.title) {
        throw new Error('Error: The title is already in the collection.');
      }
    });
  }

  add() {
    try {
      const book = Book.create(this.bookTitle, this.bookCover);

      this.ensureThatBookIsNotRepeated(book, this.collection);

      this.bookRepository.add(book)
        .then(() => {
          this.collection.push(book.toDto());
          this.bookTitle = '';
          this.bookCover = '';
          this.forceUpdate();
        });

    } catch (error) {
      alert(error.message);
      return;
    }
  }

  update(bookDto: BookDto, bookTitle: string, bookCover: string) {
    const index = this.collection.findIndex(b => b.id == bookDto.id);
    const book = Book.createFromDto(bookDto);

    try {
      book.updateTitle(bookTitle);
      book.updateCover(bookCover);

      this.ensureThatBookIsNotRepeated(book, this.collection);

      this.bookRepository.update(book)
        .then(() => {
          this.collection[index] = book.toDto();
          this.forceUpdate();
        });

    } catch (e) {
      alert(e.message);
    }
  }

  delete(bookDto: BookDto) {
    const index = this.collection.findIndex(b => b.id == bookDto.id);

    this.bookRepository.remove(Book.createFromDto(bookDto))
      .then(() => {
        if (this.collection[index].completed) {
          this.counter--;
        }
        this.collection.splice(index, 1);
        this.forceUpdate();
      })
  }

  toggleComplete(bookDto: BookDto) {
    const index = this.collection.findIndex(b => b.id == bookDto.id);

    const book = Book.createFromDto(bookDto);
    book.toggleCompleted();
    // this.collection[index].completed = !this.collection[index].completed;
    this.bookRepository.update(book)
      .then(() => {
        // this.collection[index] = data;
        this.collection[index] = book.toDto();
        this.forceUpdate();
      })
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
