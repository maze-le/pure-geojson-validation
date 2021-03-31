import { Point } from "geojson";
import { Maybe } from "purify-ts";
import { testWith } from "./Geometry";

/** checks if lon is a number and represents an angle between -90.0° and 90.0° */
export const validatePoint = (point: Point): Maybe<Point> =>
  testWith<Point>(isPoint, point, "Point");

/**
 * Checks whether a given object 'p' represents a GeoJSON Point object.
 * A point is the datatype for a single coordinate, represented by
 * an array with 2 or 3 numbers. The array has the following semantics:
 *
 *  1. entry: latitude -- angle between -180.0 and 180.0
 *  1. entry: longitude -- angle between -90.0 and 90.0
 *  1. (optional) entry: height
 *
 * Further entries (coordinate dimensions) are not invalid, but ignored.
 *
 * @returns true if p is a valid point geometry.
 * @see https://tools.ietf.org/html/rfc7946
 **/
export const isPoint = (p: unknown): boolean =>
  isArray(p) && ofMinLength(<unknown[]>p, 2) && allNumbers(<unknown[]>p)
    ? isLat((<number[]>p)[0]) && isLon((<number[]>p)[1])
    : false;

const isArray = (x: unknown) => Array.isArray(x);
const ofMinLength = (xs: unknown[], len: number) => xs.length >= len;
const allNumbers = (xs: unknown[]): boolean =>
  !xs.some((elem) => typeof elem !== "number");

/** checks if lat is a number and represents an angle between -180.0° and 180.0° */
export const isLat = (lat: number): boolean =>
  typeof lat === "number" && lat >= -180.0 && lat <= 180.0;

/** checks if lon is a number and represents an angle between -90.0° and 90.0° */
export const isLon = (lon: number): boolean =>
  typeof lon === "number" && lon >= -90.0 && lon <= 90.0;
