import { Just, Maybe, Nothing } from "purify-ts";
import {
  GeoJsonGeometryTypes,
  Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

import {
  Coordinates,
  isLineArray,
  isPoint,
  isPointArray,
  isPolygonArray,
} from "./Coordinates";

import { record } from "./Record";

/** Basic GeoJSON FeatureTypes */
export const geometryTypes = [
  "MultiPolygon",
  "Polygon",
  "MultiLineString",
  "MultiPoint",
  "LineString",
  "Point",
];

const featureHasGeometry = (geom: record): boolean => {
  if (geom === null) {
    return true;
  }

  return typeof geom["type"] === "string"
    ? geometryTypes.includes(geom["type"])
    : false;
};

/**
 * Validates a given record and eventually returns a GeoJSON Geometry object.
 * According to the spec, null values are also valid geometries, but the parser
 * will nevertheless issue a warning.
 *
 * @param geometry a possible geometry record
 */
export const validateFeatureGeometry = (
  geometry: record | null
): Maybe<Geometry> => {
  if (geometry === null) {
    return Just(<Geometry>(<unknown>null));
  }

  if (!featureHasGeometry(geometry)) {
    return Nothing;
  }

  const geom = <Geometry>(<unknown>geometry);

  switch (geom["type"]) {
    case "Point":
      return validatePoint(geom);

    case "MultiPoint":
      return validateMultiPoint(geom);

    case "LineString":
      return validateLineString(geom);

    case "MultiLineString":
      return validateMultiLineString(geom);

    case "Polygon":
      return validatePolygon(geom);

    case "MultiPolygon":
      return validateMultiPolygon(geom);

    case "GeometryCollection":
      console.error("GeometryCollection not implemented");
      return Nothing;

    default:
      console.error("invalid geometry type");
      return Nothing;
  }
};

/**
 * Executes 'geometryTest' on the geometry 'geom' and eventually turns it in into a
 * GeoJSON geometry.
 *
 * @param geometryTest a geometry test function as found in "src/Coordinates.ts"
 * @param geom the geometry that should be tested
 * @param featureType the resulting geojson geometry type
 */
const testWith = <T>(
  geometryTest: (x: Geometry) => boolean,
  geom: Geometry,
  featureType: GeoJsonGeometryTypes
): Maybe<T> =>
  Maybe.fromPredicate(() => geometryTest(geom), geom["coordinates"])
    .ifNothing(() => console.error(`Invalid ${featureType} feature`))
    .chain((coords: Coordinates) =>
      Just(<T>(<unknown>{ type: featureType, coordinates: coords }))
    );

const validatePoint = (geom: Point): Maybe<Point> =>
  testWith<Point>(isPoint, geom, "Point");

const validateMultiPoint = (geom: Geometry): Maybe<MultiPoint> =>
  testWith<MultiPoint>(isPointArray, geom, "MultiPoint");

const validateLineString = (geom: Geometry): Maybe<LineString> =>
  testWith<LineString>(isPointArray, geom, "LineString");

const validateMultiLineString = (geom: Geometry): Maybe<MultiLineString> =>
  testWith<MultiLineString>(isLineArray, geom, "MultiLineString");

const validatePolygon = (geom: Geometry): Maybe<Polygon> =>
  testWith<Polygon>(isLineArray, geom, "Polygon");

const validateMultiPolygon = (geom: Geometry): Maybe<MultiPolygon> =>
  testWith<MultiPolygon>(isPolygonArray, geom, "MultiPolygon");
