import homesData from "@/../public/1000_homes.json";
import { zRingLngLat } from "@/lib/schemas";
import type { Home } from "@/types/home";

export const getFilteredHomes = (coordinates?: [number, number][]): Home[] => {
  if (!coordinates || coordinates.length === 0) return homesData as Home[];
  const valid = zRingLngLat.safeParse(coordinates);
  if (!valid.success) return homesData as Home[];

  const ring = valid.data;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const [lng, lat] of ring) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }

  return (homesData as Home[]).filter((home) => {
    return (
      home.lat >= minLat &&
      home.lat <= maxLat &&
      home.lng >= minLng &&
      home.lng <= maxLng
    );
  });
};
