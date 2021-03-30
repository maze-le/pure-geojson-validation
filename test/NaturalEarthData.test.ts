import { readFileSync } from "fs";
import { FeatureCollection } from "geojson";
import { Nothing } from "purify-ts";

import { maybeFeatureCollection } from "../src/index";

const notOnce = <T>(array: T[], f: (x: T) => boolean) => !array.some(f);

describe("Natural Earth Dataset", () => {
  let dataBuffer: string;
  let fc: FeatureCollection;

  beforeAll(() => {
    dataBuffer = readFileSync("./test/data/adm0-hires.geojson", {
      encoding: "utf-8",
    });
  });

  beforeEach(() => {
    fc = maybeFeatureCollection(dataBuffer).unsafeCoerce();
  });

  it("should return a value", () => expect(fc).not.toBe(Nothing));
  it("should have a type property", () => expect(fc).toHaveProperty("type"));
  it("should have a features property", () =>
    expect(fc).toHaveProperty("features"));

  it("should have only multipolygon geometries", () =>
    expect(
      notOnce(
        fc.features.map((f) => f.geometry.type),
        (t) => t !== "MultiPolygon"
      )
    ).toBe(true));

  it("should have Natural Earth properties", () =>
    expect(
      notOnce(
        fc.features.map((f) =>
          f.properties && f.properties["ADM0_A3"]
            ? f.properties["ADM0_A3"]
            : null
        ),
        (id) => typeof id !== "string"
      )
    ).toBe(true));
});
