import { Translations } from "./translation";

export const es: Translations = {
  appTitle: 'APP LIBRERÍA',
  add: {
    titlePlaceholder: 'Título del libro',
    coverPlaceholder: 'Url de la portada',
    addButton: 'Añadir'
  },
  booksRead: (count: number) => `Libros leídos: ${count}`,
  filter: {
    all: 'Todos',
    read: 'Leídos',
    unread: 'No leídos'
  },
  book: {
    markAsRead: 'Marcar como leído',
    markAsUnread: 'Marcar como no leído',
    save: 'Guardar',
    cancel: 'Cancelar'
  },
  errors: {
    invalidBookTitleLength(minTitleLength, maxTitleLength) {
      return `Error: La longitud del título debe estar entre ${minTitleLength} y ${maxTitleLength}.`;
    },
    invalidCharactersBookTitleError: "Error: El título sólo debe contener letras, números y espacios.",
    forbiddenWordsBookTitleError(forbiddenWord) {
      return `Error: El título no puede contener la palabra prohibida "${forbiddenWord}"`;
    },
    invalidUrlBookCoverError: "Error: La url de la portada no es válida",
    repeatedTitleError: "Error: El título ya existe en la colección."
  }
}
