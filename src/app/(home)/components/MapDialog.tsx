"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFilterStore } from "@/providers/filter-store";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import allHomes from "@/../public/1000_homes.json";
import { Home } from "@/types/home";

export const MapDialog = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const filteredHomes = useFilterStore((state) => state.filteredHomes);
  const coordinates = useFilterStore((state) => state.coordinates);

  const homes =
    filteredHomes.length > 0 || coordinates.length !== 0
      ? filteredHomes
      : (allHomes as Home[]);

  const markers = useMemo(() => {
    return homes.map((home) => ({
      position: [home.lat, home.lng] as [number, number],
      label: home.address,
    }));
  }, [homes]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-36 h-36 absolute top-2 right-2 bg-white z-10">
          <Map markers={markers} preview />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] h-[90%] !max-w-full p-4">
        <DialogHeader className="hidden">
          <DialogTitle />
        </DialogHeader>
        <Map markers={markers} />
      </DialogContent>
    </Dialog>
  );
};
