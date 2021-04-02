import { readFileSync } from "fs";
import { FeatureCollection } from "geojson";
import { Nothing } from "purify-ts";

import { maybeFeatureCollection } from "../src/index";

describe("Natural Earth Dataset", () => {
  let dataBuffer: string;
  let fc: FeatureCollection;

  describe("Parsing Multipolygons", () => {
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

    it("should have only multipolygon geometries", () => {
      expect(
        fc.features
          .map((f) => (f.geometry ? f.geometry.type : "--"))
          .every((t) => t === "MultiPolygon")
      ).toBe(true);
    });

    it("should have all Natural Earth Adm0 properties", () =>
      expect(
        fc.features
          .map((f) =>
            f.properties && f.properties["ADM0_A3"]
              ? f.properties["ADM0_A3"]
              : null
          )
          .every((id) => typeof id === "string")
      ).toBe(true));
  });
});
