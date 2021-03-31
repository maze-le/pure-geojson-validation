import { isLine } from "./Line";
import { notOnce } from "./Shared";

/** @returns true if 'multipolygon' is an array of polygon geometries. **/
export const isMultiPolygon = (multipolygon: unknown): boolean =>
  Array.isArray(multipolygon)
    ? notOnce(multipolygon, (x) => !isPolygon(x))
    : false;

/** @returns true if 'multiline' is an array of line geometries. **/
export const isPolygon = (polygon: unknown): boolean =>
  Array.isArray(polygon) ? notOnce(polygon, (x) => !isLine(x)) : false;
