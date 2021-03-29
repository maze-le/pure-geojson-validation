import { Maybe } from "purify-ts";
import { FeatureCollection } from "geojson";

import { validateFeatureCollection } from "./FeatureCollection";

const runJsonParser = (content: string) => JSON.parse(content);

/**
 * Attempts to parse and validate the content string as GeoJSON Feature Collection.
 * 
 * @param content the input that is shall be parsed.
 * @returns Nothing if it cannot be parsed or validated.
 * @returns Just(FeatureCollection) if it can be parsed.
 */
export const parseFeatureCollection = (
  content: string
): Maybe<FeatureCollection> =>
  Maybe.encase(runJsonParser(content)).chain(validateFeatureCollection);
