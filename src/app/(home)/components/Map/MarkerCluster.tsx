"use client";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect } from "react";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";

export const MarkerCluster = ({
  markers,
}: {
  markers: { position: [number, number]; label: string }[];
}) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const clusterGroup = L.markerClusterGroup();
    markers.forEach((m) => {
      const marker = L.marker(m.position).bindTooltip(m.label);
      clusterGroup.addLayer(marker);
    });
    map.addLayer(clusterGroup);
    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, markers]);
  return null;
};
