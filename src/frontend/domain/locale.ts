export class Locale {
  private constructor(private readonly locale: string) { }

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
