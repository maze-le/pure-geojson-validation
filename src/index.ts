import { record } from "./lib/Shared";
import { BBoxTuple, validateBBox } from "./lib/BBox";
import { validateFeatureCollection } from "./lib/FeatureCollection";
import { validateFeature } from "./lib/Feature";
import { Geom, validateGeometry, geometryTypes } from "./lib/Geometry";

import {
  maybeFeatureCollection,
  tryFeatureCollection,
} from "./lib/PureGeoJson";

import {
  Coordinates,
  Position,
  isLat,
  isLineArray,
  isLon,
  isPoint,
  isPointArray,
  isPolygonArray,
} from "./lib/Coordinates";

export {
  record,
  BBoxTuple,
  Coordinates,
  Position,
  Geom,
  maybeFeatureCollection,
  tryFeatureCollection,
  isLat,
  isLon,
  isPoint,
  isPointArray,
  isLineArray,
  isPolygonArray,
  validateBBox,
  validateFeature,
  validateFeatureCollection,
  validateGeometry,
  geometryTypes,
};
