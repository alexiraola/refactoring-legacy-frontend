import { IonIcon } from "@ionic/react";
import * as React from "react";
import { useState } from "react";
import { trash, createOutline, checkmark } from 'ionicons/icons';
import { Book } from "./libraryApp";

type Props = {
  book: Book;
  onMarkAsReadClicked: () => void;
  onDeleteClicked: () => void;
  onEdit: (title: string, cover: string) => void;
}

export default function BookItem({ book, onMarkAsReadClicked, onDeleteClicked, onEdit }: Props) {
  const [updating, setUpdating] = useState(false);
  const [editingTitle, setEditingTitle] = useState(book.title);
  const [editingCover, setEditingCover] = useState(book.pictureUrl);

  const edit = () => {
    setUpdating(true);
    setEditingTitle(book.title);
    setEditingCover(book.pictureUrl);
  }

  return (
    <li className="book" data-testid="book">
      {
        updating
          ? <div>
            <input
              data-testid="editTitle"
              className="book-edit-input"
              defaultValue={book.title} // Asumiendo que inputData se usa para la edición
              onChange={event => setEditingTitle(event.target.value)}
            />
            <input
              data-testid="editCover"
              className="book-edit-input"
              defaultValue={book.pictureUrl} //
              onChange={event => setEditingCover(event.target.value)}
            />
          </div>
          : <div className={"book-item"}>
            <img src={book.pictureUrl} alt={book.title} height={160} width={130} className="book-cover" />
            <div>

              <p className="title">
                {book.title} {book.completed && <IonIcon data-testid="completed" className={"complete-icon"} icon={checkmark}></IonIcon>}
              </p>
              {!updating &&
                <button data-testid="markAsRead" className="book-button"
                  onClick={() => onMarkAsReadClicked()}>
                  {book.completed ? 'Mark as Unread' : 'Mark as Read'}
                </button>}
              {!updating &&
                <button data-testid="edit" className="book-button"
                  onClick={() => edit()}><IonIcon icon={createOutline} />
                </button>
              }
              {!updating &&
                <button data-testid="delete" className="book-button book-delete-button"
                  onClick={() => onDeleteClicked()}>
                  <IonIcon icon={trash} />
                </button>}
            </div>
          </div>
      }

      {updating &&
        <div>
          <button data-testid="saveEdit" className="library-button book-update-button"
            onClick={() => {
              onEdit(editingTitle, editingCover);
              setUpdating(false);
            }}>
            Save
          </button>
          <button className="library-button book-update-button"
            onClick={() => setUpdating(false)}>
            Cancel
          </button>
        </div>

      }
    </li>

  );
}
