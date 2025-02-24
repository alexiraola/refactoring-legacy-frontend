export enum BookTitleError {
  INVALID_LENGTH,
  FORBIDDEN_WORDS,
  INVALID_CHARACTERS
}

export enum BookCoverError {
  INVALID_URL
}

export enum BookError {
  REPEATED_TITLE
}

export type LibraryErrorType = BookTitleError | BookCoverError | BookError;

export class LibraryError extends Error {
  constructor(readonly type: LibraryErrorType, message: string) {
    super(message);
  }
}
