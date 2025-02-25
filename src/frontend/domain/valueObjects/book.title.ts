export class InvalidBookTitleLengthError extends Error {
  constructor(readonly minTitleLength: number, readonly maxTitleLength: number) {
    super(`Error: The title must be between ${minTitleLength} and ${maxTitleLength} characters long.`);
  }
}

export class InvalidCharactersBookTitleError extends Error {
  constructor() {
    super("Error: The title can only contain letters, numbers, and spaces.");
  }
}

export class ForbiddenWordsBookTitleError extends Error {
  constructor(readonly forbiddenWord: string) {
    super(`Error: The title cannot include the prohibited word "${forbiddenWord}"`);
  }
}

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
    this.ensureHasValidLength(title);
    this.ensureContainsValidCharacters(title);
    this.ensureDoesNotContainForbiddenWords(title);
  }

  private static ensureHasValidLength(title: string) {
    const minTitleLength = 3;
    const maxTitleLength = 100;

    const hasValidLength = title.length < minTitleLength || title.length > maxTitleLength;
    if (hasValidLength) {
      throw new InvalidBookTitleLengthError(minTitleLength, maxTitleLength);
    }
  }

  private static ensureContainsValidCharacters(title: string) {
    const isValidTitle = /[^a-zA-Z0-9\s]/.test(title);
    if (isValidTitle) {
      throw new InvalidCharactersBookTitleError();
    }
  }

  private static ensureDoesNotContainForbiddenWords(title: string) {
    const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
    const words = title.split(/\s+/);
    let foundForbiddenWord = words.find(word => forbiddenWords.includes(word));
    if (foundForbiddenWord) {
      throw new ForbiddenWordsBookTitleError(foundForbiddenWord);
    }
  }
}
