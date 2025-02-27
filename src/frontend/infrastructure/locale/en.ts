import { Translations } from "./translation";

export const en: Translations = {
  appTitle: 'LIBRARY APP',
  add: {
    titlePlaceholder: 'Book Title',
    coverPlaceholder: 'Cover Url',
    addButton: 'Add'
  },
  booksRead: (count: number) => `Books Read: ${count}`,
  filter: {
    all: 'All',
    read: 'Read',
    unread: 'Unread'
  },
  book: {
    markAsRead: 'Mark as read',
    markAsUnread: 'Mark as unread',
    save: 'Save',
    cancel: 'Cancel'
  }
}
