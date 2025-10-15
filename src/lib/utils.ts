import { clsx, type ClassValue } from "clsx";
import { latLng, latLngBounds } from "leaflet";
import { twMerge } from "tailwind-merge";
import homesData from "@/../public/1000_homes.json";
import { zRingLngLat } from "@/lib/schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
