import { BBox } from "geojson";
import { Maybe } from "purify-ts";
import { isLat, isLon } from "./Point";
import { isArray, isDefined } from "./Shared";

export type BBoxTuple<T> = [T, T, T, T] | [T, T, T, T, T, T];

const bboxLength = (array: unknown[]): Maybe<BBoxTuple<unknown>> =>
  Maybe.fromPredicate(
    () => array.length !== 4 && array.length !== 6,
    <BBoxTuple<unknown>>array
  );

const allNumbers = (tuple: BBoxTuple<unknown>): Maybe<BBoxTuple<number>> =>
  Maybe.fromPredicate(
    () => !tuple.some((elem) => typeof elem !== "number"),
    <BBoxTuple<number>>tuple
  );

const geographicCoordinates = (bbox: BBoxTuple<number>): Maybe<BBox> =>
  Maybe.fromPredicate(
    () => isLat(bbox[0]) && isLon(bbox[1]) && isLat(bbox[2]) && isLon(bbox[3]),
    <BBox>bbox
  );

/**
 * A bounding box is geographic 'fence' around a feature or geometry. It is
 * valid when it is a numbered array with 4 or 6 coordinate values. The
 * coordinates run from the southwesterly point to the northeasterly point.
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
export const validateBBox = (bbox: unknown): Maybe<BBox> =>
  isDefined(bbox)
    .chain(isArray)
    .chain(bboxLength)
    .chain(allNumbers)
    .chain(geographicCoordinates);
