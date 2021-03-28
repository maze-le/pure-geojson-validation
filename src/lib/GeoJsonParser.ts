import { Maybe, Nothing } from "purify-ts";
import {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

/** Basic GeoJSON FeatureTypes */
const featureTypes = [
  "MultiPolygon",
  "Polygon",
  "MultiLineString",
  "MultiPoint",
  "LineString",
  "Point",
];

// TODO: implement proper GeoJSON parsing
export const parseFeatureCollection = (
  content: string
): Maybe<FeatureCollection> => {
  const parsed: Record<string, unknown> = JSON.parse(content);
  if (parsed.type !== "FeatureCollection") {
    console.error("FeatureCollection type mismatch");
    return Nothing;
  }

  if (typeof parsed.name !== "string") {
    console.warn("FeatureCollection is missing the property: 'name'");
  }

  if (!Array.isArray(parsed.features)) {
    console.error("FeatureCollection is missing the array: 'features'");
    return Nothing;
  }

  if (!validateFeatures(parsed.features)) {
    return Nothing;
  }

  return Maybe.of(<FeatureCollection>(<unknown>parsed));
};

const notOnce = <T>(array: T[], f: (x: T) => boolean) => !array.some(f);

type record = Record<string, unknown>;

const validateFeatures = (feats: unknown[]): boolean =>
  notOnce(feats, (f) => validateFeature(f).isNothing());

const validateFeature = (feat: unknown): Maybe<Feature> => {
  if (typeof feat !== "object") {
    return Nothing;
  }

  const validFeature = validateFeatureType(<record>feat);

  return validFeature
    .chain(validateFeatureProps)
    .chain(validateFeatureGeomType)
    .chain(validateFeatureCoordinates)
    .ifNothing(() => console.error("Invalid feature"));
};

const validateFeatureProps = (feat: record): Maybe<Feature> =>
  Maybe.fromPredicate(
    (f) => typeof f.properties === "object",
    <Feature>(<unknown>feat)
  );

const validateFeatureType = (feat: record): Maybe<record> =>
  Maybe.fromPredicate((f) => f.type === "Feature", feat);

const validateFeatureGeomType = (feat: Feature): Maybe<Feature> =>
  Maybe.fromPredicate((f) => featureTypes.includes(f.geometry.type), feat);

const hasCoordinates = (point: Point) =>
  point.coordinates && Array.isArray(point.coordinates);

const validatePointCoords = (point: Point, feat: Feature): Maybe<Feature> =>
  Maybe.fromPredicate(() => hasCoordinates(point), feat)
    .chain((f) => Maybe.fromPredicate(() => isPosition(point.coordinates), f))
    .ifNothing(() => console.error("Invalid POINT feature"));

const validateFeatureCoordinates = (feat: Feature): Maybe<Feature> => {
  switch (feat.geometry.type) {
    case "Point":
      return validatePointCoords(feat.geometry, feat);

    case "MultiPoint":
      return Maybe.fromPredicate(
        (f) => isPositionArray((<MultiPoint>f.geometry).coordinates),
        feat
      );

    case "LineString":
      return Maybe.fromPredicate(
        (f) => isPositionArray((<LineString>f.geometry).coordinates),
        feat
      );

    case "MultiLineString":
      return Maybe.fromPredicate(
        (f) => isLineArray((<MultiLineString>f.geometry).coordinates),
        feat
      );

    case "Polygon":
      return Maybe.fromPredicate(
        (f) => isLineArray((<Polygon>f.geometry).coordinates),
        feat
      );

    case "MultiPolygon":
      return Maybe.fromPredicate(
        (f) => isPolygonArray((<MultiPolygon>f.geometry).coordinates),
        feat
      );

    case "GeometryCollection":
      console.warn("GeometryCollection parser not implemented.");
      return Nothing;

    default:
      console.error("invalid geometry type");
      return Nothing;
  }
};

/** @returns true if pointTensor is an array of polygon geometries. **/
const isPolygonArray = (multipolygon: unknown): boolean => {
  if (!Array.isArray(multipolygon)) {
    return false;
  }

  return notOnce(multipolygon, (x) => !isLineArray(x));
};

/** @returns true if pointMatrix is an array of line geometries. **/
const isLineArray = (multiline: unknown): boolean => {
  if (!Array.isArray(multiline)) {
    return false;
  }

  return notOnce(multiline, (x) => !isPositionArray(x));
};

/** @returns true of pointArray is an array of position geometries. **/
const isPositionArray = (multipoint: unknown): boolean => {
  if (!Array.isArray(multipoint)) {
    return false;
  }

  return notOnce(multipoint, (x) => !isPosition(x));
};

/**
 * Validates position geometries. A position is an array of 2 or 3 numbers with the following semantics:
 *
 *  * 1. entry: latitude -- angle between -180.0 and 180.0
 *  * 2. entry: longitude -- angle between -90.0 and 90.0
 *  * 3. (optional) entry: height
 *
 * @returns true if position is a valid position geometry.
 **/
const isPosition = (position: unknown): boolean => {
  if (!Array.isArray(position)) {
    return false;
  }

  if (position.length > 3 || position.length < 2) {
    return false;
  }

  if (position.some((y) => typeof y !== "number")) {
    return false;
  }

  const isCoordinatePair =
    isCoordinateLat(position[0]) && isCoordinateLon(position[1]);

  return position.length === 2
    ? isCoordinatePair
    : isCoordinatePair && isCoordinateHeight(position[2]);
};

const isCoordinateLat = (lat: unknown): boolean =>
  typeof lat === "number" && lat >= -180.0 && lat <= 180.0;

const isCoordinateLon = (lon: unknown): boolean =>
  typeof lon === "number" && lon >= -90.0 && lon <= 90.0;

const isCoordinateHeight = (h: unknown): boolean => typeof h === "number";
