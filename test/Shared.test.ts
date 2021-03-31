import { Just, Nothing } from "purify-ts";
import {
  isArray /*, isDefined, isRecord*/,
  isDefined,
  isRecord,
  record,
} from "../src/lib/Shared";

/** Tests for helper functions. */
describe("Shared Functions", () => {
  const validArray = [1, 2, 3, 4, 5, 6, 7, 8];
  const emptyArray = [];
  const aRecord: record = { foo: "bar" };
  const aNumberedRecord = { 1: "this" };

  describe("isArray(x)", () => {
    it("returns Just(array), if x is of type array", () =>
      expect(isArray(validArray)).toEqual(Just(validArray)));
    it("returns Just(array), if x is an empty array", () =>
      expect(isArray(emptyArray)).toEqual(Just(emptyArray)));
    it("returns Nothing, if x is an object", () =>
      expect(isArray(aRecord)).toBe(Nothing));
    it("returns Nothing, if x is null", () =>
      expect(isArray(null)).toBe(Nothing));
    it("returns Nothing, if x is undefined", () =>
      expect(isArray(undefined)).toBe(Nothing));
    it("returns Nothing, if x is a number", () =>
      expect(isArray(4)).toBe(Nothing));
  });

  describe("isDefined(x)", () => {
    it("returns Just(x) when x is a number", () =>
      expect(isDefined(4)).toEqual(Just(4)));
    it("returns Just(x) when x is a string", () =>
      expect(isDefined("foo")).toEqual(Just("foo")));
    it("returns Just(x) when x is an object", () =>
      expect(isDefined(aRecord)).toEqual(Just(aRecord)));
    it("returns Just(x) when x is an array", () =>
      expect(isDefined([32])).toEqual(Just([32])));
    it("returns Just(x) when x is null", () =>
      expect(isDefined(null)).toEqual(Just(null)));
    it("returns Nothing when x is undefined", () =>
      expect(isDefined(undefined)).toBe(Nothing));
  });

  describe("isRecord(x)", () => {
    it("returns Just(x) when x is an object, indexed by strings", () =>
      expect(isRecord(aRecord)).toStrictEqual(Just(aRecord)));
    it("returns Just(x) when x is an object, indexed by number strings", () =>
      expect(isRecord(aNumberedRecord)).toStrictEqual(Just(aNumberedRecord)));
    it("returns Nothing when x is an array", () =>
      expect(isRecord([aRecord])).toBe(Nothing));
    it("returns Nothing when x is a string", () =>
      expect(isRecord("lalala")).toBe(Nothing));
    it("returns Nothing when x is null", () =>
      expect(isRecord(null)).toBe(Nothing));
    it("returns Nothing when x is undefined", () =>
      expect(isRecord(undefined)).toBe(Nothing));
  });
});
