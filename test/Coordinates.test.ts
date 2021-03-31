import {
  Coordinates,
  isLat,
  isLineArray,
  isLon,
  isPoint,
  isPointArray,
  isPolygonArray,
} from "../src/lib/Coordinates";
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

  describe("isPointArray(l)", () => {
    it("returns true if l is a positive point array", () =>
      expect(isPointArray(validPA)).toBe(true));
    it("returns true if l is a zero point array", () =>
      expect(isPointArray(validPA0)).toBe(true));
    it("returns true if l has negative points", () =>
      expect(isPointArray(validNegativePA)).toBe(true));
    it("returns true if l has only one entry", () =>
      expect(isPointArray(onlyOnePA)).toBe(true));
    it("returns true if l is empty", () =>
      expect(isPointArray(emptyPA)).toBe(true));
    it("returns false if l has latitudes higher than 180.0", () =>
      expect(isPointArray(invalidHighLatPA)).toBe(false));
    it("returns false if l has longitudes higher than 90.0", () =>
      expect(isPointArray(invalidHighLonPA)).toBe(false));
    it("returns false if l has latitudes lower than 180.0", () =>
      expect(isPointArray(invalidLowLatPA)).toBe(false));
    it("returns false if l has longitudes lower than 90.0", () =>
      expect(isPointArray(invalidLowLonPA)).toBe(false));
    it("returns false if l is not a point array", () =>
      expect(isPointArray({ q: 111111 })).toBe(false));
    it("returns false if l is null", () =>
      expect(isPointArray(null)).toBe(false));
    it("returns false if l is has null entries", () =>
      expect(
        isPointArray([
          [127.3, null],
          [0, 0],
        ])
      ).toBe(false));
    it("returns false if l is has string entries", () =>
      expect(
        isPointArray([
          [1, "2"],
          [1, "2"],
        ])
      ).toBe(false));
  });

  describe("isLineArray(l)", () => {
    it("returns true if l is valid", () =>
      expect(isLineArray([validPA, validNegativePA])).toBe(true));
    it("returns true if l has zero values", () =>
      expect(isLineArray([validPA0, validPA0, validPA0, validNegativePA])).toBe(
        true
      ));
    it("returns true if l is empty", () => expect(isLineArray([])).toBe(true));
    it("returns false if l is null", () =>
      expect(isLineArray(null)).toBe(false));
    it("returns false if l has null entries", () =>
      expect(isLineArray([null])).toBe(false));
    it("returns false if l is undefined", () =>
      expect(isLineArray(undefined)).toBe(false));
    it("returns false if l is not a line array", () =>
      expect(isLineArray({ not: "lineArray" })).toBe(false));
    it("returns false if l has invalid latitude lines", () =>
      expect(isLineArray([invalidHighLatPA, validPA0])).toBe(false));
    it("returns false if l has invalid longitude lines", () =>
      expect(isLineArray([validPA0, invalidLowLonPA])).toBe(false));
  });

  describe("isPolygonArray(pa)", () => {
    it("returns true if pa is valid", () =>
      expect(
        isPolygonArray([
          [validPA, validNegativePA],
          [validPA, validNegativePA],
        ])
      ).toBe(true));

    it("returns true if pa has one entry", () =>
      expect(isPolygonArray([[validPA, validNegativePA]])).toBe(true));
    it("returns true if pa is empty", () =>
      expect(isPolygonArray([])).toBe(true));

    it("returns true with 'real' multipolygon coordinates", () =>
      expect(isPolygonArray(multipolygonCoords)).toBe(true));

    it("returns false if pa is invalid", () =>
      expect(
        isPolygonArray([
          [invalidHighLatPA, validNegativePA],
          [validPA, validNegativePA],
        ])
      ).toBe(false));

    it("returns false if pa is null", () =>
      expect(isPolygonArray(null)).toBe(false));
  });
});
