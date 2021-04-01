import { Position } from "./Coordinates";
import { isLine } from "./Line";
import { notOnce } from "./Shared";

/** Integration operator for the winding order integral. */
const dXdY = (prev: Position, curr: Position) =>
  (curr[0] - prev[0]) * (curr[1] + prev[1]);

/**
 * Checks whether a ring (closed LineString) has right hand winding number.
 * @see https://tools.ietf.org/html/rfc7946#section-3.1.6
 **/
export const isRightHand = (ring: Position[]): boolean => {
  let prev, curr;

  let integral = 0;
  for (let i = 1; i < ring.length; i++) {
    prev = curr || ring[0];
    curr = ring[i];
    integral += dXdY(prev, curr);
  }

  return integral > 0;
};

/** when xs has a left hand winding: issue a warning */
export const warnWindingOrderRing = (xs: Position[]): void => {
  if (!isRightHand(xs)) {
    console.warn("ring with left hand winding order.");
  }
};

/** when xs has rings with a left hand winding: issue a warning */
export const warnWindingOrderPolygon = (xs: Position[][], id = ""): void => {
  const label = id.length > 0 ? "" : ` (${id})`;
  xs.some((x: Position[]) => {
    if (!isRightHand(x)) {
      console.warn(`polygon with left hand ring.${label}.`);
      return true;
    }

    return false;
  });
};

/** when xs has polygons with left hand rings: issue a warning */
export const warnWindingOrderMultiPolygon = (
  xs: Position[][][],
  id = ""
): void => {
  const label = id.length > 0 ? "" : ` (${id})`;
  xs.some((poly: Position[][]) => {
    const inner = poly.some((ring: Position[]) => {
      if (!isRightHand(ring)) {
        console.warn(`multipolygon with left hand ring${label}.`);
        return true;
      }

      return false;
    });

    if (inner) return true;

    return false;
  });
};

/** Shorthand for last element of array */
const last = <T>(xs: T[]) => xs[xs.length - 1];

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
