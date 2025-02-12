import { BookDto } from "../book";

type FilterType = 'all' | 'completed' | 'incomplete';

export function filterBooks(books: BookDto[], filterType: FilterType): BookDto[] {
  var fBooks = [];
  for (var i = 0; i < books.length; i++) {
    if (
      filterType === 'all' ||
      (filterType === 'completed' && books[i].completed) ||
      (filterType === 'incomplete' && !books[i].completed)
    ) {
      fBooks.push(books[i]);
    }
  }
  return fBooks;
}


