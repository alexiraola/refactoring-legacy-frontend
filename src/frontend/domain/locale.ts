export class Locale {
  private constructor(private readonly locale: string) { }

  static create(locale: string) {
    if (locale === 'en') {
      return this.en();
    }
    if (locale === 'es') {
      return this.es();
    }
    throw new Error(`Unknown locale ${locale}`);
  }

  static en() {
    return new Locale('en');
  }

  static es() {
    return new Locale('es');
  }

  equals(locale: Locale) {
    return this.locale === locale.locale;
  }

  toString() {
    return this.locale;
  }
}
