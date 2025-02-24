import { BookTitleError, LibraryError } from "../common/library.error";

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
      throw new LibraryError(BookTitleError.INVALID_LENGTH, `Error: The title must be between ${minTitleLength} and ${maxTitleLength} characters long.`);
    }
  }

  private static ensureContainsValidCharacters(title: string) {
    const isValidTitle = /[^a-zA-Z0-9\s]/.test(title);
    if (isValidTitle) {
      throw new LibraryError(BookTitleError.INVALID_CHARACTERS, 'Error: The title can only contain letters, numbers, and spaces.');
    }
  }

  private static ensureDoesNotContainForbiddenWords(title: string) {
    const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
    const words = title.split(/\s+/);
    let foundForbiddenWord = words.find(word => forbiddenWords.includes(word));
    if (foundForbiddenWord) {
      throw new LibraryError(BookTitleError.FORBIDDEN_WORDS, `Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
    }
  }
}
