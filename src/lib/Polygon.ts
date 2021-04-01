import { Position } from "./Coordinates";
import { isLine } from "./Line";
import { notOnce } from "./Shared";

/** shorthand for last element of array */
const last = <T>(xs: T[]) => xs[xs.length - 1];

/** Integration operator for the area sum -- continuous: ∂x * ∂y => discrete: Δx * Δy */
const dXdY = (prev: Position, curr: Position) =>
  (curr[0] - prev[0]) * (curr[1] + prev[1]);

/**
 * Integrate over dXdY to get the sum of the area. Because of Typescrips array manipulation
 * complexity we have to use Array.pop and integrate "backwards", from upper limit to lower
 * limit --> If the sum is negative, the ring xs performs a left hand rotation (not right).
 *
 * @see: https://en.wikipedia.org/wiki/Greens_theorem
 **/
const integrateArea = (total: number, prev: Position, xs: Position[]): number =>
  xs.length < 1
    ? total
    : total + integrateArea(dXdY(prev, last(xs)), xs.pop()!, xs);

/**
 * Checks whether a ring (closed LineString) has right hand winding number.
 * @see https://tools.ietf.org/html/rfc7946#section-3.1.6
 **/
export const isRightHand = (xs: Position[]): boolean =>
  isClosed(xs) && integrateArea(0, last(xs), xs) < 0;

/** when xs has a left hand winding: issue a warning */
export const warnWindingOrderRing = (xs: Position[]): void => {
  if (!isRightHand(xs)) {
    console.warn("ring with left hand winding order");
  }
};

/** when xs has rings with a left hand winding: issue a warning */
export const warnWindingOrderPolygon = (xs: Position[][]): void => {
  xs.some((x: Position[]) => {
    if (!isRightHand(x)) {
      console.warn("polygon with ring with left hand winding order");
      return true;
    }

    return false;
  });
};

/** A closed line segment is an array of points with p_0 === p_last */
const isClosed = (xs: unknown[][]) =>
  Array.isArray(xs[0]) &&
  Array.isArray(last(xs)) &&
  xs[0][0] === last(xs)[0] &&
  xs[0][1] === last(xs)[1];

/** A linear ring is a closed line segment */
export const isLinearRing = (xs: unknown[][]) =>
  Array.isArray(xs) && xs.length > 3 && isLine(xs) && isClosed(xs);

/** A linear ring array is an array of closed line segments */
export const isLinearRingArray = (xs: unknown[][][]) =>
  Array.isArray(xs) && notOnce(xs, (x) => !isLinearRing(x));

const isDeep = (xs: unknown) => Array.isArray(xs) && Array.isArray(xs[0]);

/** @returns true if 'multiline' is a linear ring array and has the appropriate dimension. **/
export const isPolygon = (polygon: unknown): boolean =>
  isDeep(polygon) && isLinearRingArray(<unknown[][][]>polygon);

/** @returns true if 'multipolygon' is an array of polygon geometries. **/
export const isMultiPolygon = (multipolygon: unknown): boolean =>
  Array.isArray(multipolygon) && notOnce(multipolygon, (x) => !isPolygon(x));
