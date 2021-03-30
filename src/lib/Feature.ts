import { Feature, Geometry } from "geojson";
import { Just, Maybe, Nothing } from "purify-ts";

import { validateBBox } from "./BBox";
import { validateGeometry } from "./Geometry";
import { isRecord, record } from "./Shared";

/**
 * Checks if a given feature is valid and has sane coordinate values.
 * If a geometry fails sanity cheks on the coordinate space a null-geometry
 * is created and a warning is issued.
 *
 * @param feat an eventual feature
 */
export const validateFeature = (feat: unknown): Maybe<Feature> => {
  const props = isRecord(feat)
    .chain(validateFeatureProps)
    .ifNothing(() => console.warn("Feature has an invalid property space"))
    .orDefault({});

  return isRecord(feat).chain((f) =>
    asFeature(f, isRecord(props).orDefault({}))
  );
};

const validateFeatureProps = (feat: record): Maybe<unknown> =>
  Maybe.fromPredicate(
    () => typeof feat.properties === "object",
    feat.properties
  );

const asFeature = (feat: record, props: record): Maybe<Feature> =>
  typeof feat["geometry"] === "object"
    ? Just(feature(props, <record>feat["geometry"], feat.bbox))
    : Nothing;

/** Factory method for features from a property, geometry and eventual bounding box. */
const feature = (
  props: record,
  geom: record | null,
  bbox?: unknown
): Feature => {
  if (geom === null) console.warn("Feature has a null-geometry");
  const returnFeature: Feature = {
    type: "Feature",
    properties: props,
    geometry: validateGeometry(geom).orDefault(
      <Geometry>(<unknown>null)
    ),
  };

  const validBbox = validateBBox(bbox);
  if (validBbox.isJust()) {
    returnFeature.bbox = validBbox.orDefault([0, 0, 0, 0]);
  }

  return returnFeature;
};
