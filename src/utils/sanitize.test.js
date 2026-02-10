import { describe, it, expect } from "vitest";
import { sanitizeText, sanitizeEmail, sanitizeSearchTerm } from "./sanitize";

describe("sanitizeText", () => {
  it("returns plain text unchanged", () => {
    expect(sanitizeText("Buy groceries")).toBe("Buy groceries");
  });

  it("trims whitespace", () => {
    expect(sanitizeText("  hello world  ")).toBe("hello world");
  });

  it("strips HTML tags but keeps text content", () => {
    expect(sanitizeText("<b>bold</b> text")).toBe("bold text");
  });

  it("strips script tags and their content", () => {
    expect(sanitizeText('<script>alert("xss")</script>Safe')).toBe("Safe");
  });

  it("strips event handler attributes from tags", () => {
    expect(sanitizeText('<img onerror="alert(1)" src="x">')).toBe("");
  });

  it("handles nested HTML tags", () => {
    expect(sanitizeText("<div><p><span>nested</span></p></div>")).toBe(
      "nested",
    );
  });

  it("returns empty string for non-string input (number)", () => {
    expect(sanitizeText(123)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(sanitizeText(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(sanitizeText(undefined)).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeText("")).toBe("");
  });

  it("encodes HTML-sensitive characters as entities", () => {
    const result = sanitizeText("Price: $5 & tax < 10%");
    expect(result).toBe("Price: $5 &amp; tax &lt; 10%");
  });
});

describe("sanitizeEmail", () => {
  it("returns valid email unchanged", () => {
    expect(sanitizeEmail("user@example.com")).toBe("user@example.com");
  });

  it("trims whitespace", () => {
    expect(sanitizeEmail("  user@test.com  ")).toBe("user@test.com");
  });

  it("strips HTML from email input", () => {
    expect(sanitizeEmail('<script>alert("xss")</script>user@test.com')).toBe(
      "user@test.com",
    );
  });

  it("returns empty string for non-string input", () => {
    expect(sanitizeEmail(42)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(sanitizeEmail(null)).toBe("");
  });
});

describe("sanitizeSearchTerm", () => {
  it("returns plain search term unchanged", () => {
    expect(sanitizeSearchTerm("groceries")).toBe("groceries");
  });

  it("trims whitespace", () => {
    expect(sanitizeSearchTerm("  search term  ")).toBe("search term");
  });

  it("strips HTML tags but keeps text content", () => {
    expect(sanitizeSearchTerm("<b>search</b>")).toBe("search");
  });

  it("strips script tags", () => {
    expect(sanitizeSearchTerm('<script>alert(1)</script>term')).toBe("term");
  });

  it("returns empty string for non-string input", () => {
    expect(sanitizeSearchTerm(null)).toBe("");
    expect(sanitizeSearchTerm(undefined)).toBe("");
    expect(sanitizeSearchTerm(123)).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeSearchTerm("")).toBe("");
  });
});
