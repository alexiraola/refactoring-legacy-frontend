import { useState } from "react";
import { BookDto } from "../../../domain/book";

export enum BookItemStatus {
  Viewing,
  Editing,
}

type BookState = {
  status: BookItemStatus;
  error: Error | null,
  editingTitle: string;
  editingCover: string;
}

const initialState = (): BookState => ({
  status: BookItemStatus.Viewing,
  error: null,
  editingTitle: '',
  editingCover: ''
})

export function useBook(book: BookDto, edit: (title: string, cover: string, onSuccess: () => void, onError: (error: Error) => void) => void) {
  const [state, setState] = useState(initialState);

  const onEdit = () => {
    setState({
      status: BookItemStatus.Editing,
      error: null,
      editingTitle: book.title,
      editingCover: book.pictureUrl
    });
  }

  const onSave = () => {
    edit(state.editingTitle, state.editingCover, () => {
      setState({ ...state, status: BookItemStatus.Viewing, error: null });
    }, (error) => {
      setState({ ...state, status: BookItemStatus.Editing, error });
    });
  }

  const onCancel = () => {
    setState({ ...state, status: BookItemStatus.Viewing, error: null });
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, editingTitle: event.target.value });
  }

  const onCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, editingCover: event.target.value });
  }

  return {
    status: state.status,
    error: state.error,
    onEdit,
    onSave,
    onCancel,
    onTitleChange,
    onCoverChange,
  }
}
