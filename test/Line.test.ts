import { Coordinates } from "../src/lib/Coordinates";
import { isLine } from "../src/lib/Line";

/** Tests for line coordinate validations. */
describe("Lines", () => {
  /** Point Arrays */
  const validPA: Coordinates = [
    [1.1, 1.2],
    [1.5, 1.3],
    [1.5, 1.3],
  ];
  const validPA0: Coordinates = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  const validNegativePA: Coordinates = [
    [-99.1, 89.0],
    [0.1, 1.33],
    [-98.3, 22.3],
  ];
  const onlyOnePA: Coordinates = [[12.33, 42.1]];
  const emptyPA: Coordinates = [];

  const invalidHighLatPA: Coordinates = [
    [1.1, 1.2],
    [1.5, 1.3],
    [1.5, 1.3],
    [181.2, 0],
  ];
  const invalidHighLonPA: Coordinates = [
    [1.1, 1.2],
    [1.5, 1.3],
    [1.5, 1.3],
    [111.2, 99.3],
  ];
  const invalidLowLatPA: Coordinates = [
    [1.1, 1.2],
    [1.5, 1.3],
    [1.5, 1.3],
    [-181.2, 0],
  ];
  const invalidLowLonPA: Coordinates = [
    [1.1, 1.2],
    [1.5, 1.3],
    [1.5, 1.3],
    [111.2, -99.3],
  ];

  describe("isLine(l)", () => {
    it("returns true if l is a positive point array", () =>
      expect(isLine(validPA)).toBe(true));
    it("returns true if l is a zero point array", () =>
      expect(isLine(validPA0)).toBe(true));
    it("returns true if l has negative points", () =>
      expect(isLine(validNegativePA)).toBe(true));
    it("returns true if l has only one entry", () =>
      expect(isLine(onlyOnePA)).toBe(true));
    it("returns false if l is empty", () =>
      expect(isLine(emptyPA)).toBe(false));
    it("returns false if l has latitudes higher than 180.0", () =>
      expect(isLine(invalidHighLatPA)).toBe(false));
    it("returns false if l has longitudes higher than 90.0", () =>
      expect(isLine(invalidHighLonPA)).toBe(false));
    it("returns false if l has latitudes lower than 180.0", () =>
      expect(isLine(invalidLowLatPA)).toBe(false));
    it("returns false if l has longitudes lower than 90.0", () =>
      expect(isLine(invalidLowLonPA)).toBe(false));
    it("returns false if l is not a point array", () =>
      expect(isLine({ q: 111111 })).toBe(false));
    it("returns false if l is null", () => expect(isLine(null)).toBe(false));
    it("returns false if l is has null entries", () =>
      expect(
        isLine([
          [127.3, null],
          [0, 0],
        ])
      ).toBe(false));
    it("returns false if l is has string entries", () =>
      expect(
        isLine([
          [1, "2"],
          [1, "2"],
        ])
      ).toBe(false));
  });
});
