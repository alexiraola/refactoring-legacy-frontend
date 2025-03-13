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
  readonly error: Error | null;
}

const initialState = (): LibraryState => ({
  books: [],
  bookTitle: '',
  bookCover: '',
  filter: 'all',
  error: null,
});

export function useLibraryApp(service: LibraryService) {
  const [state, setState] = useState(initialState());

  const initialize = async () => {
    const books = await service.getBooks();

    setState({ ...state, books });
  }

  const add = async () => {
    try {
      const book = await service.addBook(state.books as Book[], state.bookTitle, state.bookCover);

      setState({ ...state, books: [...state.books, book], bookTitle: '', bookCover: '' });
    } catch (error) {
      setState({ ...state, error });
    }
  }

  const update = async (book: Book, bookTitle: string, bookCover: string, onSuccess: () => void, onError: (error: Error) => void) => {
    try {
      const updatedBook = await service.updateBook(state.books as Book[], book, bookTitle, bookCover);
      const books = state.books.map(book => book.equals(updatedBook) ? updatedBook : book);
      onSuccess();
      setState({ ...state, books });
    } catch (error) {
      onError(error);
    }
  }

  const deleteBook = async (book: Book) => {
    await service.deleteBook(book);

    const books = state.books.filter(b => !b.equals(book));

    setState({ ...state, books });
  }

  const toggleComplete = async (book: Book) => {
    const changedBook = await service.toggleComplete(book);
    const books = state.books.map(book => book.equals(changedBook) ? changedBook : book);
    setState({ ...state, books });
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
    error: state.error,
    initialize,
    add,
    books,
    deleteBook,
    onCoverChange,
    onTitleChange,
    setFilter,
    toggleComplete,
    update,
  };
}


