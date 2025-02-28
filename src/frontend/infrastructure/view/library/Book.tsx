import { IonIcon } from "@ionic/react";
import * as React from "react";
import { useState } from "react";
import { trash, createOutline, checkmark } from 'ionicons/icons';
import { Book } from "../../../domain/book";
import { Translations } from "../../locale/translation";

type Props = {
  t: Translations;
  book: Book;
  onMarkAsReadClicked: () => void;
  onDeleteClicked: () => void;
  onEdit: (title: string, cover: string, onSuccess: () => void, onError: (errorMessage: string) => void) => void;
}

type BookItemState = {
  updating: boolean;
  status: BookItemStatus;
  errorMessage: string;
  editingTitle: string;
  editingCover: string;
}

enum BookItemStatus {
  Viewing,
  Editing,
}

export default function BookItem({ t, book: b, onMarkAsReadClicked, onDeleteClicked, onEdit }: Props) {
  const book = b.toDto();

  const [state, setState] = useState<BookItemState>({
    updating: false,
    status: BookItemStatus.Viewing,
    errorMessage: '',
    editingTitle: book.title,
    editingCover: book.pictureUrl
  });

  const edit = () => {
    setState({
      updating: true,
      status: BookItemStatus.Editing,
      errorMessage: '',
      editingTitle: book.title,
      editingCover: book.pictureUrl
    })
  }

  const renderEditingBook = () => {
    return (
      <>
        <div>
          <input
            data-testid="editTitle"
            className="book-edit-input"
            defaultValue={book.title}
            onChange={event => setState({ ...state, editingTitle: event.target.value })}
          />
          <input
            data-testid="editCover"
            className="book-edit-input"
            defaultValue={book.pictureUrl}
            onChange={event => setState({ ...state, editingCover: event.target.value })}
          />
          {state.errorMessage && <p data-testid="update-error" style={{ color: 'red' }}>{state.errorMessage}</p>}
        </div>
        <div>
          <button data-testid="saveEdit" className="library-button book-update-button"
            onClick={() => {
              onEdit(state.editingTitle, state.editingCover, () => {
                setState({ ...state, updating: false, status: BookItemStatus.Viewing, errorMessage: '' });
              }, (errorMessage) => {
                setState({ ...state, status: BookItemStatus.Editing, errorMessage });
              });
            }}>
            {t.book.save}
          </button>
          <button data-testid="cancel" className="library-button book-update-button"
            onClick={() => {
              setState({ ...state, updating: false, status: BookItemStatus.Viewing, errorMessage: '' });
            }}>
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
            onClick={() => edit()}><IonIcon icon={createOutline} />
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
        state.status === BookItemStatus.Editing
          ? renderEditingBook()
          : renderViewBook()}
    </li>
  );
}
