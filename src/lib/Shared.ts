import { Maybe } from "purify-ts";

export const isDefined = (x: unknown) =>
  Maybe.fromPredicate(() => typeof x !== "undefined", x);

export const isArray = (x: unknown) =>
  Maybe.fromPredicate(() => Array.isArray(x), <unknown[]>x);
