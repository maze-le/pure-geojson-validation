import { isLat, isLon, isPoint } from "../src/lib/Point";

/** Tests for point coordinate validations. */
describe("Points", () => {
  /** Points */
  const [lat, lon]: [number, number] = [33.2, 22.12];
  const [latNeg, lonNeg]: [number, number] = [-176.2, -89.76];
  const [lat0, lon0]: [number, number] = [0, 0];
  const [latTooBig, lonTooBig]: [number, number] = [182.1, 99.1];
  const [latTooSm, lonTooSm]: [number, number] = [-180.2, -91.0];
  const [notLat, notLon]: [unknown, unknown] = ["2", { foo: "bar" }];
  const [nullLat, nullLon]: [unknown, unknown] = [null, null];

  describe("isLat(lat)", () => {
    it("returns true if lat is a positive valid latitude value", () =>
      expect(isLat(lat)).toBe(true));
    it("returns true if lat is a zero latitude value", () =>
      expect(isLat(lat0)).toBe(true));
    it("returns true if lat is a negative valid latitude value", () =>
      expect(isLat(latNeg)).toBe(true));
    it("returns false if lat is too big", () =>
      expect(isLat(latTooBig)).toBe(false));
    it("returns false if lat is too small", () =>
      expect(isLat(latTooSm)).toBe(false));
    it("returns false if lat is not a number", () =>
      expect(isLat(<number>notLat)).toBe(false));
    it("returns false if lat is null", () =>
      expect(isLat(<number>nullLat)).toBe(false));
    it("returns false if lat is a NaN", () => expect(isLat(NaN)).toBe(false));
  });

  describe("isLon(lon)", () => {
    it("returns true if lon is a positive valid latitude value", () =>
      expect(isLon(lon)).toBe(true));
    it("returns true if lon is a zero latitude value", () =>
      expect(isLon(lon0)).toBe(true));
    it("returns true if lon is a negative valid latitude value", () =>
      expect(isLon(lonNeg)).toBe(true));
    it("returns false if lon is too big", () =>
      expect(isLon(lonTooBig)).toBe(false));
    it("returns false if lon is too small", () =>
      expect(isLon(lonTooSm)).toBe(false));
    it("returns false if lon is not a number", () =>
      expect(isLon(<number>notLon)).toBe(false));
    it("returns false if lon is null", () =>
      expect(isLon(<number>nullLon)).toBe(false));
    it("returns false if lon is a NaN", () => expect(isLon(NaN)).toBe(false));
  });

  describe("isPoint(p)", () => {
    it("returns true if p is a positive vector", () =>
      expect(isPoint([lon, lat])).toBe(true));
    it("returns true if p is a zero vector", () =>
      expect(isPoint([0, 0])).toBe(true));
    it("returns true if p has negative entries", () =>
      expect(isPoint([-99.1, 89.0])).toBe(true));
    it("returns false if p:lat is higher than 180.0", () =>
      expect(isPoint([latTooBig, 21.1])).toBe(false));
    it("returns false if p:lon is higher than 90.0", () =>
      expect(isPoint([21.7, lonTooBig])).toBe(false));
    it("returns false if p:lat is lower than -180.0", () =>
      expect(isPoint([-180.01, 0])).toBe(false));
    it("returns false if p:lon is lower than -90.0", () =>
      expect(isPoint([-10.01, lonTooSm])).toBe(false));
    it("returns false if p is not a point", () =>
      expect(isPoint({ q: 111111 })).toBe(false));
    it("returns false if p is null", () => expect(isPoint(null)).toBe(false));
    it("returns false if p is has null entries", () =>
      expect(isPoint([127.3, null])).toBe(false));
    it("returns false if p is has string entries", () =>
      expect(isPoint([1, "2"])).toBe(false));
  });
});
