import { isPoint } from "./Point";
import { notOnce } from "./Shared";

/** @returns true if 'multipoint' is an array of point geometries. **/
export const isMultipoint = (multipoint: unknown): boolean =>
  Array.isArray(multipoint) ? notOnce(multipoint, (x) => !isPoint(x)) : false;

/** @returns true if 'multipoint' is an array of point geometries. **/
export const isLine = (multipoint: unknown): boolean =>
  Array.isArray(multipoint)
    ? multipoint.length >= 1 && notOnce(multipoint, (x) => !isPoint(x))
    : false;

export const isMultiLineString = (multiline: unknown[]): boolean =>
  notOnce(multiline, (x) => !isLine(x));
