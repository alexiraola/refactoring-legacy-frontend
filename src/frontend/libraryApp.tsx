import * as React from "react";
import { v4 as uuid } from 'uuid';
import BookItem from "./Book";

export class Book {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly pictureUrl: string,
    public completed: boolean
  ) { }
}

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
  collection: Book[] = [];
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
    const minTitleLength = 3; // Longitud mínima del texto
    const maxTitleLength = 100; // Longitud máxima del texto
    const forbiddenWords = ['prohibited', 'forbidden', 'banned'];

    if (!isValidUrl(this.bookCover)) {
      alert('Error: The cover url is not valid');
      return;
    }
    const hasValidLength = this.bookTitle.length < minTitleLength || this.bookTitle.length > maxTitleLength;
    if (hasValidLength) {
      alert(`Error: The title must be between ${minTitleLength} and ${maxTitleLength} characters long.`);
      return;
    }
    const isValidTitle = /[^a-zA-Z0-9\s]/.test(this.bookTitle);
    if (isValidTitle) {
      alert('Error: The title can only contain letters, numbers, and spaces.');
      return;
    }
    // Validación de palabras prohibidas
    const words = this.bookTitle.split(/\s+/);
    let foundForbiddenWord = words.find(word => forbiddenWords.includes(word));
    if (foundForbiddenWord) {
      alert(`Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
      return;
    }

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
      body: JSON.stringify({ id: uuid(), title: this.bookTitle, pictureUrl: this.bookCover, completed: false }),
    })
      .then(response => response.json())
      .then(data => {
        this.collection.push(data);
        this.bookTitle = '';
        this.bookCover = '';
        this.forceUpdate();
      });
  }

  update(index, bookTitle: string, bookCover: string) {
    const minLength = 3; // Longitud mínima del texto
    const maxLength = 100; // Longitud máxima del texto
    const forbiddenWords = ['prohibited', 'forbidden', 'banned'];

    if (!isValidUrl(bookCover)) {
      alert('Error: The cover url is not valid');
      return
    }
    const hasValidLength = bookTitle.length < minLength || bookTitle.length > maxLength;
    if (hasValidLength) {
      alert(`Error: The title must be between ${minLength} and ${maxLength} characters long.`);
      return;
    }
    const isValidTitle = /[^a-zA-Z0-9\s]/.test(bookTitle);
    if (isValidTitle) {
      alert('Error: The title can only contain letters, numbers, and spaces.');
      return;
    }
    const words = bookTitle.split(/\s+/);
    const foundForbiddenWord = forbiddenWords.find(word => words.includes(word));
    if (foundForbiddenWord) {
      alert(`Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
      return
    }

    this.collection.forEach((book, i) => {
      if (i !== index && book.title == this.bookTitle) {
        alert('Error: The title is already in the collection.');
        return;
      }
    })

    // Si pasa todas las validaciones, actualizar el libro
    fetch(`http://localhost:3000/api/${this.collection[index].id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: bookTitle, pictureUrl: bookCover, completed: this.collection[index].completed }),
    })
      .then(response => response.json())
      .then(data => {
        this.collection[index] = data;
        this.forceUpdate();
      });
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

  getBooks() {
    var fBooks = [];
    for (var i = 0; i < this.collection.length; i++) {
      if (
        this.filter === 'all' ||
        (this.filter === 'completed' && this.collection[i].completed) ||
        (this.filter === 'incomplete' && !this.collection[i].completed)
      ) {
        fBooks.push(this.collection[i]);
      }
    }
    return fBooks;
  }

  render() {
    const books = this.getBooks();

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
          {books.map((b, index) => <BookItem book={b}
            onMarkAsReadClicked={() => this.toggleComplete(index)}
            onDeleteClicked={() => this.delete(index)}
            onEdit={(title, cover) => {
              this.update(index, title, cover);
            }}
          />
          )}
        </ul>
      </div>
    );
  }
}
