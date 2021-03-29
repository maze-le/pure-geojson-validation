import { Feature, Geometry } from "geojson";
import { Just, Maybe, Nothing } from "purify-ts";

import { isRecord, record } from "./Record";
import { validateFeatureGeometry } from "./Geometry";

export const validateFeature = (feat: unknown): Maybe<Feature> => {
  const props = isRecord(feat)
    .chain(validateFeatureProps)
    .ifNothing(() => console.warn("Feature has an invalid property space"));

  return asFeature(<record>feat, props);
};

const validateFeatureProps = (feat: record): Maybe<record> =>
  Maybe.fromPredicate(() => typeof feat.properties === "object", feat);

const asFeature = (feat: record, props: Maybe<record>): Maybe<Feature> =>
  typeof feat["geometry"] === "object"
    ? Just(featureFactory(props, <record>feat["geometry"]))
    : Nothing;

const featureFactory = (props: Maybe<record>, geom: record | null): Feature => {
  if (geom === null) console.warn("Feature has a null-geometry");

  return {
    type: "Feature",
    properties: props.orDefault({}),
    geometry:
      geom !== null
        ? validateFeatureGeometry(geom).orDefault(<Geometry>{})
        : <Geometry>(<unknown>null),
  };
};
