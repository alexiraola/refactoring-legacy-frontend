import { BookTitle } from "../../../../frontend/domain/valueObjects/book.title";
import { describe, it, expect } from "vitest";

describe("Book Title", () => {
  it("should create a title with a valid string", () => {
    const bookTitle = BookTitle.create("Book title");

    expect(bookTitle.toString()).toBe("Book title");
  });

  it("should not create a title with a string shorter than 3 characters", () => {
    expect(() => {
      BookTitle.create("Bo");
    }).toThrow("Error: The title must be between 3 and 100 characters long.");
  });

  it("should not create a title that contains invalid characters", () => {
    expect(() => {
      BookTitle.create("Book!");
    }).toThrow("Error: The title can only contain letters, numbers, and spaces");
  });

  it("should not create a Book with a title that contains forbidden words", () => {
    expect(() => {
      BookTitle.create("Book banned");
    }).toThrow('Error: The title cannot include the prohibited word "banned"');
  });
});
