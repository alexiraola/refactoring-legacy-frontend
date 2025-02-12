import { BookDto } from "../book";

export type FilterType = 'all' | 'completed' | 'incomplete';

export function filterBooks(books: BookDto[], filterType: FilterType): BookDto[] {
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
