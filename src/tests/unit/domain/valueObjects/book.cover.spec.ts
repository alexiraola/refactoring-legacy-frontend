import { describe, it, expect } from "vitest";
import { BookCover } from "../../../../frontend/domain/valueObjects/book.cover";

describe("Book Cover", () => {
  it("should create a cover with a valid url", () => {
    const bookCover = BookCover.create("https://example.com/cover.jpg");

    expect(bookCover.toString()).toBe("https://example.com/cover.jpg");
  });

  it("should not create a cover with an invalid url", () => {
    expect(() => {
      BookCover.create("httpsexample.com/cover.jpg");
    }).toThrow("Error: The cover url is not valid");
  });
});
