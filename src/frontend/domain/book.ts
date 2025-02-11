import { v4 as uuid } from "uuid";

export class Book {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly pictureUrl: string,
    public completed: boolean
  ) { }

  static create(title: string, cover: string): Book {
    this.ensureIsValidTitle(title);
    this.ensureIsValidCover(cover);
    return new Book(uuid(), title, cover, false);
  }

  private static ensureIsValidTitle(title: string) {
    const minTitleLength = 3;
    const maxTitleLength = 100;

    const hasValidLength = title.length < minTitleLength || title.length > maxTitleLength;
    if (hasValidLength) {
      throw new Error(`Error: The title must be between ${minTitleLength} and ${maxTitleLength} characters long.`);
    }

    const isValidTitle = /[^a-zA-Z0-9\s]/.test(title);
    if (isValidTitle) {
      throw new Error('Error: The title can only contain letters, numbers, and spaces.');
    }

    const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
    const words = title.split(/\s+/);
    let foundForbiddenWord = words.find(word => forbiddenWords.includes(word));
    if (foundForbiddenWord) {
      throw new Error(`Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
    }
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
