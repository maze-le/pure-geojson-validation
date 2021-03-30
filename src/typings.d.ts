import { BBox, Feature, FeatureCollection, GeoJsonGeometryTypes, Geometry, MultiPoint } from "geojson";
import { Maybe } from "purify-ts";

import {
  Coordinates as coords,
  Position as pos,
  record as rec,
  BBoxTuple as bbox,
  Geom as geom,
} from "./index";

declare namespace PureGeojson {
  /** Types */
  type record = rec;
  type BBoxTuple<T> = bbox<T>;
  type Coordinates = coords;
  type Position = pos;
  type Geom = geom;

  /** parser */
  const maybeFeatureCollection: (content: string) => Maybe<FeatureCollection>;
  const tryFeatureCollection: (content: string) => FeatureCollection;

  /** coordinate checks */
  const isLat: (lat: unknown) => boolean;
  const isLon: (lat: unknown) => boolean;
  const isPoint: (lat: unknown) => boolean;
  const isLineArray: (lat: unknown) => boolean;
  const isPointArray: (lat: unknown) => boolean;
  const isPolygonArray: (lat: unknown) => boolean;

  /** validation functions */
  const validateBBox: (bbox: unknown) => Maybe<BBox>;
  const validateFeature: (feat: unknown) => Maybe<Feature>;
  const validateFeatureCollection: (fc: unknown) => Maybe<FeatureCollection>;
  const validateGeometry: (geometry: record | null) => Maybe<Geometry>;

  /** constants */
  const geometryTypes: GeoJsonGeometryTypes[];
}
