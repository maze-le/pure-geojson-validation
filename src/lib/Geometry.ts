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
import { record } from "./Shared";

/** Basic GeoJSON FeatureTypes */
export const geometryTypes: GeoJsonGeometryTypes[] = [
  "Polygon",
  "MultiPolygon",
  "LineString",
  "MultiLineString",
  "Point",
  "MultiPoint",
  "GeometryCollection",
];

export type Geom =
  | LineString
  | MultiLineString
  | MultiPoint
  | MultiPolygon
  | Point
  | Polygon;

const featureHasGeometry = (geom: record): boolean => {
  if (geom === null) {
    return true;
  }

  if (typeof geom !== "object") {
    return false;
  }

  return typeof geom["type"] === "string"
    ? geometryTypes.includes(<GeoJsonGeometryTypes>geom["type"])
    : false;
};

/**
 * Validates a given record and eventually returns a GeoJSON Geometry object.
 * According to the spec, null values are also valid geometries, but the parser
 * will nevertheless issue a warning.
 *
 * @param geometry a possible geometry record
 */
export const validateGeometry = (geometry: record | null): Maybe<Geometry> => {
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

/** Geometry factory */
const geometry = <T>(type: string, coordinates: Coordinates) =>
  Just(<T>(<unknown>{ type, coordinates }));

/**
 * Executes 'test' on the coordinates of the geometry 'geom' and eventually turns it in into a
 * GeoJSON geometry.
 *
 * @param test a predicate (function that returns boolean) as found in "src/Coordinates.ts"
 * @param geom the geometry that should be tested
 * @param geomType the resulting geojson geometry type
 */
const testWith = <T>(
  test: (x: Coordinates) => boolean,
  geom: Geom,
  geomType: GeoJsonGeometryTypes
): Maybe<T> =>
  Maybe.fromPredicate(() => test(geom["coordinates"]), geom["coordinates"])
    .ifNothing(() => console.warn(`Invalid ${geomType} geometry`))
    .chain((coords: Coordinates) => geometry(geomType, coords));

const validatePoint = (geom: Point): Maybe<Point> =>
  testWith<Point>(isPoint, geom, "Point");

const validateMultiPoint = (geom: MultiPoint): Maybe<MultiPoint> =>
  testWith<MultiPoint>(isPointArray, geom, "MultiPoint");

const validateLineString = (geom: LineString): Maybe<LineString> =>
  testWith<LineString>(isPointArray, geom, "LineString");

const validateMultiLineString = (
  geom: MultiLineString
): Maybe<MultiLineString> =>
  testWith<MultiLineString>(isLineArray, geom, "MultiLineString");

const validatePolygon = (geom: Polygon): Maybe<Polygon> =>
  testWith<Polygon>(isLineArray, geom, "Polygon");

const validateMultiPolygon = (geom: MultiPolygon): Maybe<MultiPolygon> =>
  testWith<MultiPolygon>(isPolygonArray, geom, "MultiPolygon").ifNothing(() =>
    console.info(`coordinates: ${geom.coordinates}`)
  );
