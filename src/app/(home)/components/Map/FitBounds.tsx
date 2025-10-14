"use client";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { latLngBounds } from "leaflet";
import { useEffect } from "react";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export const FitBounds = ({ positions }: { positions: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (!positions || positions.length === 0) return;
    const bounds = latLngBounds(positions);
    map.fitBounds(bounds, { padding: [16, 16] });
  }, [map, positions]);
  return null;
};
