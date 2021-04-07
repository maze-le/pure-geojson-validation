import { Maybe, Nothing } from "purify-ts";
import { Feature, FeatureCollection, Geometry, GeoJsonObject } from "geojson";

import { validateFeatureCollection } from "./FeatureCollection";
import { validateFeature } from "./Feature";
import { validateGeometry } from "./Geometry";
import { record } from "./Shared";

const runJsonParser = (content: string) => JSON.parse(content);

/**
 * Attempts to parse and validate the content string as Maybe of
 * GeoJSON FeatureCollection.
 *
 * Sanity checks are performed on coordinate values, if they fail the
 * function returns with the associated geometry set to _null_.
 * Additional checks are performed on bounding boxes and features, if
 * they fail the function returns Nothing.
 *
 * @param content can either be a feature collection or a string encoded
 * feature collection.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const maybeFeatureCollection = (
  content: unknown
): Maybe<FeatureCollection> =>
  typeof content === "string"
    ? Maybe.encase(() => runJsonParser(content)).chain(
        validateFeatureCollection
      )
    : validateFeatureCollection(content);

/**
 * Attempts to parse and validate the content string as GeoJSON
 * FeatureCollection.
 *
 * Sanity checks are performed on coordinate values,
 * if they fail the function returns with the associated geometry set to
 * _null_. Additional checks are performed on bounding boxes and features.
 * If they fail the function throws an error.
 *
 * @throws {Error} when checks on features or bounding boxes fail.
 *
 * @param content can either be a feature collection or a string encoded
 * feature collection.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const tryFeatureCollection = (content: string): FeatureCollection =>
  maybeFeatureCollection(content).unsafeCoerce();

/**
 * Attempts to parse and validate the content string as Maybe of GeoJSON Feature.
 * Sanity checks are performed on coordinate values, if they fail the function
 * returns with the associated geometry set to _null_. Additional checks are
 * performed on bounding boxes. If they fail the function returns Nothing.
 *
 * @param content can either be a feature object or a string encoded feature object.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const maybeFeature = (content: unknown): Maybe<Feature> =>
  typeof content === "string"
    ? Maybe.encase(() => runJsonParser(content)).chain(validateFeature)
    : validateFeature(content);

/**
 * Attempts to parse and validate the content as GeoJSON Feature.
 *
 * Sanity checks are performed on coordinate values, if they fail the
 * function returns with the associated geometry set to _null_. Additional
 * checks are performed on bounding boxes and features. If they fail the
 * function throws an error.
 *
 * @param content can either be a feature object or a string encoded geojson object.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const tryFeature = (content: unknown): Feature =>
  maybeFeature(content).unsafeCoerce();

/**
 * Attempts to parse and validate the content as Maybe of a GeoJSON Geometry.
 *
 * Sanity checks are performed on coordinate values, if they fail the function
 * returns with _null_. Additional  checks are performed on bounding boxes and
 * features. If they fail the function returns Nothing.
 *
 * @param content can either be a geometry object or a string encoded geometry.
 * @returns {Maybe<Geometry>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const maybeGeometry = (content: unknown): Maybe<Geometry> =>
  typeof content === "string"
    ? Maybe.encase(() => runJsonParser(content)).chain(validateGeometry)
    : validateGeometry(<record>content);

/**
 * Attempts to parse and validate the content string as GeoJSON Geometry.
 *
 * Sanity checks are performed on coordinate values, if they fail the
 * function returns with _null_. Additional checks are performed on
 * bounding boxes and features. If they fail the function throws an
 * error.
 *
 * @throws {Error} when checks bounding boxes fail.
 * @param content can either be a geometry object or a string encoded geometry.
 * @returns {Maybe<Geometry>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const tryGeometry = (content: unknown): Geometry =>
  maybeGeometry(content).unsafeCoerce();

/** Validates an unknown object and eventually returns a GeoJSON object */
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
 * Attempts to parse and validate the content Maybe of a GeoJSON object.
 *
 * Sanity checks are performed on coordinate
 * values, if they fail the function returns with the associated geometry
 * set to _null_. Additional checks are performed on bounding boxes and
 * features. If they fail the function returns Nothing.
 *
 * @param content can either be a geojson object or a string encoded geojson object.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const maybeGeoJSON = (content: unknown): Maybe<GeoJsonObject> =>
  typeof content === "string"
    ? Maybe.encase(() => runJsonParser(content)).chain(validateGeoJSON)
    : validateGeoJSON(content);

/**
 * Attempts to parse and validate the content string as GeoJSON Object.
 *
 * Sanity checks are performed on coordinate values, if they fail the
 * function returns with the associated geometry set to _null_. Additional
 * checks  are performed on bounding boxes and features. If they fail the
 * function throws an error.
 *
 * @throws {Error} when checks on features or bounding boxes fail.
 * @param content can either be a geojson object or a string encoded geojson object.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and validated.
 * @returns {Nothing} otherwise.
 *
 * @see https://tools.ietf.org/html/rfc7946
 * @see https://gigobyte.github.io/purify/adts/Maybe
 */
export const tryGeoJSON = (content: unknown): GeoJsonObject =>
  maybeGeoJSON(content).unsafeCoerce();

export interface PureGeoJSONConfig {
  strictness: "strict" | "loose";
}

export class PureGeoJSON {
  config: PureGeoJSONConfig;
}
