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

export class LibraryApp extends React.Component<any, any> {
  collection: Book[] = [];
  bookTitle = '';
  editBookTitle = '';
  bookCover = '';
  editBookCover = '';
  counter = 0;
  filter: FilterType = 'all';
  updating = [];

  constructor(props) {
    super(props);
    fetch('http://localhost:3000/api/')
      .then(response => response.json())
      .then(data => {
        this.collection = data;
        for (let i = 0; i < this.collection.length; i++) {
          this.updating.push(false);
        }
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
    const min = 3; // Longitud mínima del texto
    const max = 100; // Longitud máxima del texto
    const forbidden = ['prohibited', 'forbidden', 'banned'];
    let temp = false;
    try {
      new URL(this.bookCover);
      temp = true;
    }
    catch (e) {
      temp = false;
    }
    if (!temp) {
      alert('Error: The cover url is not valid');
    }
    // Validación de longitud mínima y máxima
    else if (this.bookTitle.length < min || this.bookTitle.length > max) {
      alert(`Error: The title must be between ${min} and ${max} characters long.`);
    } else if (/[^a-zA-Z0-9\s]/.test(this.bookTitle)) {
      // Validación de caracteres especiales
      alert('Error: The title can only contain letters, numbers, and spaces.');
    } else {
      // Validación de palabras prohibidas
      const words = this.bookTitle.split(/\s+/);
      let foundForbiddenWord = false;
      for (let word of words) {
        if (forbidden.includes(word)) {
          alert(`Error: The title cannot include the prohibited word "${word}"`);
          foundForbiddenWord = true;
          break;
        }
      }

      if (!foundForbiddenWord) {
        // Validación de texto repetido
        let isRepeated = false;
        for (let i = 0; i < this.collection.length; i++) {
          if (this.collection[i].title === this.bookTitle) {
            isRepeated = true;
            break;
          }
        }

        if (isRepeated) {
          alert('Error: The title is already in the collection.');
        } else {
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
      }
    }
  }

  update(index) {
    const min = 3; // Longitud mínima del texto
    const max = 100; // Longitud máxima del texto
    const words = ['prohibited', 'forbidden', 'banned'];
    let temp = false;
    try {
      new URL(this.editBookCover);
      temp = true;
    }
    catch (e) {
      temp = false;
    }
    if (!temp) {
      alert('Error: The cover url is not valid');
    }
    // Validación de longitud mínima y máxima
    else if (this.editBookTitle.length < min || this.editBookTitle.length > max) {
      alert(`Error: The title must be between ${min} and ${max} characters long.`);
    } else if (/[^a-zA-Z0-9\s]/.test(this.editBookTitle)) {
      // Validación de caracteres especiales
      alert('Error: The title can only contain letters, numbers, and spaces.');
    } else {
      // Validación de palabras prohibidas
      let temp1 = false;
      for (let word of this.editBookTitle.split(/\s+/)) {
        if (words.includes(word)) {
          alert(`Error: The title cannot include the prohibited word "${word}"`);
          temp1 = true;
          break;
        }
      }

      if (!temp1) {
        // Validación de texto repetido (excluyendo el índice actual)
        let temp2 = false;
        for (let i = 0; i < this.collection.length; i++) {
          if (i !== index && this.collection[i].title === this.editBookTitle) {
            temp2 = true;
            break;
          }
        }

        if (temp2) {
          alert('Error: The title is already in the collection.');
        } else {
          // Si pasa todas las validaciones, actualizar el libro
          fetch(`http://localhost:3000/api/${this.collection[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: this.editBookTitle, pictureUrl: this.editBookCover, completed: this.collection[index].completed }),
          })
            .then(response => response.json())
            .then(data => {
              this.collection[index] = data;
              this.forceUpdate();
            });
        }
      }
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

  edit(index, text, url) {
    this.editBookTitle = text;
    this.editBookCover = url;
    this.updating[index] = true;
    this.forceUpdate();
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
              this.editBookTitle = title;
              this.editBookCover = cover;
              this.update(index);
            }}
          />
          )}
        </ul>
      </div>
    );
  }
}
