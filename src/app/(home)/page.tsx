import { Home } from "@/types/home";
import HomeTable from "./components/HomeTable";
import homesData from "@/../public/1000_homes.json";
import { MapDialog } from "./components/MapDialog";

export default function Page() {
  const homes = homesData as Home[];

  return (
    <div className="max-w-7xl h-[80vh] mx-auto py-10">
      <MapDialog />
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Expert Frontend Interview Task
      </h1>

      <div className="w-full h-[calc(100%-56px)] flex flex-col">
        <div className="flex-1 border border-gray-200 rounded-t-lg overflow-hidden shadow-sm">
          <HomeTable homes={homes} />
        </div>
        <div className="px-4 py-3 bg-gray-50 border border-gray-200 border-t-0 rounded-b-lg text-sm text-gray-600 font-medium">
          Showing {homes.length.toLocaleString()} rows
        </div>
      </div>
    </div>
  );
}
