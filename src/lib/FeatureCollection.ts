import { Just, Maybe, Nothing } from "purify-ts";
import { Feature, FeatureCollection } from "geojson";

import { validateBBox } from "./BBox";
import { validateFeature } from "./Feature";

import { isDefined, isRecord, record } from "./Shared";

const hasFcType = (featureCollection: record) =>
  Maybe.fromPredicate(
    (x) => x["type"] === "FeatureCollection",
    featureCollection
  ).ifNothing(() => console.error("FeatureCollection type mismatch"));

const hasFeatureArray = (x: record) =>
  Maybe.fromPredicate(() => Array.isArray(x.features), <FeatureCollection>{
    features: x.features,
    type: "FeatureCollection",
  });

/**
 * Checks if a feature collection has an valid feature array with valid members.
 * @returns eventually Just the Feature collection if it's valid, Nothing otheriwse.
 **/
const checkFeatures = (x: FeatureCollection): Maybe<FeatureCollection> => {
  const validFeatures = validateFeatures(x.features);
  if (validFeatures.isNothing()) {
    return Nothing;
  }

  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: validFeatures.unsafeCoerce(),
  };

  const boundingBox = validateBBox(x.bbox);
  if (boundingBox.isJust()) {
    featureCollection.bbox = boundingBox.orDefault([0, 0, 0, 0]);
  }

  return Just(featureCollection);
};

/** @returns Just(Features) if all features in collection are valid. */
const validateFeatures = (collection: unknown[]): Maybe<Array<Feature>> => {
  const features: Array<Feature> = [];
  const allFeaturesValid = collection.every((feature: unknown) => {
    const validated = validateFeature(feature);
    if (validated.isNothing()) {
      console.error("invalid Feature");
      return false;
    } else {
      features.push(validated.orDefault({} as Feature));
      return true;
    }
  });

  return allFeaturesValid ? Just(features) : Nothing;
};

/**
 * @param fc an eventual feature collection.
 * @returns {Maybe<FeatureCollection>} if it can be parsed and checked.
 * @returns {Nothing} otherwise.
 */
export const validateFeatureCollection = (
  fc: unknown
): Maybe<FeatureCollection> => {
  return isDefined(fc)
    .chain(isRecord)
    .chain(hasFcType)
    .chain(hasFeatureArray)
    .chain(checkFeatures);
};
