import { Maybe } from "purify-ts";
import { FeatureCollection } from "geojson";

import { validateFeatureCollection } from "./FeatureCollection";

const runJsonParser = (content: string) => JSON.parse(content);

/**
 * Attempts to parse and validate the content string as Maybe of a
 * GeoJSON FeatureCollection. Sanity checks are performed on coordinate
 * values and bounding boxes, if they fail the function returns with
 * the associated geometry set to _null_.
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