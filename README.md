# pure-geojson-validation

_pure-geojson-validation_ is a typescript library to check the internal consistency of geojson objects. In addition to checking the JSON structure of a possible geojson blob, the library can also check the internal consistency of the given coordinates.

## Dependencies

The library will use the geojson type definitions as found in the package: `@types/geojson`. It uses algorithmic data structures from [purify-ts](https://gigobyte.github.io/purify) and is intended to work with it. Especially the [Maybe monad](https://gigobyte.github.io/purify/adts/Maybe) is used extensively when parsing and validating a possible geojson strings or objects. It is worth considering to look at _purify_, even if you don't intend to work with monads.

If you never heard of a monad or a maybe, it is a form of control structure found in pureley functional languages like haskell. What a monad is is hard to explain, an I can only point you to people that are far better at explaining it than me: [Like the haskell wikibook](https://en.wikibooks.org/wiki/Haskell/Understanding_monads/Maybe), [Computerphile](https://www.youtube.com/watch?v=t1e8gqXLbsU) or [Bartosz Milewski](https://www.youtube.com/watch?v=gHiyzctYqZ0).

### Limitations

- The library currently **cannot parse GeometryCollection** geometries correctly. For now validating a _GeometryCollection_ geometry will yield `Nothing`.

- The library does not and will not support deprecated geojson features like the `crs` property. Although any additional properties are valid ([RFC7946, #6](https://tools.ietf.org/html/rfc7946#section-6)), **only geojson object members will be returned** by parser- or validation functions. That means, if you parse a GeoJSON object with an additional property like e.g. `crs` it will not be represented in the resulting object.

- The **Polygon** and **MultiPolygon** geometries are checked for right handedness. If a left handed polygon-ring is found a warning is issued. The validator will not reverse the order of left handed rings.

## Usage

### Git

To check out the project, run:

    git clone https://github.com/maze-le/pure-geojson-validation.git

### Test

To test the repository, run:

    npm run test

### Install as lib

In your project:

    npm i -D @types/geojson
    npm i purify-ts pure-geojson-validation

### Code Example

#### With Maybe

The library exposes several functions to parse strings as GeoJSON objects. Methods that start with _maybe_ always return a Maybe (a value wrapped in a `Just` or `Nothing`). It is recommended to use the Maybe implementations of the library.

##### In the Maybe context

```typescript
import { maybeFeatureCollection } from "pure-geojson-validation";

const storeFeatureCollection = (path: string) =>
  maybeFeatureCollection(content)
    .ifNothing(() => console.error("error parsing feature collection"))
    .caseOf({
      Just: (FeatureCollection) =>
        writeToFile(path, JSON.stringify(FeatureCollection)),
      Nothing: () => console.warn(`skipped writing file "${path}"`),
    });
```

##### From the Maybe context to a regular context

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

## Methods

### String validation methods

The following methods turns a string representation of a possible _FeatureCollection_ eventually into a _FeatureCollection_ as defined in `@types/geojson`.

Sanity checks are performed on coordinate values, if they fail the function returns with the associated geometry set to _null_ and a warning is issued. Additional checks are performed on bounding boxes and features. If they fail the function returns Nothing. If the collection is valid, `Just(GeoJSONobject)` is returned.

The associated _try_ methods will raise an error when the validations fail.

```typescript
const maybeGeoJSON: (content: string) => Maybe<GeoJSONobject>;
const tryGeoJSON: (content: string) => GeoJSONobject;
```

Attempts to parse and validate the content string as _Maybe_ of a _GeoJSON_ object (Geometry, Feature or FeatureCollection).

```typescript
const maybeFeatureCollection: (content: string) => Maybe<FeatureCollection>;
const tryFeatureCollection: (content: string) => FeatureCollection;
```

Attempts to parse and validate the content string as _Maybe_ of a _GeoJSON_ _FeatureCollection_.

```typescript
const maybeFeature: (content: string) => Maybe<Feature>;
const tryFeature: (content: string) => Feature;
```

Attempts to parse and validate the content string as _Maybe_ of a _GeoJSON_ _Geometry_.

```typescript
const maybeGeometry: (content: string) => Maybe<Geometry>;
const tryGeometry: (content: string) => Geometry;
```

Attempts to parse and validate the content string as `Maybe` of a _GeoJSON_ _FeatureCollection_.

### Object validation methods

#### validateBBox

```typescript
const validateBBox: (bbox: unknown) => Maybe<BBox>;
```

Validates a possible bounding box and eventually returns with a GeoJSON _BBox_ object. _bbox_ is expected to be an array of length 4 or 6.

#### validateFeature

```typescript
const validateFeature: (feat: unknown) => Maybe<Feature>;
```

Validates a possible _GeoJSON_ feature and eventually returns with a _Feature_ object as found in `@types/geojson`. _feat_ is expected to be a _GeoJSON_ feature object ([RFC7946,3.1.2](https://tools.ietf.org/html/rfc7946#section-3.1.2)).

#### validateFeatureCollection

```typescript
const validateFeatureCollection: (fc: unknown) => Maybe<FeatureCollection>;
```

Validates a possible _GeoJSON_ feature collections and eventually returns with a _FeatureCollection_ object as found in `@types/geojson`.

#### validateGeometry

```typescript
const validateGeometry: (geometry: record | null) => Maybe<Geometry>;
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

The time complexity of this function is O(1).

#### isMultiPoint

```typescript
const isMultiPoint: (mp: unknown) => boolean;
```

Returns true if _mp_ is a multipoint geometry as defined in [RFC7946,3.1.3](https://tools.ietf.org/html/rfc7946#section-3.1.3).

The time complexity of this function is O(1).

#### isLineString

```typescript
const isLine: (pa: unknown) => boolean;
```

Returns true if _pa_ is a line- or multipoint geometry as defined in [RFC7946,3.1.4](https://tools.ietf.org/html/rfc7946#section-3.1.4).

The time complexity of this function is O(n), with n=length(pa).

#### isMultiLineString

```typescript
const isMultiLineString: (pa: unknown) => boolean;
```

Returns true if _pa_ is a line- or multipoint geometry as defined in [RFC7946,3.1.5](https://tools.ietf.org/html/rfc7946#section-3.1.5).

The time complexity of this function is O(n\*m), with n=length(pa); m=length(pa).

#### isPolygon

```typescript
const isPolygon: (la: unknown) => boolean;
```

Returns true if _la_ is a polygon- or multiline geometry as defined in [RFC7946,3.1.6](https://tools.ietf.org/html/rfc7946#section-3.1.6).

The time complexity of this function is O(n^2).

#### isMultiPolygon

```typescript
const isMultiPolygon: (multipolygon: unknown) => boolean;
```

Returns true if _multipolygon_ is a polygon array as defined in [RFC7946,3.1.7](https://tools.ietf.org/html/rfc7946#section-3.1.7).

The time complexity of this function is O(n^3).

#### isRightHand

```typescript
  const isRightHand = (xs: Position[]): boolean;
```

Checks whether a ring (closed LineString) has right hand winding number. [see RFC7946,3.1.6](https://tools.ietf.org/html/rfc7946#section-3.1.6)
The time complexity of this function is O(n) with n: length of xs.

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

## Types and Objects

### Constants

The Array of possible geometry types is exposed to give non-typescript users access to valid geometry types. The `geometryTypes` array contains all currently supported geometry types as string.

```typescript
const geometryTypes: GeoJsonGeometryTypes[];
```

### Types

The following types are exposed to ensure type consistency when using it as a library.

#### record

```typescript
type record = Record<string, unknown>;
```

A shorthand type for objects with entries of unknown value.

#### BBoxTuple<T>

```typescript
type BBoxTuple<T> = [T, T, T, T] | [T, T, T, T, T, T];
```

An internal type that describes bounding boxes.

#### Position

```typescript
export type Position = number[];
```

The internal representation of point geometries. Point geometries with more than 3 entries are valid, but any entry past index 3 in an array will be ignored.

#### Coordinates

```typescript
export type Coordinates = Position | Position[] | Position[][] | Position[][][];
```

The internal representation of coordinates that describe more complex geometries than the point.

#### Geometry

```typescript
type Geom =
  | LineString
  | MultiLineString
  | MultiPoint
  | MultiPolygon
  | Point
  | Polygon;
```

A geojson geomtry as defined in `@types/geojson` except the `GeometryCollection` type as it is not implemented yet.

## Future Developments

The library should be able to read and validate any geojson object (not just _FeatureCollections_) in a furure iteration.

I plan to implement further sanity checks on geometries (avoiding self intersections, zero length line segments, etc.) in the future, as well as having an options-object that can be passed to the library methods to enforce strict or loose validation rules.
