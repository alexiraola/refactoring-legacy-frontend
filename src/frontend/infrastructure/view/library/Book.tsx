import { IonIcon } from "@ionic/react";
import * as React from "react";
import { useState, useMemo } from "react";
import { trash, createOutline, checkmark } from 'ionicons/icons';
import { Book } from "../../../domain/book";

type Props = {
  book: Book;
  errorMessage: string;
  onMarkAsReadClicked: () => void;
  onDeleteClicked: () => void;
  onEdit: (title: string, cover: string) => void;
  clearError: () => void;
}

type BookItemState = {
  updating: boolean;
  editingTitle: string;
  editingCover: string;
}

export default function BookItem({ book: b, errorMessage, onMarkAsReadClicked, onDeleteClicked, onEdit, clearError }: Props) {
  const book = b.toDto();

  const [state, setState] = useState<BookItemState>({
    updating: false,
    editingTitle: book.title,
    editingCover: book.pictureUrl
  });

  const showEdit = useMemo(() => {
    return state.updating || errorMessage !== '';
  }, [state.updating, errorMessage]);

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
        showEdit
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
            {errorMessage && <p data-testid="update-error" style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
          : <div className={"book-item"}>
            <img src={book.pictureUrl} alt={book.title} height={160} width={130} className="book-cover" />
            <div>

              <p className="title">
                {book.title} {book.completed && <IonIcon data-testid="completed" className={"complete-icon"} icon={checkmark}></IonIcon>}
              </p>
              {!showEdit &&
                <button data-testid="markAsRead" className="book-button"
                  onClick={() => onMarkAsReadClicked()}>
                  {book.completed ? 'Mark as Unread' : 'Mark as Read'}
                </button>}
              {!showEdit &&
                <button data-testid="edit" className="book-button"
                  onClick={() => edit()}><IonIcon icon={createOutline} />
                </button>
              }
              {!showEdit &&
                <button data-testid="delete" className="book-button book-delete-button"
                  onClick={() => onDeleteClicked()}>
                  <IonIcon icon={trash} />
                </button>}
            </div>
          </div>
      }

      {showEdit &&
        <div>
          <button data-testid="saveEdit" className="library-button book-update-button"
            onClick={() => {
              onEdit(state.editingTitle, state.editingCover);
              setState({ ...state, updating: false });
            }}>
            Save
          </button>
          <button data-testid="cancel" className="library-button book-update-button"
            onClick={() => {
              setState({ ...state, updating: false });
              clearError()
            }}>
            Cancel
          </button>
        </div>

      }
    </li>

  );
}
