import { Coordinates } from "../src/lib/Coordinates";
import { isLat, isLon, isPoint } from "../src/lib/Point";
import { isLine } from "../src/lib/Line";
import { isMultiPolygon, isPolygon } from "../src/lib/Polygon";

import { multipolygonCoords } from "./RealMPCoordinates";

/** Tests for coordinate validations. */
describe("Coordinates", () => {
  /** Points */
  const [lat, lon]: [number, number] = [33.2, 22.12];
  const [latNeg, lonNeg]: [number, number] = [-176.2, -89.76];
  const [lat0, lon0]: [number, number] = [0, 0];
  const [latTooBig, lonTooBig]: [number, number] = [182.1, 99.1];
  const [latTooSm, lonTooSm]: [number, number] = [-180.2, -91.0];
  const [notLat, notLon]: [unknown, unknown] = ["2", { foo: "bar" }];
  const [nullLat, nullLon]: [unknown, unknown] = [null, null];

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

  describe("isLat(lat)", () => {
    it("returns true if lat is a positive valid latitude value", () =>
      expect(isLat(lat)).toBe(true));
    it("returns true if lat is a zero latitude value", () =>
      expect(isLat(lat0)).toBe(true));
    it("returns true if lat is a negative valid latitude value", () =>
      expect(isLat(latNeg)).toBe(true));
    it("returns false if lat is too big", () =>
      expect(isLat(latTooBig)).toBe(false));
    it("returns false if lat is too small", () =>
      expect(isLat(latTooSm)).toBe(false));
    it("returns false if lat is not a number", () =>
      expect(isLat(<number>notLat)).toBe(false));
    it("returns false if lat is null", () =>
      expect(isLat(<number>nullLat)).toBe(false));
    it("returns false if lat is a NaN", () => expect(isLat(NaN)).toBe(false));
  });

  describe("isLon(lon)", () => {
    it("returns true if lon is a positive valid latitude value", () =>
      expect(isLon(lon)).toBe(true));
    it("returns true if lon is a zero latitude value", () =>
      expect(isLon(lon0)).toBe(true));
    it("returns true if lon is a negative valid latitude value", () =>
      expect(isLon(lonNeg)).toBe(true));
    it("returns false if lon is too big", () =>
      expect(isLon(lonTooBig)).toBe(false));
    it("returns false if lon is too small", () =>
      expect(isLon(lonTooSm)).toBe(false));
    it("returns false if lon is not a number", () =>
      expect(isLon(<number>notLon)).toBe(false));
    it("returns false if lon is null", () =>
      expect(isLon(<number>nullLon)).toBe(false));
    it("returns false if lon is a NaN", () => expect(isLon(NaN)).toBe(false));
  });

  describe("isPoint(p)", () => {
    it("returns true if p is a positive vector", () =>
      expect(isPoint([lon, lat])).toBe(true));
    it("returns true if p is a zero vector", () =>
      expect(isPoint([0, 0])).toBe(true));
    it("returns true if p has negative entries", () =>
      expect(isPoint([-99.1, 89.0])).toBe(true));
    it("returns false if p:lat is higher than 180.0", () =>
      expect(isPoint([latTooBig, 21.1])).toBe(false));
    it("returns false if p:lon is higher than 90.0", () =>
      expect(isPoint([21.7, lonTooBig])).toBe(false));
    it("returns false if p:lat is lower than -180.0", () =>
      expect(isPoint([-180.01, 0])).toBe(false));
    it("returns false if p:lon is lower than -90.0", () =>
      expect(isPoint([-10.01, lonTooSm])).toBe(false));
    it("returns false if p is not a point", () =>
      expect(isPoint({ q: 111111 })).toBe(false));
    it("returns false if p is null", () => expect(isPoint(null)).toBe(false));
    it("returns false if p is has null entries", () =>
      expect(isPoint([127.3, null])).toBe(false));
    it("returns false if p is has string entries", () =>
      expect(isPoint([1, "2"])).toBe(false));
  });

  describe("isLine(l)", () => {
    it("returns true if l is a positive point array", () =>
      expect(isLine(validPA)).toBe(true));
    it("returns true if l is a zero point array", () =>
      expect(isLine(validPA0)).toBe(true));
    it("returns true if l has negative points", () =>
      expect(isLine(validNegativePA)).toBe(true));
    it("returns true if l has only one entry", () =>
      expect(isLine(onlyOnePA)).toBe(true));
    it("returns false if l is empty", () => expect(isLine(emptyPA)).toBe(false));
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
      expect(isPolygon([invalidHighLatPA, validPA0])).toBe(false));
    it("returns false if l has invalid longitude lines", () =>
      expect(isPolygon([validPA0, invalidLowLonPA])).toBe(false));
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
          [invalidHighLatPA, validNegativePA],
          [validPA, validNegativePA],
        ])
      ).toBe(false));

    it("returns false if pa is null", () =>
      expect(isMultiPolygon(null)).toBe(false));
  });
});
