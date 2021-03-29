import { Maybe } from "purify-ts";
import { FeatureCollection } from "geojson";

import { validateFeatureCollection } from "./FeatureCollection";

const runJsonParser = (content: string) => JSON.parse(content);

/**
 * Attempts to parse and validate the content string as GeoJSON Feature Collection.
 * Sanity checks are performed on coordinate values and bounding boxes, if they fail
 * the function returns Nothing.
 *
 * @param content the input that is shall be parsed and validated.
 * @returns {Nothing} if it cannot be parsed or validated.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and checked.
 */
export const parseFeatureCollection = (
  content: string
): Maybe<FeatureCollection> =>
  Maybe.encase(runJsonParser(content)).chain(validateFeatureCollection);
