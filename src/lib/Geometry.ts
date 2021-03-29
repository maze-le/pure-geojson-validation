import { Just, Maybe, Nothing } from "purify-ts";
import { Geometry, Point, Position } from "geojson";

import { isPoint } from "./Coordinates";
import { record } from "./Record";

/** Basic GeoJSON FeatureTypes */
export const geometryTypes = [
  "MultiPolygon",
  "Polygon",
  "MultiLineString",
  "MultiPoint",
  "LineString",
  "Point",
];

export const validateFeatureGeometry = (feat: record): Maybe<Geometry> => {
  if (!featureHasGeometry(feat)) {
    return Nothing;
  }

  const geom = validateGeometry(<record>feat["geometry"]).orDefault(
    {} as Geometry
  );

  switch (geom["type"]) {
    case "Point":
      return validatePoint(geom);

    default:
      return Nothing;
  }
};

const validateGeometry = (geom: record): Maybe<Geometry> =>
  Maybe.fromPredicate(() => featureHasGeometry(geom), geom).chain((geom) =>
    Just(<Geometry>(<unknown>geom))
  );

const featureHasGeometry = (geom: record): boolean => {
  if (geom === null) {
    return true;
  }

  if (typeof geom["type"] === "string") {
    return geometryTypes.includes(geom["type"]);
  }

  return false;
};

const validatePoint = (geom: Geometry): Maybe<Point> =>
  Maybe.fromPredicate(() => isPoint(geom), geom["coordinates"])
    .ifNothing(() => console.error("Invalid POINT feature"))
    .chain((coords: Position) =>
      Just(<Point>{ type: "Point", coordinates: coords })
    );
