"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import homesData from "@/../public/1000_homes.json";
import { Home } from "@/types/home";

const allHomes = homesData as Home[];

export const MapDialog = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-96 h-96 absolute top-4 right-4 bg-red-500 z-10"></div>
      </DialogTrigger>
      <DialogContent className="w-full h-full !max-w-full p-8">
        <DialogHeader className="hidden">
          <DialogTitle />
        </DialogHeader>
        <Map markers={allHomes.map((home) => ({ position: [home.lat, home.lng], label: home.address }))} />
      </DialogContent>
    </Dialog>
  );
};