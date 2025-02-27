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
  }
}
