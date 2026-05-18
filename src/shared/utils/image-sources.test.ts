import { describe, expect, it } from "vitest";
import { getValidImageSources, isValidImageSrc } from "@/shared/utils/image-sources";

describe("image-sources", () => {
  it("accepts absolute http and https URLs plus root-relative paths", () => {
    expect(isValidImageSrc("https://example.com/image.jpg")).toBe(true);
    expect(isValidImageSrc("http://example.com/image.jpg")).toBe(true);
    expect(isValidImageSrc("/images/phone.jpg")).toBe(true);
  });

  it("rejects plain text and empty values", () => {
    expect(isValidImageSrc("Apple iPhone 15")).toBe(false);
    expect(isValidImageSrc("")).toBe(false);
    expect(isValidImageSrc("   ")).toBe(false);
    expect(isValidImageSrc(undefined)).toBe(false);
  });

  it("filters invalid entries and keeps trimmed valid URLs", () => {
    expect(
      getValidImageSources([
        "Apple iPhone 15",
        " https://example.com/iphone-15.jpg ",
        "/images/local-phone.jpg",
      ]),
    ).toEqual(["https://example.com/iphone-15.jpg", "/images/local-phone.jpg"]);
  });
});
