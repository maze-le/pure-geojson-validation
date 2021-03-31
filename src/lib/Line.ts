import { LineString, MultiPoint } from "geojson";
import { Maybe } from "purify-ts";

import { testWith } from "./Geometry";
import { isPoint } from "./Point";
import { notOnce } from "./Shared";

export const validateMultiPoint = (geom: MultiPoint): Maybe<MultiPoint> =>
  testWith<MultiPoint>(isMultipoint, geom, "MultiPoint");

  /** @returns true if 'multipoint' is an array of point geometries. **/
  export const isMultipoint = (multipoint: unknown): boolean =>
    Array.isArray(multipoint) ? notOnce(multipoint, (x) => !isPoint(x)) : false;

export const validateLineString = (geom: LineString): Maybe<LineString> =>
  testWith<LineString>(isLine, geom, "LineString");

/** @returns true if 'multipoint' is an array of point geometries. **/
export const isLine = (multipoint: unknown): boolean =>
  Array.isArray(multipoint) ? notOnce(multipoint, (x) => !isPoint(x)) : false;
