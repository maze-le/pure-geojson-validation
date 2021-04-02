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

import { record } from "./Shared";
import { Coordinates } from "./Coordinates";
import {
  isMultiPolygon,
  isPolygon,
  warnWindingOrderPolygon,
  warnWindingOrderMultiPolygon,
} from "./Polygon";
import { isLine, isMultiLineString } from "./Line";
import { isPoint, isMultiPoint } from "./Point";

/** Basic GeoJSON FeatureTypes */
export const geometryTypes: GeoJsonGeometryTypes[] = [
  "Polygon",
  "MultiPolygon",
  "LineString",
  "MultiLineString",
  "Point",
  "MultiPoint",
];

/** Internal geometry representation. */
export type Geom =
  | LineString
  | MultiLineString
  | MultiPoint
  | MultiPolygon
  | Point
  | Polygon;

/**
 * @returns true if geom is a valid geometry
 * @param geom
 */
const isGeometry = (geom: record): boolean =>
  isObject(geom) && hasCoordinates(geom) && hasType(geom)
    ? geometryTypes.includes(<GeoJsonGeometryTypes>geom["type"])
    : false;

/** Geometry predicates */
const isObject = (geom: record) => typeof geom === "object";
const hasCoordinates = (geom: record) => Array.isArray(geom.coordinates);
const hasType = (geom: record) => typeof geom.type === "string";

const isNotNullGeometry = (geometry: record | null): Maybe<record> =>
  Maybe.fromPredicate(() => geometry !== null, <record>geometry);

/**
 * Validates a given record and eventually returns a GeoJSON Geometry object.
 * According to the spec, null values are also valid geometries, but the parser
 * will nevertheless issue a warning.
 *
 * @param geometry a possible geometry record
 */
export const validateGeometry = (geometry: record | null): Maybe<Geometry> => {
  return isNotNullGeometry(geometry)
    .ifNothing(() => console.warn("null geometry found"))
    .caseOf({
      Just: (theGeom) => transformGeometry(theGeom),
      Nothing: () => Just(<Geom>(<unknown>null)),
    });
};

/** Eventually transforms a geometry. */
const transformGeometry = (geom: record): Maybe<Geom> =>
  Maybe.fromPredicate(isGeometry, geom).chain((geom: record) =>
    transformGeometryType(<Geometry>(<unknown>geom))
  );

/** Transforms a geometry depending on the specified type. */
const transformGeometryType = (geom: Geometry): Maybe<Geom> => {
  switch (geom["type"]) {
    case "Point":
      return testWith(isPoint, geom, "Point");

    case "MultiPoint":
      return testWith(isMultiPoint, geom, "MultiPoint");

    case "LineString":
      return testWith(isLine, geom, "LineString");

    case "MultiLineString":
      return testWith(isMultiLineString, geom, "MultiLineString");

    case "Polygon":
      return testWith(isPolygon, geom, "Polygon").ifJust(() =>
        warnWindingOrderPolygon(geom.coordinates)
      );

    case "MultiPolygon":
      return testWith(isMultiPolygon, geom, "MultiPolygon").ifJust(() =>
        warnWindingOrderMultiPolygon(geom.coordinates)
      );

    case "GeometryCollection":
      console.error("GeometryCollection not implemented");
      return Nothing;

    default:
      console.error("invalid geometry type");
      return Nothing;
  }
};

/**
 * Executes 'test' on the coordinates of the geometry 'geom' and maybe turns it in into a GeoJSON
 * geometry.
 *
 * @param test a predicate (function that returns boolean) as found in "src/{Line,Point,Polygon}.ts"
 * @param geom the geometry that should be tested
 * @param geomType the resulting geojson geometry type
 */
const testWith = <T extends Geom>(
  test: (x: Coordinates) => boolean,
  geom: T,
  geomType: GeoJsonGeometryTypes
): Maybe<T> =>
  Maybe.fromPredicate(() => test(geom["coordinates"]), geom["coordinates"])
    .ifNothing(() => console.warn(`Invalid ${geomType} geometry`))
    .chain((coords: Coordinates) => geometry(geomType, coords));

/** Geometry factory */
const geometry = <T extends Geom>(type: string, coordinates: Coordinates) =>
  Just(<T>(<unknown>{ type, coordinates }));
