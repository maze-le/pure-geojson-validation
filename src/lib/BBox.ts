import { BBox } from "geojson";
import { Maybe } from "purify-ts";
import { isCoordinateLat, isCoordinateLon } from "./Coordinates";
import { isArray, isDefined } from "./Shared";

type BBoxTuple<T> = [T, T, T, T] | [T, T, T, T, T, T];

const bboxLength = (array: unknown[]) =>
  Maybe.fromPredicate(
    () => array.length !== 4 && array.length !== 6,
    <BBoxTuple<unknown>>array
  );

const allNumbers = (tuple: BBoxTuple<unknown>) =>
  Maybe.fromPredicate(
    () => !tuple.some((elem) => typeof elem !== "number"),
    <BBoxTuple<number>>tuple
  );

const geographicCoordinates = (bbox: BBoxTuple<number>) =>
  Maybe.fromPredicate(
    () =>
      isCoordinateLat(bbox[0]) &&
      isCoordinateLon(bbox[1]) &&
      isCoordinateLat(bbox[2]) &&
      isCoordinateLon(bbox[3]),
    <BBox>bbox
  );

/**
 * A bounding box is geographic 'fence' around a feature. It is valid when it is 
 * a numbered array with 4 or 6 coordinate values. The coordinates run from
 * the southwesterly point to the northeasterly point.
 * 
 * Lat coordinate values must be between -180° and 180°.
 * Lon coordinate values must be between -90° and 90°.
 * The 2 other numbers in the array represent 3D Bounding Boxes and are not checked.
 *
 *     [SW_Lat, SW_Lon, NE_Lat, NE_Lon, ...]
 *
 * @returns Just(BBox) if bbox is a valid bounding box.
 * @returns Nothing if bbox is invalid.
 * @see https://tools.ietf.org/html/rfc7946
 **/
export const validateBBox = (bbox: unknown): Maybe<BBox> => {
  return isDefined(bbox)
    .chain(isArray)
    .chain(bboxLength)
    .chain(allNumbers)
    .chain(geographicCoordinates);
};
