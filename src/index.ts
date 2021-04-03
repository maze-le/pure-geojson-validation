import { BBox } from "geojson";

import { record } from "./lib/Shared";
import { validateBBox } from "./lib/BBox";
import { validateFeatureCollection } from "./lib/FeatureCollection";
import { validateFeature } from "./lib/Feature";
import { Geom, validateGeometry, geometryTypes } from "./lib/Geometry";

import {
  maybeFeatureCollection,
  tryFeatureCollection,
  maybeFeature,
  tryFeature,
  maybeGeoJSON,
  tryGeoJSON,
  maybeGeometry,
  tryGeometry,
} from "./lib/PureGeoJson";

import { Coordinates, Position } from "./lib/Coordinates";
import { isLat, isLon, isPoint, isMultiPoint } from "./lib/Point";
import { isLine as isLineString, isMultiLineString } from "./lib/Line";
import {
  isRightHand,
  isMultiPolygon,
  isPolygon,
  isLinearRing,
  isLinearRingArray,
} from "./lib/Polygon";

export {
  /** Shorthand type for objects with entries of unknown value. */
  record,
  /** GeoJSON BBox */
  BBox,
  /** GeoJSON Coordinate space */
  Coordinates,
  /** GeoJSON Position / Point Coordinate */
  Position,
  /** Gemoetry */
  Geom,
  /** Basic GeoJSON GeometryTypes as array of GeoJsonGeometryTypes */
  geometryTypes,
  /**
   * Attempts to parse and validate the content string as Maybe of a
   * GeoJSON FeatureCollection. Sanity checks are performed on coordinate
   * values, if they fail the function returns with the associated geometry
   * set to _null_. Additional checks are performed on bounding boxes and
   * features. If they fail the function returns Nothing.
   *
   * @param content the sting input.
   * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
   * @returns {Nothing} otherwise.
   *
   * @see https://tools.ietf.org/html/rfc7946
   * @see https://gigobyte.github.io/purify/adts/Maybe
   */
  maybeFeatureCollection,
  /**
   * Attempts to parse and validate the content string as GeoJSON
   * FeatureCollection. Sanity checks are performed on coordinate values,
   * if they fail the function returns with the associated geometry set to
   * _null_. Additional checks are performed on bounding boxes and features.
   * If they fail the function throws an error.
   *
   * @throws {Error} when checks on features or bounding boxes fail.
   * @param content the sting input.
   * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
   * @returns {Nothing} otherwise.
   *
   * @see https://tools.ietf.org/html/rfc7946
   * @see https://gigobyte.github.io/purify/adts/Maybe
   */
  tryFeatureCollection,
  /**
   * Attempts to parse and validate the content string as Maybe of
   * GeoJSON Feature. Sanity checks are performed on coordinate
   * values, if they fail the function returns with the associated geometry
   * set to _null_. Additional checks are performed on bounding boxes and
   * features. If they fail the function returns Nothing.
   *
   * @param content a possible GeoJSON string
   * @returns {Maybe<Feature>} if it can be parsed and validated.
   * @returns {Nothing} otherwise.
   *
   * @see https://tools.ietf.org/html/rfc7946
   * @see https://gigobyte.github.io/purify/adts/Maybe
   */
  maybeFeature,
  /**
   * Attempts to parse and validate the content string as GeoJSON Feature.
   * Sanity checks are performed on coordinate values, if they fail the
   * function returns with the associated geometry set to _null_. Additional
   * checks are performed on bounding boxes and features. If they fail the
   * function throws an error.
   *
   * @throws {Error} when checks on features or bounding boxes fail.
   * @param content the sting input.
   * @returns {Maybe<Feature>} if it can be parsed and validated.
   * @returns {Nothing} otherwise.
   *
   * @see https://tools.ietf.org/html/rfc7946
   * @see https://gigobyte.github.io/purify/adts/Maybe
   */
  tryFeature,
  /**
   * Attempts to parse and validate the content string as Maybe of
   * GeoJSON object. Sanity checks are performed on coordinate
   * values, if they fail the function returns with the associated geometry
   * set to _null_. Additional checks are performed on bounding boxes and
   * features. If they fail the function returns Nothing.
   *
   * @param content the sting input.
   * @returns {Maybe<Feature>} if it can be parsed and validated.
   * @returns {Nothing} otherwise.
   *
   * @see https://tools.ietf.org/html/rfc7946
   * @see https://gigobyte.github.io/purify/adts/Maybe
   */
  maybeGeoJSON,
  /**
   * Attempts to parse and validate the content string as GeoJSON Object.
   * Sanity checks are performed on coordinate values, if they fail the
   * function returns with the associated geometry set to _null_. Additional
   * checks  are performed on bounding boxes and features. If they fail the
   * function throws an error.
   *
   * @throws {Error} when checks on features or bounding boxes fail.
   * @param content the input that is be parsed and validated.
   * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
   * @returns {Nothing} otherwise.
   *
   * @see https://tools.ietf.org/html/rfc7946
   * @see https://gigobyte.github.io/purify/adts/Maybe
   */
  tryGeoJSON,
  /**
   * Attempts to parse and validate the content string as Maybe of
   * GeoJSON Geometry. Sanity checks are performed on coordinate values, if
   * they  fail the function returns with _null_. Additional  checks are
   * performed on  bounding boxes and features. If they fail the function
   * returns Nothing.
   *
   * @param content a possible GeoJSON string
   * @returns {Maybe<Geometry>} if it can be parsed and validated.
   * @returns {Nothing} otherwise.
   *
   * @see https://tools.ietf.org/html/rfc7946
   * @see https://gigobyte.github.io/purify/adts/Maybe
   */
  maybeGeometry,
  /**
   * Attempts to parse and validate the content string as GeoJSON Geometry.
   * Sanity checks are performed on coordinate values, if they fail the
   * function returns with _null_. Additional checks are performed on
   * bounding boxes and features. If they fail the function throws an
   * error.
   *
   * @throws {Error} when checks on features or bounding boxes fail.
   * @param content the input that is be parsed and validated.
   * @returns {Maybe<Geometry>} if it can be parsed and validated.
   * @returns {Nothing} otherwise.
   *
   * @see https://tools.ietf.org/html/rfc7946
   * @see https://gigobyte.github.io/purify/adts/Maybe
   */
  tryGeometry,
  /** Checks if lat is a number and represents an angle between -180.0° and 180.0° */
  isLat,
  /** Checks if lon is a number and represents an angle between -90.0° and 90.0° */
  isLon,
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
  isPoint,
  /** @returns true if 'multipoint' is an array of point geometries. **/
  isMultiPoint,
  /** @returns true if 'line' is a valid line geometry. **/
  isLineString,
  /** @returns true if 'multiline' is an array of line geometries. **/
  isMultiLineString,
  /** @returns true if 'polygon' is a valid polygon geometry. **/
  isPolygon,
  /** @returns true if 'multipolygon' is an array of polygon geometries. **/
  isMultiPolygon,
  /**
   * Checks whether a ring (closed LineString) has right hand winding number.
   * @see https://tools.ietf.org/html/rfc7946#section-3.1.6
   **/
  isRightHand,
  /** @returns true if xs is an array of closed line segments */
  isLinearRing,
  /** @returns true if xs is an array of linear rings */
  isLinearRingArray,
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
  validateBBox,
  /**
   * Checks if a given feature is valid and has sane coordinate values.
   * If a geometry fails sanity cheks on the coordinate space a null-geometry
   * is created and a warning is issued.
   *
   * @param feat an eventual feature
   */
  validateFeature,
  /**
   * Checks if a given feature collection is valid and has sane coordinate values.
   * If a geometry fails sanity cheks on the coordinate space a null-geometry
   * is created and a warning is issued.
   *
   * @param fc an eventual feature collection.
   * @returns {Maybe<FeatureCollection>} if it can be parsed and checked.
   * @returns {Nothing} otherwise.
   */
  validateFeatureCollection,
  /**
   * Validates a given record and eventually returns a GeoJSON Geometry object.
   * According to the spec, null values are also valid geometries, but the parser
   * will nevertheless issue a warning.
   *
   * @param geometry a possible geometry record
   */
  validateGeometry,
};
