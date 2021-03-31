import {
  BBox as geojsonBBox,
  Feature,
  FeatureCollection,
  GeoJsonGeometryTypes,
  Geometry,
  Position as geojsonPosition,
} from "geojson";
import { Maybe } from "purify-ts";

import {
  Coordinates as coords,
  Position as pos,
  record as rec,
  Geom as geom,
} from "./index";

/** Shorthand type for objects with entries of unknown value. */
declare type record = rec;

/** GeoJSON BBox */
declare type BBox = geojsonBBox;

/** GeoJSON Coordinate space */
declare type Coordinates = coords;

/** GeoJSON Position / Point Coordinate */
declare type Position = geojsonPosition;

/** Gemoetry */
declare type Geom = geom;

/** constants */

/** Basic GeoJSON GeometryTypes as array of GeoJsonGeometryTypes */
declare const geometryTypes: GeoJsonGeometryTypes[];

/**
 * Attempts to parse and validate the content string as Maybe of a
 * GeoJSON FeatureCollection. Sanity checks are performed on coordinate
 * values, if they fail the function returns with the associated geometry
 * set to _null_. Additional checks are performed on bounding boxes and
 * features. If they fail the function returns Nothing.
 *
 * @param content the input that is be parsed and validated.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
declare function maybeFeatureCollection(
  content: string
): Maybe<FeatureCollection>;

/**
 * Attempts to parse and validate the content string as GeoJSON
 * FeatureCollection. Sanity checks are performed on coordinate values,
 * if they fail the function returns with the associated geometry set to
 * _null_. Additional checks are performed on bounding boxes and features.
 * If they fail the function throws an error.
 *
 * @throws {Error} when checks on features or bounding boxes fail.
 * @param content the input that is be parsed and validated.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
declare function tryFeatureCollection(content: string): FeatureCollection;

/** Checks if lat is a number and represents an angle between -180.0° and 180.0° */
declare function isLat(lat: unknown): boolean;

/** Checks if lon is a number and represents an angle between -90.0° and 90.0° */
declare function isLon(lon: unknown): boolean;

/**
 * Checks whether a given object 'p' represents a GeoJSON Point object.
 * A point is the datatype for a single coordinate, represented by
 * an array with 2 or 3 numbers. The array has the following semantics:
 *
 *  1. entry: latitude -- angle between -180.0 and 180.0
 *  1. entry: longitude -- angle between -90.0 and 90.0
 *  1. (optional) entry: height
 *
 * Further entries (coordinate dimensions) are not invalid, but ignored.
 *
 * @returns true if p is a valid point geometry.
 * @see https://tools.ietf.org/html/rfc7946
 **/
declare function isPoint(point: unknown): boolean;

/** @returns true if 'multipoint' is an array of point geometries. **/
declare function isPointArray(multipoint: unknown): boolean;

/** @returns true if 'multiline' is an array of line geometries. **/
declare function isLineArray(multiline: unknown): boolean;

/** @returns true if 'multipolygon' is an array of polygon geometries. **/
declare function isPolygonArray(multipolygon: unknown): boolean;

/**
 * Validates bounding boxes.
 *
 * A bounding box is geographic 'fence' around a feature or geometry. It is
 * valid when it is a numbered array with 4 or 6 coordinate values. The
 * coordinates run from the southwesterly point to the northeasterly point.
 *
 * Lat coordinate values must be between -180° and 180°.
 * Lon coordinate values must be between -90° and 90°.
 * The 2 other numbers in the array represent 3D Bounding Boxes and are not checked.
 *
 *     [SW_Lat, SW_Lon, NE_Lat, NE_Lon, ...]
 *
 * @returns Just(BBox) if bbox is a valid bounding box.
 * @returns Nothing if bbox is invalid.
 * @see https://tools.ietf.org/html/rfc7946
 **/
declare function validateBBox(bbox: unknown): Maybe<BBox>;

/**
 * Checks if a given feature is valid and has sane coordinate values.
 * If a geometry fails sanity cheks on the coordinate space a null-geometry
 * is created and a warning is issued.
 *
 * @param feat an eventual feature
 */
declare function validateFeature(feat: unknown): Maybe<Feature>;

/**
 * Checks if a given feature collection is valid and has sane coordinate values.
 * If a geometry fails sanity cheks on the coordinate space a null-geometry
 * is created and a warning is issued.
 *
 * @param fc an eventual feature collection.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and checked.
 * @returns {Nothing} otherwise.
 */
declare function validateFeatureCollection(
  fc: unknown
): Maybe<FeatureCollection>;

/**
 * Validates a given record and eventually returns a GeoJSON Geometry object.
 * According to the spec, null values are also valid geometries, but the parser
 * will nevertheless issue a warning.
 *
 * @param geometry a possible geometry record
 */
declare function validateGeometry(geometry: record | null): Maybe<Geometry>;
