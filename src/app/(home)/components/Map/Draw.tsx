"use client";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L, { FeatureGroup as LeafletFeatureGroup } from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useFilterStore } from "@/providers/filter-store";

export interface DrawControlProps {
  onPolygonCreated?: (feature: GeoJSON.Feature) => void;
  onPolygonsChange?: (featureCollection: GeoJSON.FeatureCollection) => void;
}

export const DrawControl = ({
  onPolygonCreated,
  onPolygonsChange,
}: DrawControlProps) => {
  const map = useMap();
  const drawnItemsRef = useRef<LeafletFeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const coordinates = useFilterStore((state) => state.coordinates);

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    drawnItemsRef.current = drawnItems;
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          metric: true,
          repeatMode: false,
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });
    drawControlRef.current = drawControl;
    map.addControl(drawControl);

    const emitAllPolygons = () => {
      if (!drawnItemsRef.current) return;
      const features: GeoJSON.Feature[] = drawnItemsRef.current
        .getLayers()
        .map((l) => (l as any).toGeoJSON?.())
        .filter(Boolean);
      onPolygonsChange?.({ type: "FeatureCollection", features });
    };

    const onCreated = (e: L.LeafletEvent) => {
      const ev = e as L.DrawEvents.Created;
      const layer = ev.layer as L.Layer;
      drawnItems.addLayer(layer);
      const feature = (layer as any).toGeoJSON?.() as
        | GeoJSON.Feature
        | undefined;
      if (feature) {
        onPolygonCreated?.(feature);
      }
      emitAllPolygons();
    };

    const onEdited = (_e: L.LeafletEvent) => {
      emitAllPolygons();
    };
    const onDeleted = (_e: L.LeafletEvent) => {
      emitAllPolygons();
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEdited);
    map.on(L.Draw.Event.DELETED, onDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEdited);
      map.off(L.Draw.Event.DELETED, onDeleted);
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
      if (drawnItemsRef.current) {
        map.removeLayer(drawnItemsRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const featureGroup = drawnItemsRef.current;
    if (!featureGroup) return;

    featureGroup.clearLayers();

    coordinates.forEach((ring) => {
      const latLngs = ring.map(([lng, lat]) => [lat, lng] as [number, number]);
      const polygonLayer = L.polygon(latLngs, {
        color: "#2563eb",
        weight: 2,
      });
      featureGroup.addLayer(polygonLayer);
    });
  }, [map, coordinates]);

  return null;
};
