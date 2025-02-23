enum ErrorType {
  INVALID_LENGTH,
  FORBIDDEN_WORDS,
  INVALID_CHARACTERS
}

export class BookTitleError extends Error {
  constructor(readonly type: ErrorType, message: string) {
    super(message);
  }
};

export class BookTitle {
  constructor(private readonly title: string) { }

  static create(title: string): BookTitle {
    this.ensureIsValidTitle(title);
    return new BookTitle(title);
  }

  toString() {
    return this.title;
  }

  private static ensureIsValidTitle(title: string) {
    const minTitleLength = 3;
    const maxTitleLength = 100;

    const hasValidLength = title.length < minTitleLength || title.length > maxTitleLength;
    if (hasValidLength) {
      throw new BookTitleError(ErrorType.INVALID_LENGTH, `Error: The title must be between ${minTitleLength} and ${maxTitleLength} characters long.`);
    }

    const isValidTitle = /[^a-zA-Z0-9\s]/.test(title);
    if (isValidTitle) {
      throw new BookTitleError(ErrorType.INVALID_LENGTH, 'Error: The title can only contain letters, numbers, and spaces.');
    }

    const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
    const words = title.split(/\s+/);
    let foundForbiddenWord = words.find(word => forbiddenWords.includes(word));
    if (foundForbiddenWord) {
      throw new BookTitleError(ErrorType.FORBIDDEN_WORDS, `Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
    }
  }
}
