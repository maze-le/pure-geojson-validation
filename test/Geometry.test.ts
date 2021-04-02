// import { Geometry } from "geojson";
import { Just, Nothing } from "purify-ts";

import { Coordinates } from "../src/lib/Coordinates";
import { geometryTypes, validateGeometry } from "../src/lib/Geometry";
import { record } from "../src/lib/Shared";

describe("Geometry", () => {
  describe("geometryTypes", () => {
    it("has all geojson members", () => {
      expect(geometryTypes.includes("Point")).toBe(true);
      expect(geometryTypes.includes("MultiPoint")).toBe(true);
      expect(geometryTypes.includes("LineString")).toBe(true);
      expect(geometryTypes.includes("MultiLineString")).toBe(true);
      expect(geometryTypes.includes("Polygon")).toBe(true);
      expect(geometryTypes.includes("MultiPolygon")).toBe(true);
      // expect(geometryTypes.includes("GeometryCollection")).toBe(true);
    });
  });

  describe("validateGeometry(geom)", () => {
    it("returns Just(geom) if geom is a valid geometry", () => {
      const point: Coordinates = [0.0, 1.2];
      const pointGeom: record = { type: "Point", coordinates: point };
      expect(validateGeometry(pointGeom)).toEqual(Just(pointGeom));

      const pointArray: Coordinates = [[0, 0], point, [11.2, 1], [0, 0]];
      const lineGeom = { type: "LineString", coordinates: pointArray };
      expect(validateGeometry(lineGeom)).toEqual(Just(lineGeom));

      const lineArray: Coordinates = [
        [[0, 0], point, [133, 22], [0, 0]],
        pointArray,
      ];
      const mlineGeom = { type: "MultiLineString", coordinates: lineArray };
      const polyGeom = { type: "Polygon", coordinates: lineArray };
      expect(validateGeometry(mlineGeom)).toEqual(Just(mlineGeom));
      expect(validateGeometry(polyGeom)).toEqual(Just(polyGeom));

      const polyArray: Coordinates = [lineArray, lineArray];
      const multipolyGeom = { type: "MultiPolygon", coordinates: polyArray };
      expect(validateGeometry(multipolyGeom)).toEqual(Just(multipolyGeom));
      expect(validateGeometry(null)).toEqual(Just(null));
    });

    // it("returns Nothing if geom is an invalid geometry", () => {
    it("returns Nothing if geom is undefined", () =>
      expect(validateGeometry(<record>(<unknown>undefined))).toBe(Nothing));

    it("returns Nothing if geom has invalid coordinates", () =>
      expect(
        validateGeometry({ type: "Point", coordinates: "Thunk!" })
      ).toEqual(Nothing));

    it("returns Nothing if geom has an invalid type", () =>
      expect(
        validateGeometry({ type: null, coordinates: [1, 2, 3, 4, 5, 6, 7, 9] })
      ).toEqual(Nothing));

    it("returns Nothing if lat coordinates exceed 180°", () =>
      expect(
        validateGeometry({ type: "Point", coordinates: [[190.2, 88.3]] })
      ).toEqual(Nothing));

    it("returns Nothing if lon coordinates exceed -90°", () =>
      expect(
        validateGeometry({ type: "Point", coordinates: [19.2, -98.3] })
      ).toEqual(Nothing));

    it("returns Nothing if a coordinate value is null", () =>
      expect(
        validateGeometry({
          type: "MultiPoint",
          coordinates: [
            [0, 0],
            [0, null],
          ],
        })
      ).toEqual(Nothing));
  });
});
