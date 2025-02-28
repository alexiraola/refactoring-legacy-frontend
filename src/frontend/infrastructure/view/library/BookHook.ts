import { useState } from "react";
import { BookDto } from "../../../domain/book";

export enum BookItemStatus {
  Viewing,
  Editing,
}

type BookState = {
  status: BookItemStatus;
  errorMessage: string;
  editingTitle: string;
  editingCover: string;
}

const initialState = (): BookState => ({
  status: BookItemStatus.Viewing,
  errorMessage: '',
  editingTitle: '',
  editingCover: ''
})

export function useBook(book: BookDto, edit: (title: string, cover: string, onSuccess: () => void, onError: (errorMessage: string) => void) => void) {
  const [state, setState] = useState(initialState);

  const onEdit = () => {
    setState({
      status: BookItemStatus.Editing,
      errorMessage: '',
      editingTitle: book.title,
      editingCover: book.pictureUrl
    });
  }

  const onSave = () => {
    edit(state.editingTitle, state.editingCover, () => {
      setState({ ...state, status: BookItemStatus.Viewing, errorMessage: '' });
    }, (errorMessage) => {
      setState({ ...state, status: BookItemStatus.Editing, errorMessage });
    });
  }

  const onCancel = () => {
    setState({ ...state, status: BookItemStatus.Viewing, errorMessage: '' });
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, editingTitle: event.target.value });
  }

  const onCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, editingCover: event.target.value });
  }

  return {
    status: state.status,
    errorMessage: state.errorMessage,
    onEdit,
    onSave,
    onCancel,
    onTitleChange,
    onCoverChange,
  }
}
