import { IonIcon } from "@ionic/react";
import * as React from "react";
import { useState } from "react";
import { trash, createOutline, checkmark } from 'ionicons/icons';
import { Book } from "./domain/book";

type Props = {
  book: Book;
  onMarkAsReadClicked: () => void;
  onDeleteClicked: () => void;
  onEdit: (title: string, cover: string) => void;
}

type BookItemState = {
  updating: boolean;
  editingTitle: string;
  editingCover: string;
}

export default function BookItem({ book, onMarkAsReadClicked, onDeleteClicked, onEdit }: Props) {
  const [state, setState] = useState<BookItemState>({
    updating: false,
    editingTitle: book.title,
    editingCover: book.pictureUrl
  });

  const edit = () => {
    setState({
      updating: true,
      editingTitle: book.title,
      editingCover: book.pictureUrl
    })
  }

  return (
    <li className="book" data-testid="book">
      {
        state.updating
          ? <div>
            <input
              data-testid="editTitle"
              className="book-edit-input"
              defaultValue={book.title} // Asumiendo que inputData se usa para la edición
              onChange={event => setState({ ...state, editingTitle: event.target.value })}
            />
            <input
              data-testid="editCover"
              className="book-edit-input"
              defaultValue={book.pictureUrl} //
              onChange={event => setState({ ...state, editingCover: event.target.value })}
            />
          </div>
          : <div className={"book-item"}>
            <img src={book.pictureUrl} alt={book.title} height={160} width={130} className="book-cover" />
            <div>

              <p className="title">
                {book.title} {book.completed && <IonIcon data-testid="completed" className={"complete-icon"} icon={checkmark}></IonIcon>}
              </p>
              {!state.updating &&
                <button data-testid="markAsRead" className="book-button"
                  onClick={() => onMarkAsReadClicked()}>
                  {book.completed ? 'Mark as Unread' : 'Mark as Read'}
                </button>}
              {!state.updating &&
                <button data-testid="edit" className="book-button"
                  onClick={() => edit()}><IonIcon icon={createOutline} />
                </button>
              }
              {!state.updating &&
                <button data-testid="delete" className="book-button book-delete-button"
                  onClick={() => onDeleteClicked()}>
                  <IonIcon icon={trash} />
                </button>}
            </div>
          </div>
      }

      {state.updating &&
        <div>
          <button data-testid="saveEdit" className="library-button book-update-button"
            onClick={() => {
              onEdit(state.editingTitle, state.editingCover);
              setState({ ...state, updating: false });
            }}>
            Save
          </button>
          <button className="library-button book-update-button"
            onClick={() => setState({ ...state, updating: false })}>
            Cancel
          </button>
        </div>

      }
    </li>

  );
}
