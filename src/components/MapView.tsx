import React from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MapViewProps {
  lat: number;
  lng: number;
  address?: string;
}

export default function MapView({ lat, lng, address }: MapViewProps) {
  if (!hasValidKey) {
    return (
      <div className="h-[300px] w-full rounded-[2.5rem] flex items-center justify-center bg-slate-100 border-4 border-slate-50 text-center p-8">
        <div>
          <h3 className="font-bold text-slate-700">Google Maps Integration Required</h3>
          <p className="text-xs text-slate-500 mt-2">
            Please add GOOGLE_MAPS_PLATFORM_KEY to your secrets to enable maps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="h-[300px] w-full rounded-[2.5rem] overflow-hidden border-4 border-slate-50 relative z-0 shadow-inner">
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={true}
          gestureHandling="cooperative"
        >
          <AdvancedMarker position={{ lat, lng }} title={address}>
            <Pin background="#10b981" borderColor="#064e3b" glyphColor="#fff" />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}
