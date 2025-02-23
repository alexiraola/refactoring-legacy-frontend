export class BookCover {
  constructor(private readonly url: URL) { }

  static create(cover: string): BookCover {
    this.ensureIsValidCover(cover);
    return new BookCover(new URL(cover));
  }

  toString() {
    return this.url.toString();
  }

  private static ensureIsValidCover(cover: string) {
    if (!isValidUrl(cover)) {
      throw new Error('Error: The cover url is not valid');
    }
  }
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  }
  catch (e) {
    return false;
  }
}
