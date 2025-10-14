"use client";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import { Home } from "@/types/home";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface HomeTableProps {
  homes: Home[];
}

export default function HomeTable({ homes }: HomeTableProps) {
  const columnDefs: ColDef<Home>[] = [
    {
      field: "id",
      headerName: "ID",
      filter: true,
      sortable: true,
      width: 120,
    },
    {
      field: "address",
      headerName: "Address",
      filter: true,
      sortable: true,
      flex: 1,
    },
    {
      field: "bedrooms",
      headerName: "Bedrooms",
      filter: true,
      sortable: true,
      width: 120,
    },
    {
      field: "construction_year",
      headerName: "Year Built",
      filter: true,
      sortable: true,
      width: 130,
    },
    {
      field: "area",
      headerName: "Area (sq m)",
      filter: true,
      sortable: true,
      width: 120,
    },
    {
      field: "lat",
      headerName: "Latitude",
      filter: true,
      sortable: true,
      width: 120,
    },
    {
      field: "lng",
      headerName: "Longitude",
      filter: true,
      sortable: true,
      width: 120,
    },
    {
      field: "created_at",
      headerName: "Created At",
      filter: true,
      sortable: true,
      sort: "desc",
      width: 200,
    },
  ];

  const myTheme = themeQuartz.withParams({
    accentColor: "#2563eb",
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    browserColorScheme: "light",
    headerBackgroundColor: "#f9fafb",
    headerFontSize: 14,
    headerFontWeight: 600,
  });

  return (
    <div className="w-full h-full">
      <AgGridReact<Home>
        theme={myTheme}
        rowData={homes}
        columnDefs={columnDefs}
        defaultColDef={{
          resizable: true,
        }}
      />
    </div>
  );
}
