import { Maybe } from "purify-ts";

export const isDefined = (x: unknown) =>
  Maybe.fromPredicate(() => typeof x !== "undefined", x);

export const isArray = (x: unknown) =>
  Maybe.fromPredicate(() => Array.isArray(x), <unknown[]>x);

export type record = Record<string, unknown>;

export const isRecord = (x: unknown) =>
  Maybe.fromPredicate(() => typeof x === "object" && x !== null, <record>x);
