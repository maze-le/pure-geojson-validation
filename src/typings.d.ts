import {
  BBox as geojsonBBox,
  Feature,
  FeatureCollection,
  GeoJsonGeometryTypes,
  Geometry,
  Position as geojsonPosition,
} from "geojson";
import { Maybe } from "purify-ts";

import {
  Coordinates as coords,
  Position as pos,
  record as rec,
  Geom as geom,
} from "./index";

declare namespace PureGeojson {
  /** Types */
  type record = rec;
  type BBox = geojsonBBox;
  type Coordinates = coords;
  type Position = geojsonPosition;
  type Geom = geom;

  /** constants */
  const geometryTypes: GeoJsonGeometryTypes[];

  /** parser */
  function maybeFeatureCollection(content: string): Maybe<FeatureCollection>;
  function tryFeatureCollection(content: string): FeatureCollection;

  /** coordinate checks */
  function isLat(lat: unknown): boolean;
  function isLon(lon: unknown): boolean;
  function isPoint(point: unknown): boolean;
  function isPointArray(multipoint: unknown): boolean;
  function isLineArray(multiline: unknown): boolean;
  function isPolygonArray(multipolygon: unknown): boolean;

  /** validation functions */
  function validateBBox(bbox: unknown): Maybe<BBox>;
  function validateFeature(feat: unknown): Maybe<Feature>;
  function validateFeatureCollection(fc: unknown): Maybe<FeatureCollection>;
  function validateGeometry(geometry: record | null): Maybe<Geometry>;
}
