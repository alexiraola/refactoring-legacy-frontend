enum ErrorType {
  INVALID_URL
}

export class BookCoverError extends Error {
  constructor(readonly type: ErrorType, message: string) {
    super(message);
  }
}

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
    if (!this.isValidUrl(cover)) {
      throw new BookCoverError(ErrorType.INVALID_URL, 'Error: The cover url is not valid');
    }
  }

  private static isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    }
    catch (e) {
      return false;
    }
  }
}
