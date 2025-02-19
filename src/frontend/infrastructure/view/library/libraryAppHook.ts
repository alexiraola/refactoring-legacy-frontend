import { filterBooks } from "../../../domain/services/filter.books";
import { Book } from "../../../domain/book";
import { LibraryService } from "../../../application/library.service";
import { useState } from "react";
import { countCompletedBooks } from "../../../domain/services/count.book";

export type FilterType = 'all' | 'completed' | 'incomplete';

type LibraryState = {
  readonly books: ReadonlyArray<Book>;
  readonly bookTitle: string;
  readonly bookCover: string;
  readonly filter: FilterType;
}

const initialState = (): LibraryState => ({
  books: [],
  bookTitle: '',
  bookCover: '',
  filter: 'all'
});

export function useLibraryApp(service: LibraryService) {
  const [state, setState] = useState(initialState());

  const initialize = async () => {
    const books = await service.getBooks();

    setState({ ...state, books: books });
  }

  const add = async () => {
    try {
      const book = await service.addBook(state.books, state.bookTitle, state.bookCover);

      setState({ ...state, books: [...state.books, book], bookTitle: '', bookCover: '' });
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  const update = async (book: Book, bookTitle: string, bookCover: string) => {
    try {
      const updatedBook = await service.updateBook(state.books as Book[], book, bookTitle, bookCover);
      const newBooks = state.books.map(b => b.equals(updatedBook) ? updatedBook : b);
      setState({ ...state, books: newBooks });
    } catch (e) {
      alert(e.message);
    }
  }

  const deleteBook = async (book: Book) => {
    await service.deleteBook(book);

    const newBooks = state.books.filter(b => !b.equals(book));

    setState({ ...state, books: newBooks });
  }

  const toggleComplete = async (book: Book) => {
    const changedBook = await service.toggleComplete(book);
    const newBooks = state.books.map(b => b.equals(changedBook) ? changedBook : b);
    setState({ ...state, books: newBooks });
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

  const books = filterBooks(state.books as Book[], state.filter);

  return {
    bookTitle: state.bookTitle,
    bookCover: state.bookCover,
    counter: countCompletedBooks(state.books as Book[]),
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


