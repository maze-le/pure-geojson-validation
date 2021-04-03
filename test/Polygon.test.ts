import { isMultiPolygon, isPolygon } from "../src/lib/Polygon";

import { multipolygonCoords } from "./RealMPCoordinates";

/** Tests for polygon coordinate validations. */
describe("Polygons", () => {

  const polygon = [
    [
      [123, 44],
      [124, 42],
      [124, 49],
      [123, 44],
    ],
  ];

  const polygonWithZeroCoords = [
    [
      [0, 0],
      [1, 0],
      [2, 2],
      [-3, 4],
      [0, 0],
    ],
  ];
  describe("isPolygon(l)", () => {
    it("returns true if l is valid", () =>
      expect(isPolygon(polygon)).toBe(true));
    it("returns true if l has zero values", () =>
      expect(isPolygon(polygonWithZeroCoords)).toBe(true));

    it("returns false if l is empty", () => expect(isPolygon([])).toBe(false));

    it("returns false if l has only 1 entry", () =>
      expect(isPolygon([[2, 3]])).toBe(false));

    it("returns false if l has only 2 entries", () =>
      expect(
        isPolygon([
          [2, 3],
          [2, 3],
        ])
      ).toBe(false));

    it("returns false if l has only 3 entries", () =>
      expect(
        isPolygon([
          [2, 3],
          [4, 2],
          [2, 3],
        ])
      ).toBe(false));

    it("returns false if l is null", () => expect(isPolygon(null)).toBe(false));
    it("returns false if l has null entries", () =>
      expect(isPolygon([null])).toBe(false));
    it("returns false if l is undefined", () =>
      expect(isPolygon(undefined)).toBe(false));
    it("returns false if l is not a line array", () =>
      expect(isPolygon({ not: "lineArray" })).toBe(false));
    it("returns false if l has invalid latitude lines", () =>
      expect(isPolygon([182.1, 13.2])).toBe(false));
    it("returns false if l has invalid longitude lines", () =>
      expect(isPolygon([11.2, -99.3])).toBe(false));
  });

  describe("isMultiPolygon(pa)", () => {
    it("returns true if pa is valid", () =>
      expect(isMultiPolygon([polygon, polygonWithZeroCoords])).toBe(true));

    it("returns true if pa has one entry", () =>
      expect(isMultiPolygon([polygon])).toBe(true));

    it("returns true if pa is empty", () =>
      expect(isMultiPolygon([])).toBe(true));

    it("returns true with 'real' multipolygon coordinates", () =>
      expect(isMultiPolygon(multipolygonCoords)).toBe(true));

    it("returns false if pa is invalid", () =>
      expect(
        isMultiPolygon([
          [182.1, -22.1],
          [162.2, -22.3],
        ])
      ).toBe(false));

    it("returns false if pa is null", () =>
      expect(isMultiPolygon(null)).toBe(false));
  });
});
