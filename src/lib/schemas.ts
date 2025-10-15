import { z } from "zod";

// Basic [lng, lat] pair
export const zLngLatPair = z.tuple([z.number(), z.number()]);

// Linear ring in [lng, lat] order (outer ring expected length >= 4 for closed polygon)
export const zRingLngLat = z.array(zLngLatPair).min(3);

// GeoJSON Polygon geometry (only care about coordinates correctness)
export const zPolygonGeometry = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(zRingLngLat).min(1), // [outer, ...holes]
});

// GeoJSON MultiPolygon geometry
export const zMultiPolygonGeometry = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(zRingLngLat).min(1)).min(1),
});

export const zGeometry = z.union([zPolygonGeometry, zMultiPolygonGeometry]);

export const zBBox = z.tuple([z.number(), z.number(), z.number(), z.number()]);

export const zFeature = z.object({
  type: z.literal("Feature"),
  geometry: zGeometry,
  properties: z.record(z.string(), z.any()).nullish(),
  id: z.any().optional(),
  bbox: zBBox.optional(),
});

export const zFeatureCollection = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(zFeature),
  bbox: zBBox.optional(),
});

export type LngLat = z.infer<typeof zLngLatPair>;

export function extractFirstRingFromFeature(input: unknown): LngLat[] | null {
  const parsed = zFeature.safeParse(input);
  if (!parsed.success) return null;
  const geom = parsed.data.geometry;
  if (geom.type === "Polygon") {
    return geom.coordinates[0];
  }
  // MultiPolygon → take outer ring of the first polygon
  if (geom.type === "MultiPolygon") {
    return geom.coordinates[0][0];
  }
  return null;
}

export function extractFirstRingFromFeatureCollection(
  input: unknown
): LngLat[] | null {
  const parsed = zFeatureCollection.safeParse(input);
  if (!parsed.success) return null;
  const feature = parsed.data.features[0];
  if (!feature) return null;
  return extractFirstRingFromFeature(feature);
}

export function toLeafletLatLngsFromLngLatRing(
  ring: LngLat[]
): [number, number][] {
  // Convert [lng, lat] -> [lat, lng]
  const result: [number, number][] = ring.map(([lng, lat]) => [lat, lng]);
  return result;
}

export function latLngTuple(lat: number, lng: number): [number, number] {
  return [lat, lng];
}

// Ensure parsed zFeature conforms to GeoJSON.Feature with only Polygon | MultiPolygon and properties not undefined
export function sanitizeGeoJsonFeature(
  f: z.infer<typeof zFeature>
): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> {
  const geometry =
    f.geometry.type === "Polygon"
      ? ({
          type: "Polygon",
          coordinates: f.geometry.coordinates,
        } as GeoJSON.Polygon)
      : ({
          type: "MultiPolygon",
          coordinates: f.geometry.coordinates,
        } as GeoJSON.MultiPolygon);

  return {
    type: "Feature",
    geometry,
    properties: f.properties ?? null,
    id: f.id,
    bbox: f.bbox,
  };
}
