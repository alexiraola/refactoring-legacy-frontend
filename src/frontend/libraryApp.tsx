import * as React from "react";
import BookItem from "./Book";
import { Book, BookDto } from "./domain/book";
import { filterBooks } from "./domain/services/FilterBooks";

type FilterType = 'all' | 'completed' | 'incomplete';

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  }
  catch (e) {
    return false;
  }
}

export class LibraryApp extends React.Component<any, any> {
  collection: BookDto[] = [];
  bookTitle = '';
  bookCover = '';
  counter = 0;
  filter: FilterType = 'all';

  constructor(props) {
    super(props);
    fetch('http://localhost:3000/api/')
      .then(response => response.json())
      .then(data => {
        this.collection = data;
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

  add() {
    try {
      const book = Book.create(this.bookTitle, this.bookCover);

      this.collection.forEach(book => {
        if (book.title == this.bookTitle) {
          alert('Error: The title is already in the collection.');
          return;
        }
      })
      // Si pasa todas las validaciones, agregar el "libro"
      fetch('http://localhost:3000/api/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: book.id, title: book.title, pictureUrl: book.pictureUrl, completed: book.completed }),
      })
        .then(response => response.json())
        .then(data => {
          this.collection.push(data);
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

      this.collection.forEach((book, i) => {
        if (i !== index && book.title == this.bookTitle) {
          alert('Error: The title is already in the collection.');
          return;
        }
      })

      // Si pasa todas las validaciones, actualizar el libro
      fetch(`http://localhost:3000/api/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: book.title, pictureUrl: book.pictureUrl, completed: book.completed }),
      })
        .then(response => response.json())
        .then(data => {
          this.collection[index] = data;
          this.forceUpdate();
        });

    } catch (e) {
      alert(e.message);
    }
  }

  delete(index) {
    fetch(`http://localhost:3000/api/${this.collection[index].id}`, { method: 'DELETE' })
      .then(() => {
        if (this.collection[index].completed) {
          this.counter--;
        }
        this.collection.splice(index, 1);
        this.forceUpdate();
      })
  }

  toggleComplete(index) {
    this.collection[index].completed = !this.collection[index].completed;
    fetch(`http://localhost:3000/api/${this.collection[index].id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: this.collection[index].completed }),
    })
      .then(response => response.json())
      .then(data => {
        // this.collection[index] = data;
        this.collection[index].completed ? this.counter++ : this.counter--;
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
            onMarkAsReadClicked={() => this.toggleComplete(index)}
            onDeleteClicked={() => this.delete(index)}
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
