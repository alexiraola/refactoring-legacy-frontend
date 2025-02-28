import { RepeatedTitleError } from "../../application/library.service";
import { InvalidUrlBookCoverError } from "../../domain/valueObjects/book.cover";
import { ForbiddenWordsBookTitleError, InvalidBookTitleLengthError, InvalidCharactersBookTitleError } from "../../domain/valueObjects/book.title";
import { Translations } from "../locale/translation";

export const getErrorMessage = (error: Error, t: Translations) => {
  if (error instanceof InvalidBookTitleLengthError) {
    return t.errors.invalidBookTitleLength(error.minTitleLength, error.maxTitleLength);
  } else if (error instanceof InvalidCharactersBookTitleError) {
    return t.errors.invalidCharactersBookTitleError;
  } else if (error instanceof ForbiddenWordsBookTitleError) {
    return t.errors.forbiddenWordsBookTitleError(error.forbiddenWord);
  } else if (error instanceof InvalidUrlBookCoverError) {
    return t.errors.invalidUrlBookCoverError;
  } else if (error instanceof RepeatedTitleError) {
    return t.errors.repeatedTitleError;
  } else {
    return error.message;
  }
}
