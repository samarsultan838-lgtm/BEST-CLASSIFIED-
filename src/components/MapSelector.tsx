import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialValue?: string;
}

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

// Sub-component to sync map center with search results
function MapSync({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
}

export default function MapSelector({ onLocationSelect, initialValue }: MapSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      // Using Nominatim (OpenStreetMap's geocoding service) - completely free for low volume
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setSelectedPos([lat, lon]);
    onLocationSelect(lat, lon, result.display_name);
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedPos([lat, lng]);
    try {
      // Reverse geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      onLocationSelect(lat, lng, data.display_name || `${lat}, ${lng}`);
      setSearchQuery(data.display_name || `${lat}, ${lng}`);
    } catch (error) {
      onLocationSelect(lat, lng, `${lat}, ${lng}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow h-12 rounded-xl border border-slate-200 px-4 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
            placeholder="Search city or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          />
          <button 
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-500 text-emerald-950 px-6 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Find"}
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="absolute z-[1000] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden">
            {searchResults.map((result, idx) => (
              <div 
                key={idx}
                className="p-4 hover:bg-emerald-50 cursor-pointer text-xs font-bold text-slate-600 border-b border-slate-50 last:border-0 transition-colors"
                onClick={() => handleSelectResult(result)}
              >
                {result.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-[300px] w-full rounded-2xl overflow-hidden border-4 border-slate-50 relative z-0">
        <MapContainer 
          center={[30.3753, 69.3451] as any} // Center of Pakistan
          zoom={5} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker onSelect={handleMapClick} />
          {selectedPos && <Marker position={selectedPos} />}
          {selectedPos && <MapSync lat={selectedPos[0]} lng={selectedPos[1]} />}
        </MapContainer>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Click on the map or search to pin your exact location.
      </p>
    </div>
  );
}
