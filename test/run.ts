import { readFileSync } from "fs";
import { maybeFeatureCollection } from "../src/lib/PureGeoJson";

const dataBuffer = readFileSync("./test/data/adm0-hires.geojson", {
  encoding: "utf-8",
});

const fc = maybeFeatureCollection(dataBuffer).unsafeCoerce();
console.log(fc.type);
