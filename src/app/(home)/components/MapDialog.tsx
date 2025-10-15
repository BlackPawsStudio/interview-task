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
import { latLngTuple } from "@/lib/schemas";
import { getFilteredHomes } from "./Map";

export const MapDialog = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const coordinates = useFilterStore((state) => state.coordinates);

  const homes = useMemo(() => getFilteredHomes(coordinates[0]), [coordinates]);

  const markers = useMemo(() => {
    return homes.map((home) => ({
      position: latLngTuple(home.lat, home.lng),
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
