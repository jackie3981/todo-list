import { describe, it, expect } from "vitest";
import { isValidTodoTitle } from "./todoValidation";

describe("isValidTodoTitle", () => {
  it("returns true for a non-empty title", () => {
    expect(isValidTodoTitle("Buy milk")).toBe(true);
  });

  it("returns true for a single character", () => {
    expect(isValidTodoTitle("A")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isValidTodoTitle("")).toBe(false);
  });

  it("returns false for whitespace-only string", () => {
    expect(isValidTodoTitle("   ")).toBe(false);
  });

  it("returns false for tab-only string", () => {
    expect(isValidTodoTitle("\t")).toBe(false);
  });

  it("returns true for string with leading/trailing spaces and content", () => {
    expect(isValidTodoTitle("  valid  ")).toBe(true);
  });
});
