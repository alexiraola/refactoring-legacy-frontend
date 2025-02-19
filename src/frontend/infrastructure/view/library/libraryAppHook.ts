import { filterBooks } from "../../../domain/services/filter.books";
import { Book, BookDto } from "../../../domain/book";
import { LibraryService } from "../../../application/library.service";
import { useState } from "react";
import { countCompletedBooks } from "../../../domain/services/count.book";

export type FilterType = 'all' | 'completed' | 'incomplete';

type LibraryState = {
  readonly collection: ReadonlyArray<BookDto>;
  readonly bookTitle: string;
  readonly bookCover: string;
  readonly filter: FilterType;
}

const initialState = (): LibraryState => ({
  collection: [],
  bookTitle: '',
  bookCover: '',
  filter: 'all'
});

export function useLibraryApp(service: LibraryService) {
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
      const newBooks = state.collection.map(b => b.id == book.id ? book.toDto() : b);
      setState({ ...state, collection: newBooks });
    } catch (e) {
      alert(e.message);
    }
  }

  const deleteBook = async (bookDto: BookDto) => {
    const book = Book.createFromDto(bookDto);
    await service.deleteBook(book);

    const newBooks = state.collection.filter(b => b.id !== book.id);

    setState({ ...state, collection: newBooks });
  }

  const toggleComplete = async (bookDto: BookDto) => {
    const book = await service.toggleComplete(Book.createFromDto(bookDto));
    const newBooks = state.collection.map(b => b.id == book.id ? book.toDto() : b);
    setState({ ...state, collection: newBooks });
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
    counter: countCompletedBooks(state.collection as BookDto[]),
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


