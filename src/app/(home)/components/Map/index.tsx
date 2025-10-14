"use client";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useMemo } from "react";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MarkerCluster } from "./MarkerCluster";
import { FitBounds } from "./FitBounds";
import { DrawControl } from "./Draw";
import { latLng, latLngBounds, LatLngBoundsLiteral } from "leaflet";
import homesData from "@/../public/1000_homes.json";
import { useFilterStore } from "@/providers/filter-store";

interface MapProps {
  markers: {
    position: [number, number];
    label: string;
  }[];
  preview?: boolean;
}

const MapComponent = ({ markers, preview }: MapProps) => {
  const positions = useMemo(() => markers.map((m) => m.position), [markers]);
  const initialCenter: [number, number] = useMemo(() => {
    if (positions.length === 0) return [51.505, -0.09];
    const [sumLat, sumLng] = positions.reduce(
      (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
      [0, 0]
    );
    return [sumLat / positions.length, sumLng / positions.length];
  }, [positions]);

  const initialZoom = 5;

  const setFilteredHomes = useFilterStore((state) => state.setFilteredHomes);
  const setCoordinates = useFilterStore((state) => state.setCoordinates);
  const coordinates = useFilterStore((state) => state.coordinates);

  const getFilteredHomes = (coordinates: [number, number][]) => {
    const bounds = latLngBounds(coordinates as LatLngBoundsLiteral);
    const homesInside = homesData.filter((home) =>
      bounds.contains(latLng(home.lng, home.lat))
    );
    return homesInside;
  };

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      maxZoom={preview ? 5 : undefined}
      scrollWheelZoom={!preview}
      className="w-full h-full rounded-lg"
    >
      <FitBounds positions={positions} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!preview && (
        <DrawControl
          onPolygonCreated={(feature) => {
            if (feature.geometry.type === "Polygon") {
              const ring = (feature.geometry as GeoJSON.Polygon)
                .coordinates[0] as [number, number][];
              setFilteredHomes(getFilteredHomes(ring));
              setCoordinates([ring]);
            } else if (feature.geometry.type === "MultiPolygon") {
              const ring = (feature.geometry as GeoJSON.MultiPolygon)
                .coordinates[0][0] as [number, number][];
              setFilteredHomes(getFilteredHomes(ring));
              setCoordinates([ring]);
            }
          }}
          onPolygonsChange={(fc) => {
            if (fc.features.length > 0) {
              const ring = (fc.features[0].geometry as GeoJSON.Polygon)
                .coordinates[0] as [number, number][];
              setFilteredHomes(getFilteredHomes(ring));
              setCoordinates([ring]);
            } else {
              setFilteredHomes([]);
              setCoordinates([]);
            }
          }}
        />
      )}
      {preview && coordinates.length > 0 &&
        coordinates.map((ring, idx) => (
          <Polygon
            key={idx}
            positions={ring.map(([lng, lat]) => [lat, lng] as [number, number])}
            pathOptions={{ color: "#2563eb", weight: 2 }}
          />
        ))}
      <MarkerCluster markers={markers} />
    </MapContainer>
  );
};

export default MapComponent;
