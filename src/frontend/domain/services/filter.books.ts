import { Book } from "../book";

export type FilterType = 'all' | 'completed' | 'incomplete';

export function filterBooks(books: Book[], filterType: FilterType): Book[] {
  return books.filter(book => {
    switch (filterType) {
      case 'all':
        return true;
      case 'completed':
        return book.completed;
      case 'incomplete':
        return !book.completed;
    }
  });
}
