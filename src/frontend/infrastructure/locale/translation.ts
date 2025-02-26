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
  }
}
