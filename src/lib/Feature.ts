import { Feature, Geometry } from "geojson";
import { Just, Maybe, Nothing } from "purify-ts";

import { validateBBox } from "./BBox";
import { isRecord, record } from "./Record";
import { validateFeatureGeometry } from "./Geometry";

export const validateFeature = (feat: unknown): Maybe<Feature> => {
  const props = isRecord(feat)
    .chain(validateFeatureProps)
    .ifNothing(() => console.warn("Feature has an invalid property space"))
    .orDefault({});

  return isRecord(feat).chain((f) => asFeature(f, props));
};

const validateFeatureProps = (feat: record): Maybe<record> =>
  Maybe.fromPredicate(() => typeof feat.properties === "object", feat);

const asFeature = (feat: record, props: record): Maybe<Feature> =>
  typeof feat["geometry"] === "object"
    ? Just(feature(props, <record>feat["geometry"], feat.bbox))
    : Nothing;

/** Factory method for features from a propery, geometry and eventual bounding box. */
const feature = (
  props: record,
  geom: record | null,
  bbox?: unknown
): Feature => {
  if (geom === null) console.warn("Feature has a null-geometry");
  const returnFeature: Feature = {
    type: "Feature",
    properties: props,
    geometry: validateFeatureGeometry(geom).orDefault(
      <Geometry>(<unknown>null)
    ),
  };

  const validBbox = validateBBox(bbox);
  if (validBbox.isJust()) {
    returnFeature.bbox = validBbox.orDefault([0, 0, 0, 0]);
  }

  return returnFeature;
};
