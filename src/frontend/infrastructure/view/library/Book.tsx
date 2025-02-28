import { IonIcon } from "@ionic/react";
import * as React from "react";
import { trash, createOutline, checkmark } from 'ionicons/icons';
import { BookDto } from "../../../domain/book";
import { Translations } from "../../locale/translation";
import { BookItemStatus, useBook } from "./BookHook";
import { getErrorMessage } from "../errors";

type Props = {
  t: Translations;
  book: BookDto;
  onMarkAsReadClicked: () => void;
  onDeleteClicked: () => void;
  onEdit: (title: string, cover: string, onSuccess: () => void, onError: (error: Error) => void) => void;
}

export default function BookItem({ t, book, onMarkAsReadClicked, onDeleteClicked, onEdit }: Props) {
  const hook = useBook(book, onEdit);

  const renderEditingBook = () => {
    return (
      <>
        <div>
          <input
            data-testid="editTitle"
            className="book-edit-input"
            defaultValue={book.title}
            onChange={hook.onTitleChange}
          />
          <input
            data-testid="editCover"
            className="book-edit-input"
            defaultValue={book.pictureUrl}
            onChange={hook.onCoverChange}
          />
          {hook.error && <p data-testid="update-error" style={{ color: 'red' }}>{getErrorMessage(hook.error, t)}</p>}
        </div>
        <div>
          <button data-testid="saveEdit" className="library-button book-update-button"
            onClick={hook.onSave}>
            {t.book.save}
          </button>
          <button data-testid="cancel" className="library-button book-update-button"
            onClick={hook.onCancel}>
            {t.book.cancel}
          </button>
        </div>
      </>
    )
  }

  const renderViewBook = () => {
    return (
      <div className={"book-item"}>
        <img src={book.pictureUrl} alt={book.title} height={160} width={130} className="book-cover" />
        <div>
          <p className="title">
            {book.title} {book.completed && <IonIcon data-testid="completed" className={"complete-icon"} icon={checkmark}></IonIcon>}
          </p>
          <button data-testid="markAsRead" className="book-button"
            onClick={() => onMarkAsReadClicked()}>
            {book.completed ? t.book.markAsUnread : t.book.markAsRead}
          </button>
          <button data-testid="edit" className="book-button"
            onClick={hook.onEdit}><IonIcon icon={createOutline} />
          </button>
          <button data-testid="delete" className="book-button book-delete-button"
            onClick={() => onDeleteClicked()}>
            <IonIcon icon={trash} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <li className="book" data-testid="book">
      {
        hook.status === BookItemStatus.Editing
          ? renderEditingBook()
          : renderViewBook()}
    </li>
  );
}
