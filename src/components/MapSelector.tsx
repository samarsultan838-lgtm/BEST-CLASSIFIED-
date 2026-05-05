import React, { useState, useEffect, useRef } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialValue?: string;
}

function PlacesAutocomplete({ onSelect }: { onSelect: (place: google.maps.places.PlaceResult) => void }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'name']
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        onSelect(place);
        setInputValue(place.formatted_address || place.name || "");
      }
    });
  }, [placesLib]);

  return (
    <div className="relative flex-grow">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium z-10"
        placeholder="Search city or area..."
      />
    </div>
  );
}

function MapClickResponder({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      }
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, onMapClick]);
  return null;
}

function MapUpdater({ center }: { center: google.maps.LatLngLiteral }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [center, map]);
  return null;
}

export default function MapSelector({ onLocationSelect, initialValue }: MapSelectorProps) {
  const [selectedPos, setSelectedPos] = useState<google.maps.LatLngLiteral | null>(null);
  const center = selectedPos || { lat: 30.3753, lng: 69.3451 }; // Default to Pakistan or selected
  
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setSelectedPos({ lat, lng });
      onLocationSelect(lat, lng, place.formatted_address || place.name || `${lat}, ${lng}`);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedPos({ lat, lng });
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      onLocationSelect(lat, lng, data.display_name || `${lat}, ${lng}`);
    } catch (error) {
      onLocationSelect(lat, lng, `${lat}, ${lng}`);
    }
  };

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-100/50 rounded-2xl border-4 border-slate-50 text-center p-8">
        <h3 className="font-black text-slate-700 uppercase tracking-widest text-sm mb-2">Google Maps API Key Required</h3>
        <p className="text-[10px] text-slate-500 font-bold max-w-[300px]">
          Please add a GOOGLE_MAPS_PLATFORM_KEY environment variable to use the Maps integration.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="space-y-4 flex flex-col h-[100%] w-full">
        <div className="flex">
          <PlacesAutocomplete onSelect={handlePlaceSelect} />
        </div>
        
        <div className="flex-grow rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-slate-50 relative z-0 min-h-[300px] md:min-h-[400px] w-full">
          <Map
            defaultCenter={{ lat: 30.3753, lng: 69.3451 }}
            defaultZoom={5}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
            disableDefaultUI={true}
          >
            {selectedPos && (
              <>
                <AdvancedMarker position={selectedPos}>
                  <Pin background="#10b981" borderColor="#064e3b" glyphColor="#fff" />
                </AdvancedMarker>
                <MapUpdater center={selectedPos} />
              </>
            )}
            <MapClickResponder onMapClick={handleMapClick} />
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}
