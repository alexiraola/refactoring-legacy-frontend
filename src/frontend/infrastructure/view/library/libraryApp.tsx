import * as React from "react";
import { useEffect } from "react";
import { LibraryService } from "../../../application/library.service";
import { TranslationFactory } from "../../locale/translation";
import BookItem from "./Book";
import { useLibraryApp } from "./libraryAppHook";
import Language from "./Language";

type LibraryProps = { service: LibraryService };

export const LibraryApp = ({ service }: LibraryProps) => {
  const hook = useLibraryApp(service);

  const t = TranslationFactory.getTranslationsFor(hook.locale);

  useEffect(() => {
    hook.initialize();
  }, []);

  return (
    <div className="app-container">
      <Language locale={hook.locale} onChange={(locale) => hook.setLocale(locale)} />
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
      {hook.addErrorMessage && <p data-testid="add-error" style={{ color: 'red' }}>{hook.addErrorMessage}</p>}
      <button data-testid="add" className="library-button add-book-button" onClick={() => hook.add()}>
        {t.add.addButton}
      </button>
      <h2>Books Read: {hook.counter}</h2>
      <div>
        <button data-testid="showAllBooks" className="library-button all-filter" onClick={() => hook.setFilter('all')}>All</button>
        <button data-testid="showReadBooks" className="library-button completed-filter" onClick={() => hook.setFilter('completed')}>Read</button>
        <button data-testid="showUnreadBooks" className="library-button incomplete-filter" onClick={() => hook.setFilter('incomplete')}>Unread</button>
      </div>
      <ul data-testid="books" className="book-list">
        {hook.books.map(book => <BookItem book={book}
          errorMessage={hook.updateErrorMessages[book.toDto().id] || ''}
          onMarkAsReadClicked={() => hook.toggleComplete(book)}
          onDeleteClicked={() => hook.deleteBook(book)}
          onEdit={(title, cover) => {
            hook.update(book, title, cover);
          }}
          clearError={() => hook.clearError(book)}
        />
        )}
      </ul>
    </div>
  );
}
