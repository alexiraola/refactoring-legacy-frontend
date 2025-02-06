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

export class LibraryApp extends React.Component<any, any> {
  collection: Book[] = [];
  inputData = '';
  inputUpdateData = '';
  coverData = '';
  coverUpdateData = '';
  counter = 0;
  f = 'all';
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

  handleInputChange(event) {
    var value = event.target.value;
    this.inputData = value;
    this.forceUpdate();
  }

  onCoverChange(event) {
    var value = event.target.value;
    this.coverData = value;
    this.forceUpdate();
  }

  add() {
    const min = 3; // Longitud mínima del texto
    const max = 100; // Longitud máxima del texto
    const forbidden = ['prohibited', 'forbidden', 'banned'];
    let temp = false;
    try {
      new URL(this.coverData);
      temp = true;
    }
    catch (e) {
      temp = false;
    }
    if (!temp) {
      alert('Error: The cover url is not valid');
    }
    // Validación de longitud mínima y máxima
    else if (this.inputData.length < min || this.inputData.length > max) {
      alert(`Error: The title must be between ${min} and ${max} characters long.`);
    } else if (/[^a-zA-Z0-9\s]/.test(this.inputData)) {
      // Validación de caracteres especiales
      alert('Error: The title can only contain letters, numbers, and spaces.');
    } else {
      // Validación de palabras prohibidas
      const words = this.inputData.split(/\s+/);
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
          if (this.collection[i].title === this.inputData) {
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
            body: JSON.stringify({ id: uuid(), title: this.inputData, pictureUrl: this.coverData, completed: false }),
          })
            .then(response => response.json())
            .then(data => {
              this.collection.push(data);
              this.inputData = '';
              this.coverData = '';
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
      new URL(this.coverUpdateData);
      temp = true;
    }
    catch (e) {
      temp = false;
    }
    if (!temp) {
      alert('Error: The cover url is not valid');
    }
    // Validación de longitud mínima y máxima
    else if (this.inputUpdateData.length < min || this.inputUpdateData.length > max) {
      alert(`Error: The title must be between ${min} and ${max} characters long.`);
    } else if (/[^a-zA-Z0-9\s]/.test(this.inputUpdateData)) {
      // Validación de caracteres especiales
      alert('Error: The title can only contain letters, numbers, and spaces.');
    } else {
      // Validación de palabras prohibidas
      let temp1 = false;
      for (let word of this.inputUpdateData.split(/\s+/)) {
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
          if (i !== index && this.collection[i].title === this.inputUpdateData) {
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
            body: JSON.stringify({ title: this.inputUpdateData, pictureUrl: this.coverUpdateData, completed: this.collection[index].completed }),
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
    this.f = filter;
    this.forceUpdate();
  }

  getBooks() {
    var fBooks = [];
    for (var i = 0; i < this.collection.length; i++) {
      if (
        this.f === 'all' ||
        (this.f === 'completed' && this.collection[i].completed) ||
        (this.f === 'incomplete' && !this.collection[i].completed)
      ) {
        fBooks.push(this.collection[i]);
      }
    }
    return fBooks;
  }

  edit(index, text, url) {
    this.inputUpdateData = text;
    this.coverUpdateData = url;
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
            value={this.inputData}
            placeholder={'Book Title'}
            onChange={this.handleInputChange.bind(this)}
          />
          <input
            data-testid="cover"
            className="library-input"
            value={this.coverData}
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
              this.inputUpdateData = title;
              this.coverUpdateData = cover;
              this.update(index);
            }}
          />
          )}
        </ul>
      </div>
    );
  }
}
