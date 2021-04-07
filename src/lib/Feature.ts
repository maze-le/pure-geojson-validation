import { BBox, Feature, Geometry } from "geojson";
import { Maybe } from "purify-ts";

import { validateBBox } from "./BBox";
import { validateGeometry } from "./Geometry";
import { isRecord, record } from "./Shared";

const getProps = (feat: record): Maybe<unknown> =>
  Maybe.fromPredicate(
    () => typeof feat.properties === "object",
    feat.properties
  );

const hasType = (feat: record): Maybe<record> =>
  Maybe.fromPredicate((f) => f.type === "Feature", feat);

/**
 * Checks if a given feature is valid and has sane coordinate values.
 * If a sanity cheks fails on the coordinate space, a null-geometry
 * is created and a warning is issued.
 *
 * @param feat an eventual feature
 */
export const validateFeature = (feat: unknown): Maybe<Feature> => {
  const props = isRecord(feat)
    .chain(getProps)
    .ifNothing(() => console.warn("Feature has an invalid property space"))
    .orDefault({});

  return isRecord(feat)
    .chain(hasType)
    .chain((f) => asFeature(f, <record>props));
};

const asFeature = (feat: record, props: record): Maybe<Feature> =>
  Maybe.fromPredicate(
    () => typeof feat["geometry"] === "object",
    feature(
      props,
      validateGeometry(<record>feat["geometry"]).orDefault(
        <Geometry>(<unknown>null)
      ),
      feat.bbox
    )
  );

/** Factory method for features from a property, geometry and eventual bounding box. */
const feature = (props: record, geom: Geometry, bbox?: unknown): Feature =>
  validateBBox(bbox).caseOf({
    Just: (b: BBox) => withBBox(props, geom, b),
    Nothing: () => withoutBBox(props, geom),
  });

/** Features with bounding box. */
const withBBox = (props: record, geom: Geometry, bbox: BBox): Feature => ({
  bbox: bbox,
  type: "Feature",
  properties: props,
  geometry: geom,
});

/** Features without bounding box. */
const withoutBBox = (props: record, geom: Geometry): Feature => ({
  type: "Feature",
  properties: props,
  geometry: geom,
});
