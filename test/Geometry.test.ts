// import { Geometry } from "geojson";
import { Just, Nothing } from "purify-ts";

import { Coordinates } from "../src/lib/Coordinates";
import { geometryTypes, validateFeatureGeometry } from "../src/lib/Geometry";
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
      expect(geometryTypes.includes("GeometryCollection")).toBe(true);
    });
  });

  describe("validateFeatureGeometry(geom)", () => {
    it("returns Just(geom) if geom is a valid geometry", () => {
      const point: Coordinates = [0.0, 1.2];
      const pointGeom: record = {
        type: "Point",
        coordinates: point,
      };
      expect(validateFeatureGeometry(pointGeom)).toEqual(Just(pointGeom));

      const pointArray: Coordinates = [[0, 0], point, [11.2, 1]];
      const lineGeom = {
        type: "LineString",
        coordinates: pointArray,
      };
      expect(validateFeatureGeometry(lineGeom)).toEqual(Just(lineGeom));

      const lineArray: Coordinates = [[[0, 0], point], pointArray, pointArray];
      const mlineGeom = {
        type: "MultiLineString",
        coordinates: lineArray,
      };
      const polyGeom = {
        type: "Polygon",
        coordinates: lineArray,
      };
      expect(validateFeatureGeometry(mlineGeom)).toEqual(Just(mlineGeom));
      expect(validateFeatureGeometry(polyGeom)).toEqual(Just(polyGeom));

      const polyArray: Coordinates = [lineArray, lineArray];
      const multipolyGeom = {
        type: "MultiPolygon",
        coordinates: polyArray,
      };
      expect(validateFeatureGeometry(multipolyGeom)).toEqual(
        Just(multipolyGeom)
      );

      expect(validateFeatureGeometry(null)).toEqual(Just(null));
    });

    it("returns Nothing if geom is an invalid geometry", () => {
      expect(validateFeatureGeometry(<record>(<unknown>undefined))).toBe(
        Nothing
      );

      expect(
        validateFeatureGeometry({
          type: null,
          coordinates: "Thunk!",
        })
      ).toEqual(Nothing);

      expect(
        validateFeatureGeometry({
          type: null,
          coordinates: [1, 2, 3, 4, 5, 6, 7, 9],
        })
      ).toEqual(Nothing);

      expect(
        validateFeatureGeometry({
          type: "Point",
          coordinates: null,
        })
      ).toEqual(Nothing);

      expect(
        validateFeatureGeometry({
          type: "Point",
          coordinates: [[190.2, 88.3]],
        })
      ).toEqual(Nothing);

      expect(
        validateFeatureGeometry({
          type: "Point",
          coordinates: [190.2, 88.3],
        })
      ).toEqual(Nothing);

      expect(
        validateFeatureGeometry({
          type: "MultiPoint",
          coordinates: [
            [0, 0],
            [0, null],
          ],
        })
      ).toEqual(Nothing);
    });
  });
});
