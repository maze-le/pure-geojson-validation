const notOnce = <T>(array: T[], f: (x: T) => boolean) => !array.some(f);

/** @returns true if 'multipolygon' is an array of polygon geometries. **/
export const isPolygonArray = (multipolygon: unknown): boolean => {
  if (!Array.isArray(multipolygon)) {
    return false;
  }

  return notOnce(multipolygon, (x) => !isLineArray(x));
};

/** @returns true if 'multiline' is an array of line geometries. **/
export const isLineArray = (multiline: unknown): boolean => {
  if (!Array.isArray(multiline)) {
    return false;
  }

  return notOnce(multiline, (x) => !isPositionArray(x));
};

/** @returns true of 'multipoint' is an array of point geometries. **/
export const isPositionArray = (multipoint: unknown): boolean => {
  if (!Array.isArray(multipoint)) {
    return false;
  }

  return notOnce(multipoint, (x) => !isPoint(x));
};

/**
 * A point is a single coordinate, represented by an array with 2 or 3 numbers.
 * The array has the following semantics:
 *
 *  1. entry: latitude -- angle between -180.0 and 180.0
 *  1. entry: longitude -- angle between -90.0 and 90.0
 *  1. (optional) entry: height
 *
 * Further entries are not invalid, but are ignored.
 *
 * @returns true if position is a valid position geometry.
 **/
export const isPoint = (position: unknown): boolean => {
  if (!Array.isArray(position)) {
    return false;
  }

  if (position.length < 2) {
    return false;
  }

  if (position.some((x) => typeof x !== "number")) {
    return false;
  }

  const isCoordinatePair =
    isCoordinateLat(position[0]) && isCoordinateLon(position[1]);

  return position.length === 2
    ? isCoordinatePair
    : isCoordinatePair && isCoordinateHeight(position[2]);
};

export const isCoordinateLat = (lat: unknown): boolean =>
  typeof lat === "number" && lat >= -180.0 && lat <= 180.0;

export const isCoordinateLon = (lon: unknown): boolean =>
  typeof lon === "number" && lon >= -90.0 && lon <= 90.0;

export const isCoordinateHeight = (h: unknown): boolean =>
  typeof h === "number";
