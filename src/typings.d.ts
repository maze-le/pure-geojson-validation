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

declare type record = rec;
declare type BBox = geojsonBBox;
declare type Coordinates = coords;
declare type Position = geojsonPosition;
declare type Geom = geom;

/** constants */
declare const geometryTypes: GeoJsonGeometryTypes[];

/** parser */
declare function maybeFeatureCollection(
  content: string
): Maybe<FeatureCollection>;
declare function tryFeatureCollection(content: string): FeatureCollection;

/** coordinate checks */
declare function isLat(lat: unknown): boolean;
declare function isLon(lon: unknown): boolean;
declare function isPoint(point: unknown): boolean;
declare function isPointArray(multipoint: unknown): boolean;
declare function isLineArray(multiline: unknown): boolean;
declare function isPolygonArray(multipolygon: unknown): boolean;

/** validation functions */
declare function validateBBox(bbox: unknown): Maybe<BBox>;
declare function validateFeature(feat: unknown): Maybe<Feature>;
declare function validateFeatureCollection(
  fc: unknown
): Maybe<FeatureCollection>;
declare function validateGeometry(geometry: record | null): Maybe<Geometry>;
