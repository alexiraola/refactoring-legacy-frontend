import * as React from "react";
import { useEffect, useState } from "react";
import { LibraryService } from "../../../application/library.service";
import BookItem from "./Book";
import { Book, BookDto } from "../../../domain/book";
import { filterBooks } from "../../../domain/services/filter.books";

type FilterType = 'all' | 'completed' | 'incomplete';

type LibraryProps = { service: LibraryService };
type LibraryState = {
  collection: BookDto[];
  bookTitle: string;
  bookCover: string;
  counter: number;
  filter: FilterType;
}

const initialState = (): LibraryState => ({
  collection: [],
  bookTitle: '',
  bookCover: '',
  counter: 0,
  filter: 'all'
});

function useLibraryApp(service: LibraryService) {
  const [state, setState] = useState(initialState());

  const initialize = async () => {
    const data = await service.getBooks();

    setState({ ...state, collection: data.map(b => b.toDto()) });
  }

  const add = async () => {
    try {
      const book = await service.addBook(state.collection.map(b => Book.createFromDto(b)), state.bookTitle, state.bookCover);

      setState({ ...state, collection: [...state.collection, book.toDto()], bookTitle: '', bookCover: '' });
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  const update = async (bookDto: BookDto, bookTitle: string, bookCover: string) => {
    try {
      const book = await service.updateBook(state.collection.map(b => Book.createFromDto(b)), bookDto, bookTitle, bookCover);
      const index = state.collection.findIndex(b => b.id == book.id);
      state.collection[index] = book.toDto();
      setState({ ...state, collection: [...state.collection] });
    } catch (e) {
      alert(e.message);
    }
  }

  const deleteBook = async (bookDto: BookDto) => {
    const book = Book.createFromDto(bookDto);
    await service.deleteBook(book);
    const index = state.collection.findIndex(b => b.id == book.id);

    if (state.collection[index].completed) {
      setState({ ...state, counter: state.counter-- });
    }
    state.collection.splice(index, 1);

    setState({ ...state, collection: [...state.collection] });
  }

  const toggleComplete = async (bookDto: BookDto) => {
    const book = await service.toggleComplete(Book.createFromDto(bookDto));
    const index = state.collection.findIndex(b => b.id == book.id);
    state.collection[index] = book.toDto();
    setState({ ...state, collection: [...state.collection] });
  }

  const setFilter = (filter: FilterType) => {
    setState({ ...state, filter });
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, bookTitle: event.target.value });
  }

  const onCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, bookCover: event.target.value });
  }

  const books = filterBooks(state.collection, state.filter);
  return {
    bookTitle: state.bookTitle,
    bookCover: state.bookCover,
    counter: state.counter,
    initialize,
    add,
    books,
    deleteBook,
    onCoverChange,
    onTitleChange,
    setFilter,
    toggleComplete,
    update
  };
}


export const LibraryApp = ({ service }: LibraryProps) => {
  const hook = useLibraryApp(service);

  useEffect(() => {
    hook.initialize();
  }, []);

  return (
    <div className="app-container">
      <h1>LIBRARY APP</h1>
      <div>
        <input
          data-testid="title"
          className="library-input"
          value={hook.bookTitle}
          placeholder={'Book Title'}
          onChange={hook.onTitleChange}
        />
        <input
          data-testid="cover"
          className="library-input"
          value={hook.bookCover}
          placeholder={'Cover Url'}
          onChange={hook.onCoverChange}
        />
      </div>
      <button data-testid="add" className="library-button add-book-button" onClick={() => hook.add()}>
        Add Book
      </button>
      <h2>Books Read: {hook.counter}</h2>
      <div>
        <button data-testid="showAllBooks" className="library-button all-filter" onClick={() => hook.setFilter('all')}>All</button>
        <button data-testid="showReadBooks" className="library-button completed-filter" onClick={() => hook.setFilter('completed')}>Read</button>
        <button data-testid="showUnreadBooks" className="library-button incomplete-filter" onClick={() => hook.setFilter('incomplete')}>Unread</button>
      </div>
      <ul data-testid="books" className="book-list">
        {hook.books.map(book => <BookItem book={Book.createFromDto(book)}
          onMarkAsReadClicked={() => hook.toggleComplete(book)}
          onDeleteClicked={() => hook.deleteBook(book)}
          onEdit={(title, cover) => {
            hook.update(book, title, cover);
          }}
        />
        )}
      </ul>
    </div>
  );
}
