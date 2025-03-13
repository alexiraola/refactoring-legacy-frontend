import * as React from "react";
import { useEffect } from "react";
import { LibraryService } from "../../../application/library.service";
import BookItem from "./Book";
import { useLibraryApp } from "./libraryAppHook";
import Language from "./Language";
import { getErrorMessage } from "../errors";
import { useTranslation } from "../locale.hook";

type LibraryProps = { service: LibraryService };

export const LibraryApp = ({ service }: LibraryProps) => {
  const hook = useLibraryApp(service);
  const { t } = useTranslation();

  useEffect(() => {
    hook.initialize();
  }, []);

  return (
    <div className="app-container">
      <Language />
      <h1>{t.appTitle}</h1>
      <div>
        <input
          data-testid="title"
          className="library-input"
          value={hook.bookTitle}
          placeholder={t.add.titlePlaceholder}
          onChange={hook.onTitleChange}
        />
        <input
          data-testid="cover"
          className="library-input"
          value={hook.bookCover}
          placeholder={t.add.coverPlaceholder}
          onChange={hook.onCoverChange}
        />
      </div>
      {hook.error && <p data-testid="add-error" style={{ color: 'red' }}>{getErrorMessage(hook.error, t)}</p>}
      <button data-testid="add" className="library-button add-book-button" onClick={() => hook.add()}>
        {t.add.addButton}
      </button>
      <h2>{t.booksRead(hook.counter)}</h2>
      <div>
        <button data-testid="showAllBooks" className="library-button all-filter" onClick={() => hook.setFilter('all')}>{t.filter.all}</button>
        <button data-testid="showReadBooks" className="library-button completed-filter" onClick={() => hook.setFilter('completed')}>{t.filter.read}</button>
        <button data-testid="showUnreadBooks" className="library-button incomplete-filter" onClick={() => hook.setFilter('incomplete')}>{t.filter.unread}</button>
      </div>
      <ul data-testid="books" className="book-list">
        {hook.books.map(book => <BookItem key={book.toDto().id} t={t} book={book.toDto()}
          onMarkAsReadClicked={() => hook.toggleComplete(book)}
          onDeleteClicked={() => hook.deleteBook(book)}
          onEdit={(title, cover, onSuccess, onError) => {
            hook.update(book, title, cover, onSuccess, onError);
          }}
        />
        )}
      </ul>
    </div>
  );
}
