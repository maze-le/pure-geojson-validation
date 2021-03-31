import { BBox } from "geojson";

import { record } from "./lib/Shared";
import { validateBBox } from "./lib/BBox";
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
  BBox,
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
  /**
   * A bounding box is geographic 'fence' around a feature or geometry. It is
   * valid when it is a numbered array with 4 or 6 coordinate values. The
   * coordinates run from the southwesterly point to the northeasterly point.
   *
   * Lat coordinate values must be between -180° and 180°.
   * Lon coordinate values must be between -90° and 90°.
   * The 2 other numbers in the array represent 3D Bounding Boxes and are not checked.
   *
   *     [SW_Lat, SW_Lon, NE_Lat, NE_Lon, ...]
   *
   * @returns Just(BBox) if bbox is a valid bounding box.
   * @returns Nothing if bbox is invalid.
   * @see https://tools.ietf.org/html/rfc7946
   **/
  validateBBox,
  validateFeature,
  validateFeatureCollection,
  validateGeometry,
  geometryTypes,
};
