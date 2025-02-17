import { LibraryService } from "../domain/services/library.service";
import { ApiBookRepository } from "./api.book.repository";

export class Factory {
  static createLibraryService() {
    return new LibraryService(new ApiBookRepository('http://localhost:3000/api'));
  }
}
