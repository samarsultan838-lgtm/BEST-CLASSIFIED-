import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default icon issues in React
// Using CDN URLs to avoid import errors
const markerIcon2x = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const markerIcon = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const markerShadow = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  lat: number;
  lng: number;
  address?: string;
}

export default function MapView({ lat, lng, address }: MapViewProps) {
  return (
    <div className="h-[300px] w-full rounded-[2.5rem] overflow-hidden border-4 border-slate-50 relative z-0 shadow-inner">
      <MapContainer 
        center={[lat, lng] as any} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]}>
          {address && <Popup>{address}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
