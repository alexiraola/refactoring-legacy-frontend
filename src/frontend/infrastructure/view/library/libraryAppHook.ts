import { filterBooks } from "../../../domain/services/filter.books";
import { Book } from "../../../domain/book";
import { LibraryService, RepeatedTitleError } from "../../../application/library.service";
import { useState } from "react";
import { countCompletedBooks } from "../../../domain/services/count.book";
import { ForbiddenWordsBookTitleError, InvalidBookTitleLengthError, InvalidCharactersBookTitleError } from "../../../domain/valueObjects/book.title";
import { InvalidUrlBookCoverError } from "../../../domain/valueObjects/book.cover";
import { Locale } from "../../../domain/locale";

export type FilterType = 'all' | 'completed' | 'incomplete';

type LibraryState = {
  readonly locale: Locale;
  readonly books: ReadonlyArray<Book>;
  readonly bookTitle: string;
  readonly bookCover: string;
  readonly filter: FilterType;
  readonly addErrorMessage: string;
}

const initialState = (): LibraryState => ({
  locale: Locale.en(),
  books: [],
  bookTitle: '',
  bookCover: '',
  filter: 'all',
  addErrorMessage: '',
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

      setState({ ...state, books: [...state.books, book], bookTitle: '', bookCover: '', addErrorMessage: '' });
    } catch (error) {
      setState({ ...state, addErrorMessage: getErrorMessage(error) });
    }
  }

  const getErrorMessage = (error: Error) => {
    if (error instanceof InvalidBookTitleLengthError) {
      return `Error: The title must be between ${error.minTitleLength} and ${error.maxTitleLength} characters long.`;
    } else if (error instanceof InvalidCharactersBookTitleError) {
      return "Error: The title can only contain letters, numbers, and spaces.";
    } else if (error instanceof ForbiddenWordsBookTitleError) {
      return `Error: The title cannot include the prohibited word "${error.forbiddenWord}"`;
    } else if (error instanceof InvalidUrlBookCoverError) {
      return "Error: The cover url is not valid";
    } else if (error instanceof RepeatedTitleError) {
      return "Error: The title is already in the collection.";
    } else {
      return error.message;
    }
  }

  const update = async (book: Book, bookTitle: string, bookCover: string, onSuccess: () => void, onError: (errorMessage: string) => void) => {
    try {
      const updatedBook = await service.updateBook(state.books as Book[], book, bookTitle, bookCover);
      const books = state.books.map(book => book.equals(updatedBook) ? updatedBook : book);
      onSuccess();
      setState({ ...state, books });
    } catch (error) {
      onError(getErrorMessage(error));
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

  const setLocale = (locale: Locale) => {
    setState({ ...state, locale });
  }

  const books = filterBooks(state.books as Book[], state.filter);

  return {
    locale: state.locale,
    bookTitle: state.bookTitle,
    bookCover: state.bookCover,
    counter: countCompletedBooks(state.books as Book[]),
    addErrorMessage: state.addErrorMessage,
    initialize,
    add,
    books,
    deleteBook,
    onCoverChange,
    onTitleChange,
    setFilter,
    toggleComplete,
    update,
    setLocale
  };
}


