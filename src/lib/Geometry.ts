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
 * Executes 'test' on the coordinates of the geometry 'geom' and maybe turns it in into a GeoJSON
 * geometry.
 *
 * @param test a predicate (function that returns boolean) as found in "src/{Line,Point,Polygon}.ts"
 * @param geom the geometry that should be tested
 * @param geomType the resulting geojson geometry type
 */
export const testWith = <T>(
  test: (x: Coordinates) => boolean,
  geom: Geom,
  geomType: GeoJsonGeometryTypes
): Maybe<T> =>
  Maybe.fromPredicate(() => test(geom["coordinates"]), geom["coordinates"])
    .ifNothing(() => console.warn(`Invalid ${geomType} geometry`))
    .chain((coords: Coordinates) => geometry(geomType, coords));

/** Geometry factory */
const geometry = <T>(type: string, coordinates: Coordinates) =>
  Just(<T>(<unknown>{ type, coordinates }));

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
      return testWith<Point>(isPoint, geom, "Point");

    case "MultiPoint":
      return testWith<MultiPoint>(isMultiPoint, geom, "MultiPoint");

    case "LineString":
      return testWith<MultiLineString>(isLine, geom, "LineString");

    case "MultiLineString":
      return testWith<MultiPoint>(isMultiLineString, geom, "MultiLineString");

    case "Polygon":
      return testWith<Polygon>(isPolygon, geom, "Polygon").ifJust(() =>
        warnWindingOrderPolygon(geom.coordinates)
      );

    case "MultiPolygon":
      return testWith<MultiPolygon>(
        isMultiPolygon,
        geom,
        "MultiPolygon"
      ).ifJust(() => warnWindingOrderMultiPolygon(geom.coordinates));

    case "GeometryCollection":
      console.error("GeometryCollection not implemented");
      return Nothing;

    default:
      console.error("invalid geometry type");
      return Nothing;
  }
};
