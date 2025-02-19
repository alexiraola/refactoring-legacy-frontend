import * as React from "react";
import { useEffect } from "react";
import { LibraryService } from "../../../application/library.service";
import BookItem from "./Book";
import { useLibraryApp } from "./libraryAppHook";

type LibraryProps = { service: LibraryService };

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
        {hook.books.map(book => <BookItem book={book}
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
