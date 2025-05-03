// components/MapView.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import redIcon from "@/icons/leafletIcons";

type MapViewProps = {
  center: LatLngExpression;
  title: string;
};

export default function MapView({ center, title }: MapViewProps) {
  return (
    <div
      id="map-preview"
      className="w-full h-[300px] rounded-lg overflow-hidden border mt-4 relative ">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        attributionControl={true}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={redIcon}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
