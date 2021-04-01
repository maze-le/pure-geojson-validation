# pure-geojson-validation

_pure-geojson-validation_ is a library to check the internal consistency of geojson objects. In addition to checking the JSON structure of a possible geojson blob, the library can also check the internal consistency of the given coordinates.

## Dependencies

The library will use the geojson type definitions as found in the package: `@types/geojson`.

The library uses algorithmic data structures from the library: [purify-ts](https://gigobyte.github.io/purify) and is intended to work with it. Especially the [Maybe monad](https://gigobyte.github.io/purify/adts/Maybe) is used extensively when parsing and validating a possible geojson string- or object. It is worth considering to look at _purify_, even if you don't intend to work with monads.

### Limitations

The __Polygon__ and __MultiPolygon__ geometries are currently __not evaluated__ in depth.

The library __only__ supports parsing and validating __FeatureCollections as top level object__.

The library currently __cannot parse GeometryCollection__ geometries correctly. For now validating a _GeometryCollection_ geometry will yield `Nothing`.

The library does not and will not support deprecated geojson features like the `crs` property. Although any additional properties are valid, only supported values will be returned by parser- or validation functions. That means, if you parse a GeoJSON object with an additional property like e.g. `crs` it will not be represented in the resulting object.

## Usage

### Installation

    npm i -D @types/geojson
    npm i purify-ts pure-geojson-validation

### Code Example

#### With Maybe

The library exposes several functions to parse strings as GeoJSON objects. Methods that start with _maybe_ always return a Maybe (a value wrapped in a `Just` or `Nothing`). It is recommended to use the Maybe implementations of the library.

```typescript
import { maybeFeatureCollection } from "pure-geojson-validation";

function getFeatureCollectionOrNull() {
  const content = readFileSync("path/to/file.geojson");
  const maybeFC = maybeFeatureCollection(content)
    .ifJust(() => console.info("successfully parsed feature collection"))
    .ifNothing(() => console.error("could not parse feature collection"));

  return maybeFC.isNothing() ? null : maybeFC.unsafeCoerce();
}
```

#### With try/catch

Alternatively you can also use the "unsafe" _try_ methods that will raise an error if a string cannot be parsed or validated.

```typescript
import { tryFeatureCollection } from "pure-geojson-validation";

function getFeatureCollectionOrNull() {
  try {
    const content = readFileSync("path/to/file.geojson");
    const unsafeFC = tryFeatureCollection(content);

    console.info("successfully parsed feature collection");

    return unsafeFC;
  } catch (err) {
    console.error("could not parse feature collection");
    return null;
  }
}
```

## Library Types, Methods and Objects

```typescript
import { tryFeatureCollection } from "pure-geojson-validation";

function getFeatureCollectionOrNull() {
  try {
    const content = readFileSync("path/to/file.geojson");
    const unsafeFC = tryFeatureCollection(content);

    console.info("successfully parsed feature collection");

    return unsafeFC;
  } catch (err) {
    console.error("could not parse feature collection");
    return null;
  }
}
```

### Types

The following types are exposed to ensure type consistency when using it as a library.

#### record

A shorthand type for objects with entries of unknown value.

```typescript
type record = Record<string, unknown>;
```

#### BBoxTuple<T>

An internal type that describes bounding boxes.

```typescript
type BBoxTuple<T> = [T, T, T, T] | [T, T, T, T, T, T];
```

#### Position

The internal representation of point geometries. Point geometries with more than 3 entries are valid, but any entry past index 3 in an array will be ignored.

```typescript
export type Position = number[];
```

#### Coordinates

The internal representation of coordinates that describe more complex geometries than the point.

```typescript
export type Coordinates = Position | Position[] | Position[][] | Position[][][];
```

#### Geometry

A geojson geomtry as defined in `@types/geojson` except the `GeometryCollection` type as it is not implemented yet.

```typescript
type Geom =
  | LineString
  | MultiLineString
  | MultiPoint
  | MultiPolygon
  | Point
  | Polygon;
```

### Parser

The following methods turns a string representation of a possible _FeatureCollection_ eventually into a _FeatureCollection_ as defined in `@types/geojson`.

#### maybeFeatureCollection

Attempts to parse and validate the content string as `Maybe` of a _GeoJSON_ _FeatureCollection_. Sanity checks are performed on coordinate values, if they fail the function returns with the associated geometry set to _null_ and a warning is issued. Additional checks are performed on bounding boxes and features. If they fail the function returns Nothing. If the collection is valid, `Just(FeatureCollection)` is returned.

```typescript
const maybeFeatureCollection: (content: string) => Maybe<FeatureCollection>;
```

#### tryFeatureCollection

Attempts to parse and validate the content string as _GeoJSON_ _FeatureCollection_. Sanity checks are performed on coordinate values, if they fail the function returns with the associated geometry set to _null_ and a warning is issued. Additional checks are performed on bounding boxes and features. If they fail the function throws an error. If the collection is valid an object of the type _FeatureCollection_ is returned.

```typescript
const tryFeatureCollection: (content: string) => FeatureCollection;
```

### Coordinate Predicates

The following methods check if coordinate values are valid and within the bounds of a WSG84 coordinate projection. The arguments (except for isLat and isLon) are of type unknown, but are assumed to be nested number arrays, depending on the chosen geometry type. If you want to work with these predicates and with `Maybe` create a `Maybe` from a predicate like this:

```typescript
import { isPoint } from "pure-geojson-validation";
const maybePoint = (point: unknown) => Maybe.fromPredicate(isPoint, point);
```

#### isLat
```typescript
const isLat: (lat: number) => boolean;
```

Returns true if lat is a number representing a latitude angle in WSG84.

#### isLon
```typescript
const isLon: (lat: number) => boolean;
```
Returns true if lat is a number representing a longitude angle in WSG84.

#### isPoint
```typescript
const isPoint: (p: unknown) => boolean;
```
Returns true if p is a point geometry as defined in [RFC7946,3.1.2](https://tools.ietf.org/html/rfc7946#section-3.1.2).

#### isLine
```typescript
const isLine: (pa: unknown) => boolean;
```
Returns true if _pa_ is a line- or multipoint geometry as defined in [RFC7946,3.1.3](https://tools.ietf.org/html/rfc7946#section-3.1.3).

#### isPolygon
```typescript
const isLineArray: (la: unknown) => boolean;
```

Returns true if _la_ is a polygon- or multiline geometry as defined in [RFC7946,3.1.5](https://tools.ietf.org/html/rfc7946#section-3.1.5).

#### isMultiPolygon
```typescript
  const isPolygonArray: (polya: unknown) => boolean;
```
Returns true if _polya_ is a polygon- or multiline geometry as defined in [RFC7946,3.1.7](https://tools.ietf.org/html/rfc7946#section-3.1.7).

#### isRightHand
```typescript
  const isRightHand = (xs: Position[]): boolean;
```
Checks whether a ring (closed LineString) has right hand winding number. [see RFC7946,3.1.6](https://tools.ietf.org/html/rfc7946#section-3.1.6)
The time complexity of this function is O(n) with n: length of xs
#### isLinearRing
```typescript
  const isLinearRing = (xs: unknown[][]): boolean;
```
Returns true if xs is an array of closed line segments
#### isLinearRingArray
```typescript
  const isLinearRingArray = (xs: unknown[][][]): boolean;
```
Returns true if xs is an array of linear rings
#### warnWindingOrderRing
```typescript
  const warnWindingOrderRing = (xs: Position[]): void
```
When xs has a left hand winding: issue a warning
#### warnWindingOrderPolygon
```typescript
  const warnWindingOrderPolygon = (xs: Position[][]): void
```
When xs has rings with a left hand winding: issue a warning

### Validation Functions

#### validateBBox
```typescript
  const validateBBox: (bbox: unknown) => Maybe<BBox>;
```

Validates a possible bounding box and eventually returns with a GeoJSON _BBox_ object. _bbox_ is expected to be an array of length 4 or 6.

#### validateFeature: (feat: unknown) => Maybe<Feature>;
```typescript
  const validateFeature: (feat: unknown) => Maybe<Feature>;
```
Validates a possible _GeoJSON_ feature and eventually returns with a _Feature_ object as found in `@types/geojson`. _feat_ is expected to be a _GeoJSON_ feature object ([RFC7946,3.1.2](https://tools.ietf.org/html/rfc7946#section-3.1.2)).

#### validateFeatureCollection: (fc: unknown) => Maybe<FeatureCollection>;
```typescript
  const validateFeatureCollection: (fc: unknown) => Maybe<FeatureCollection>;
```

Validates a possible _GeoJSON_ feature collections and eventually returns with a _FeatureCollection_ object as found in `@types/geojson`.

#### validateGeometry: (geometry: record | null) => Maybe<Geometry>;
```typescript
  const validateGeometry: (geometry: record | null) => Maybe<Geometry>;
```

Validates a possible _GeoJSON_ geometries and eventually returns with a _Geometry_ object as found in `@types/geojson`. Beware that **null** Geometries are valid according to the _GeoJSON_ spec and a call like: `validateGeometry(null)` will return `Just(null)`.

### Constants

The Array of possible geometry types is exposed to give non-typescript users access to valid geometry types. The `geometryTypes` array contains all currently supported geometry types as string.

```typescript
const geometryTypes: GeoJsonGeometryTypes[];
```

## Future Developments

The library should be able to read and validate any geojson object (not just _FeatureCollections_) in a furure iteration.

I plan to implement further sanity checks on geometries (avoiding self intersections, zero length line segments, etc.) in the future, as well as having an options-object that can be passed to the library methods to enforce strict or loose validation rules.
