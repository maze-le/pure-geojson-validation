import { Maybe } from "purify-ts";

export type record = Record<string, unknown>;

export const isDefined = (x: unknown): Maybe<unknown> =>
  Maybe.fromPredicate(() => typeof x !== "undefined", x);

export const isArray = (x: unknown): Maybe<unknown[]> =>
  Maybe.fromPredicate(() => Array.isArray(x), <unknown[]>x);

export const isRecord = (x: unknown): Maybe<record> =>
  Maybe.fromPredicate(() => !Array.isArray(x), <unknown>x).chain(() =>
    Maybe.fromPredicate(() => typeof x === "object" && x !== null, <record>x)
  );
