import { filterBooks } from "../../../domain/services/filter.books";
import { Book } from "../../../domain/book";
import { LibraryService } from "../../../application/library.service";
import { useState } from "react";
import { countCompletedBooks } from "../../../domain/services/count.book";
import { BookCoverError, BookError, BookTitleError, LibraryError, LibraryErrorType } from "../../../domain/common/library.error";

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

    setState({ ...state, books });
  }

  const add = async () => {
    try {
      const book = await service.addBook(state.books as Book[], state.bookTitle, state.bookCover);

      setState({ ...state, books: [...state.books, book], bookTitle: '', bookCover: '' });
    } catch (error) {
      if (error instanceof LibraryError) {
        alert(getErrorMessage(error.type));
      } else {
        alert(error.message);
      }
    }
  }

  const getErrorMessage = (errorType: LibraryErrorType) => {
    switch (errorType) {
      case BookError.REPEATED_TITLE:
        return "Error: The title is already in the collection.";
      case BookTitleError.INVALID_LENGTH:
        return "Error: The title must be between 3 and 100 characters long.";
      case BookTitleError.INVALID_CHARACTERS:
        return "Error: The title can only contain letters, numbers, and spaces.";
      case BookTitleError.FORBIDDEN_WORDS:
        return "Error: The title cannot include a prohibited word";
      case BookCoverError.INVALID_URL:
        return "Error: The cover url is not valid";
    }
  }

  const update = async (book: Book, bookTitle: string, bookCover: string) => {
    try {
      const updatedBook = await service.updateBook(state.books as Book[], book, bookTitle, bookCover);
      const books = state.books.map(book => book.equals(updatedBook) ? updatedBook : book);
      setState({ ...state, books });
    } catch (e) {
      alert(e.message);
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


