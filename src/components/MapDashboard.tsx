import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, OverlayViewF } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Home, Droplets, Flame, Wind, Activity } from 'lucide-react';
import HUDOverlay from './HUDOverlay';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

const getIcon = (type: string) => {
  switch (type) {
    case 'fire': return <Flame className="text-orange-500" />;
    case 'flood': return <Droplets className="text-blue-500" />;
    case 'earthquake': return <Activity className="text-red-500" />;
    case 'hurricane': return <Wind className="text-cyan-500" />;
    default: return <AlertTriangle className="text-yellow-500" />;
  }
};

interface MapDashboardProps {
  disasters: any[];
  onSelectDisaster: (disaster: any) => void;
}

export default function MapDashboard({ disasters, onSelectDisaster }: MapDashboardProps) {
  // Use the user-provided key as a fallback if the env var is missing or a placeholder
  const envKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || "";
  const isPlaceholder = !envKey || envKey === "MY_GOOGLE_MAPS_API_KEY";
  const fallbackKey = "AIzaSyBwB3pEC_uD65dlzlJWcivLJnuE89eyfFI";
  
  const apiKey = isPlaceholder ? fallbackKey : envKey;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  if (loadError || isPlaceholder) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#020617] p-10">
        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">Spatial Data Offline</h3>
          <p className="text-sm text-white/40 leading-relaxed mb-8">
            The Orbital Grid requires a valid Google Maps API Key. {isPlaceholder ? "Please configure VITE_GOOGLE_MAPS_API_KEY in your environment secrets." : "The provided key is invalid or lacks 'Maps JavaScript API' permissions."}
          </p>
          <div className="bg-white/5 rounded-xl p-4 text-left border border-white/5">
            <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-2">Protocol Correction:</p>
            <ol className="text-[10px] font-mono text-white/60 space-y-1 list-decimal ml-4">
              <li>Open Cloud Console</li>
              <li>Enable "Maps JavaScript API"</li>
              <li>Generate API Key</li>
              <li>Add to AIS Secrets</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) return (
    <div className="w-full h-full flex items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Global Grid...</p>
      </div>
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={4}
      options={mapOptions}
      mapTypeId={mapType}
    >
      {disasters.map((disaster) => (
        <React.Fragment key={disaster.id}>
          <Marker
            position={disaster.location}
            onClick={() => {
              setSelectedMarker(disaster);
              onSelectDisaster(disaster);
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: disaster.severity === 'high' ? '#ef4444' : disaster.severity === 'medium' ? '#f97316' : '#eab308',
              fillOpacity: 1,
              strokeWeight: disaster.id === selectedMarker?.id ? 2 : 0,
              strokeColor: '#ffffff',
              scale: disaster.severity === 'high' ? 12 : 8,
            }}
          />
          {selectedMarker?.id === disaster.id && (
            <OverlayViewF
              position={disaster.location}
              mapPaneName="overlayMouseTarget"
            >
              <div className="relative flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className={`absolute w-8 h-8 border-2 rounded-full ${
                    disaster.severity === 'high' ? 'border-red-500' : disaster.severity === 'medium' ? 'border-orange-500' : 'border-yellow-500'
                  }`}
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                  className={`absolute w-8 h-8 border rounded-full ${
                    disaster.severity === 'high' ? 'border-red-400' : disaster.severity === 'medium' ? 'border-orange-400' : 'border-yellow-400'
                  }`}
                />
              </div>
            </OverlayViewF>
          )}
        </React.Fragment>
      ))}

      {/* Tactical Legend Overlay */}
      <div className="absolute top-8 right-8 pointer-events-auto">
        <div className="bg-[#020617]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 min-w-[180px]">
           <div className="flex items-center justify-between gap-10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Grid Legend</span>
              <div className="flex gap-1">
                 <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                 <div className="w-1 h-1 rounded-full bg-cyan-500/30" />
              </div>
           </div>
           
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">High Severity</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">Medium Threat</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">Low Advisory</span>
              </div>
           </div>

           <div className="pt-2 border-t border-white/5 space-y-4">
              <button 
                 onClick={() => setMapType(prev => prev === 'roadmap' ? 'hybrid' : 'roadmap')}
                 className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                    mapType === 'hybrid' 
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 opacity-60 hover:opacity-100'
                 }`}
              >
                 <span className="text-[8px] font-bold uppercase tracking-widest">Orbital Imagery</span>
                 <div className={`w-8 h-4 rounded-full relative transition-colors ${mapType === 'hybrid' ? 'bg-cyan-500' : 'bg-white/10'}`}>
                    <motion.div 
                       animate={{ x: mapType === 'hybrid' ? 16 : 2 }}
                       transition={{ type: "spring", stiffness: 500, damping: 30 }}
                       className="absolute top-1 w-2 h-2 rounded-full bg-white shadow-sm"
                    />
                 </div>
              </button>
              <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase">
                 <span>Scanning...</span>
                 <span className="text-cyan-500">100%</span>
              </div>
              <div className="w-full h-0.5 bg-white/5 rounded-full relative overflow-hidden">
                 <motion.div 
                   animate={{ left: ['-100%', '100%'] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute top-0 bottom-0 w-1/3 bg-cyan-500/50"
                 />
              </div>
           </div>
        </div>
      </div>

      {/* HUD Overlay */}
      <HUDOverlay />

      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.location}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="p-2 min-w-[200px] text-slate-800">
            <div className="flex items-center gap-2 mb-2">
              {getIcon(selectedMarker.type)}
              <h3 className="font-bold capitalize">{selectedMarker.type}</h3>
              <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                selectedMarker.severity === 'high' ? 'bg-red-100 text-red-600' : 
                selectedMarker.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {selectedMarker.severity}
              </span>
              {selectedMarker.live && (
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 flex items-center gap-1 animate-pulse">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" /> LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mb-2">{selectedMarker.summary || 'Awaiting analysis...'}</p>
            <button 
              onClick={() => onSelectDisaster(selectedMarker)}
              className="w-full text-[10px] font-bold uppercase tracking-wider py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors"
            >
              Open Full Analysis
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
