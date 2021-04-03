import { Maybe, Nothing } from "purify-ts";
import { Feature, FeatureCollection, Geometry, GeoJsonObject } from "geojson";

import { validateFeatureCollection } from "./FeatureCollection";
import { validateFeature } from "./Feature";
import { validateGeometry } from "./Geometry";
import { record } from "./Shared";

const runJsonParser = (content: string) => JSON.parse(content);

/**
 * Attempts to parse and validate the content string as Maybe of
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
export const maybeFeatureCollection = (
  content: string
): Maybe<FeatureCollection> =>
  Maybe.encase(() => runJsonParser(content)).chain(validateFeatureCollection);

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
export const tryFeatureCollection = (content: string): FeatureCollection =>
  maybeFeatureCollection(content).unsafeCoerce();

/**
 * Attempts to parse and validate the content string as Maybe of
 * GeoJSON Feature. Sanity checks are performed on coordinate
 * values, if they fail the function returns with the associated geometry
 * set to _null_. Additional checks are performed on bounding boxes and
 * features. If they fail the function returns Nothing.
 *
 * @param content a possible GeoJSON string
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const maybeFeature = (content: string): Maybe<Feature> =>
  Maybe.encase(() => runJsonParser(content)).chain(validateFeature);

/**
 * Attempts to parse and validate the content string as GeoJSON Feature.
 * Sanity checks are performed on coordinate values, if they fail the
 * function returns with the associated geometry set to _null_. Additional
 * checks are performed on bounding boxes and features. If they fail the
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
export const tryFeature = (content: string): Feature =>
  maybeFeature(content).unsafeCoerce();

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
export const maybeGeometry = (content: string): Maybe<Geometry> =>
  Maybe.encase(() => runJsonParser(content)).chain(validateGeometry);

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
export const tryGeometry = (content: string): Geometry =>
  maybeGeometry(content).unsafeCoerce();

/**
 * Validates an unknown object and eventually returns a GeoJSON object
 * (Geometry, Feature or FeatureCollection).
 *
 * @param geometry a possible geometry record
 */
const validateGeoJSON = (json: unknown): Maybe<GeoJsonObject> => {
  if (typeof json !== "object" || json === null) {
    return Nothing;
  }

  switch (json["type"]) {
    case "Geometry":
      return validateGeometry(<record>json);
    case "Feature":
      return validateFeature(json);
    case "FeatureCollection":
      return validateFeatureCollection(json);
    default:
      return Nothing;
  }
};

/**
 * Attempts to parse and validate the content string as Maybe of
 * GeoJSON object. Sanity checks are performed on coordinate
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
export const maybeGeoJSON = (content: string): Maybe<GeoJsonObject> =>
  Maybe.encase(() => runJsonParser(content)).chain(validateGeoJSON);

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
export const tryGeoJSON = (content: string): GeoJsonObject =>
  maybeGeoJSON(content).unsafeCoerce();
