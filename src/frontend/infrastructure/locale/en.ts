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
  },
  errors: {
    invalidBookTitleLength(minTitleLength, maxTitleLength) {
      return `Error: The title must be between ${minTitleLength} and ${maxTitleLength} characters long.`;
    },
    invalidCharactersBookTitleError: "Error: The title can only contain letters, numbers, and spaces.",
    forbiddenWordsBookTitleError(forbiddenWord) {
      return `Error: The title cannot include the prohibited word "${forbiddenWord}"`;
    },
    invalidUrlBookCoverError: "Error: The cover url is not valid",
    repeatedTitleError: "Error: The title is already in the collection."
  }
}
