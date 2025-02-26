import { describe, expect } from "vitest";
import { Locale } from "../../../frontend/domain/locale";

describe('Locale', () => {
  it('should create an instance for English', () => {
    const locale = Locale.en();

    expect(locale.toString()).toBe('en');
  });

  it('should create an instance for Spanish', () => {
    const locale = Locale.es();

    expect(locale.toString()).toBe('es');
  });

  it('should detect two locales as equal', () => {
    expect(Locale.es().equals(Locale.es())).toBeTruthy();
  });

  it('should detect two different locales as not equal', () => {
    expect(Locale.es().equals(Locale.en())).toBeFalsy();
  });
})
