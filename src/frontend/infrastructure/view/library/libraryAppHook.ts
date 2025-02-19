import { filterBooks } from "../../../domain/services/filter.books";
import { Book, BookDto } from "../../../domain/book";
import { LibraryService } from "../../../application/library.service";
import { useState } from "react";

export type FilterType = 'all' | 'completed' | 'incomplete';

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


