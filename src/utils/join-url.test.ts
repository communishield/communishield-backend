import { joinUrl } from "./join-url";

describe("joinUrl", () => {
  test("joins two URLs without slashes", () => {
    expect(joinUrl("http://example.com", "path")).toBe(
      "http://example.com/path",
    );
  });

  test("joins two URLs when first URL has trailing slash", () => {
    expect(joinUrl("http://example.com/", "path")).toBe(
      "http://example.com/path",
    );
  });

  test("joins two URLs when second URL has leading slash", () => {
    expect(joinUrl("http://example.com", "/path")).toBe(
      "http://example.com/path",
    );
  });

  test("joins multiple URLs", () => {
    expect(joinUrl("http://example.com", "path", "to", "resource")).toBe(
      "http://example.com/path/to/resource",
    );
  });

  test("handles empty strings in between", () => {
    expect(joinUrl("http://example.com", "", "path")).toBe(
      "http://example.com/path",
    );
  });

  test("handles all empty strings", () => {
    expect(joinUrl("", "", "")).toBe("");
  });

  test("removes duplicate slashes", () => {
    expect(joinUrl("http://example.com//", "//path")).toBe(
      "http://example.com/path",
    );
  });

  test("returns empty string for single slash", () => {
    expect(joinUrl("/")).toBe("");
  });

  test("handles a single non-empty string", () => {
    expect(joinUrl("http://example.com")).toBe("http://example.com");
  });

  test("handles a single empty string", () => {
    expect(joinUrl("")).toBe("");
  });

  test("handles single paths", () => {
    expect(joinUrl("path")).toBe("path");
  });

  test("handles non urls", () => {
    expect(joinUrl("path", "to", "resource")).toBe("path/to/resource");
  });

  test("handles absolute paths", () => {
    expect(joinUrl("/path", "to", "resource")).toBe("/path/to/resource");
  });
});
