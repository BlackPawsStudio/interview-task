"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useMemo } from "react";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MarkerCluster } from "./MarkerCluster";
import { FitBounds } from "./FitBounds";

interface MapProps {
  markers: {
    position: [number, number];
    label: string;
  }[];
  zoom?: number;
}

const MapComponent = ({ markers }: MapProps) => {
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

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <FitBounds positions={positions} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerCluster markers={markers} />
    </MapContainer>
  );
};

export default MapComponent;
