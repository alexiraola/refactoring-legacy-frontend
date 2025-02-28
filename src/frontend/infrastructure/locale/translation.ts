import { Locale } from "../../domain/locale";
import { en } from "./en";
import { es } from "./es";

export class TranslationFactory {
  static getTranslationsFor(locale: Locale) {
    if (locale.equals(Locale.es())) {
      return es;
    }
    if (locale.equals(Locale.en())) {
      return en;
    }
    throw new Error(`Unknown locale ${locale}`);
  }
}

export type Translations = {
  appTitle: string;
  add: {
    titlePlaceholder: string;
    coverPlaceholder: string;
    addButton: string;
  },
  booksRead: (count: number) => string;
  filter: {
    all: string;
    read: string;
    unread: string;
  },
  book: {
    markAsRead: string;
    markAsUnread: string;
    save: string;
    cancel: string;
  },
  errors: {
    invalidBookTitleLength: (minTitleLength: number, maxTitleLength: number) => string;
    invalidCharactersBookTitleError: string;
    forbiddenWordsBookTitleError: (forbiddenWord: string) => string;
    invalidUrlBookCoverError: string;
    repeatedTitleError: string;
  }
}
