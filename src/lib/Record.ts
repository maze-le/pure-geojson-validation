import { Maybe } from "purify-ts";

export type record = Record<string, unknown>;

export const isRecord = (x: unknown) =>
  Maybe.fromPredicate(() => typeof x === "object" && x !== null, <record>x);