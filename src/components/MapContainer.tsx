import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { UnsafeAreaReport, EmergencyService, RouteOption } from '../types';
import { Shield, Navigation, AlertTriangle, Building2, Hospital, Layers, Locate, PhoneCall, Plus } from 'lucide-react';

interface MapContainerProps {
  userLat: number;
  userLng: number;
  emergencyServices: EmergencyService[];
  unsafeReports: UnsafeAreaReport[];
  activeRoute?: RouteOption | null;
  onSelectReport?: (report: UnsafeAreaReport) => void;
  onSelectService?: (service: EmergencyService) => void;
  onMapClickForReport?: (lat: number, lng: number) => void;
  showServicesFilter?: boolean;
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  userLat,
  userLng,
  emergencyServices,
  unsafeReports,
  activeRoute,
  onSelectReport,
  onSelectService,
  onMapClickForReport,
  showServicesFilter = true,
  className = "h-[400px] w-full rounded-2xl overflow-hidden shadow-xl relative border border-purple-900/40"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'police' | 'hospital' | 'shelter' | 'reports'>('all');
  const [mapStyle, setMapStyle] = useState<'dark' | 'streets'>('dark');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLng],
        zoom: 15,
        zoomControl: false,
      });

      const tileLayerUrl = mapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileLayerUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map click for reporting
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClickForReport) {
          onMapClickForReport(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const tileLayerUrl = mapStyle === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayerUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // Update Markers & Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. User Location Pulse Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 bg-purple-500/40 rounded-full animate-ping"></div>
          <div class="w-6 h-6 bg-purple-600 border-2 border-white rounded-full flex items-center justify-center shadow-lg shadow-purple-900/50">
            <div class="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon })
      .bindPopup(`
        <div class="p-2 text-center text-slate-900">
          <div class="font-bold text-purple-700 text-sm flex items-center justify-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> You are here (Live GPS)
          </div>
          <p class="text-xs text-slate-600 mt-1">SafeRoute active protection enabled</p>
        </div>
      `);
    markersGroup.addLayer(userMarker);

    // 2. Emergency Services Markers
    emergencyServices.forEach((service) => {
      if (activeFilter !== 'all' && activeFilter !== 'reports' && activeFilter !== service.type) return;

      let iconHtml = '';
      if (service.type === 'police') {
        iconHtml = `<div class="w-8 h-8 bg-blue-600 border-2 border-white rounded-xl shadow-md flex items-center justify-center text-white font-bold text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg></div>`;
      } else if (service.type === 'hospital') {
        iconHtml = `<div class="w-8 h-8 bg-rose-600 border-2 border-white rounded-xl shadow-md flex items-center justify-center text-white font-bold text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/></svg></div>`;
      } else {
        iconHtml = `<div class="w-8 h-8 bg-purple-600 border-2 border-white rounded-xl shadow-md flex items-center justify-center text-white font-bold text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>`;
      }

      const serviceIcon = L.divIcon({
        className: 'custom-service-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([service.lat, service.lng], { icon: serviceIcon })
        .bindPopup(`
          <div class="p-1 min-w-[180px]">
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${service.type === 'police' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'}">${service.type}</span>
            <div class="font-bold text-slate-900 text-sm mt-1">${service.name}</div>
            <div class="text-xs text-slate-600 mt-0.5">${service.address}</div>
            <div class="text-xs font-semibold text-purple-700 mt-1">${service.distance}</div>
            <a href="tel:${service.phone.replace(/[^0-9]/g, '')}" class="mt-2 flex items-center justify-center gap-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow transition">
              Call ${service.phone}
            </a>
          </div>
        `);

      if (onSelectService) {
        marker.on('click', () => onSelectService(service));
      }
      markersGroup.addLayer(marker);
    });

    // 3. Unsafe Area Hazard Reports
    if (activeFilter === 'all' || activeFilter === 'reports') {
      unsafeReports.forEach((report) => {
        const isHigh = report.severity === 'high';
        const isMedium = report.severity === 'medium';
        const colorClass = isHigh ? 'bg-rose-600' : isMedium ? 'bg-amber-500' : 'bg-yellow-400';

        const hazardIcon = L.divIcon({
          className: 'custom-hazard-marker',
          html: `
            <div class="w-7 h-7 ${colorClass} text-white border-2 border-white rounded-full shadow-lg flex items-center justify-center font-bold text-xs animate-pulse">
              !
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const reportMarker = L.marker([report.lat, report.lng], { icon: hazardIcon })
          .bindPopup(`
            <div class="p-1 max-w-[220px]">
              <div class="flex items-center justify-between gap-1">
                <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">${report.category.replace('_', ' ')}</span>
                <span class="text-[10px] text-slate-500">${report.reportedAt}</span>
              </div>
              <div class="font-bold text-slate-900 text-sm mt-1">${report.title}</div>
              <p class="text-xs text-slate-600 mt-1 line-clamp-2">${report.description}</p>
              ${report.photoUrl ? `<img src="${report.photoUrl}" alt="Hazard" class="w-full h-20 object-cover rounded-md mt-2" />` : ''}
              ${report.aiSafetyTip ? `<div class="mt-2 bg-purple-50 text-purple-900 border border-purple-200 text-[11px] p-1.5 rounded"><strong>AI Tip:</strong> ${report.aiSafetyTip}</div>` : ''}
            </div>
          `);

        if (onSelectReport) {
          reportMarker.on('click', () => onSelectReport(report));
        }
        markersGroup.addLayer(reportMarker);
      });
    }

    // 4. Draw Active Route Polyline if present
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (activeRoute && activeRoute.pathCoordinates && activeRoute.pathCoordinates.length > 0) {
      const routeLine = L.polyline(activeRoute.pathCoordinates, {
        color: activeRoute.safetyScore >= 90 ? '#10b981' : activeRoute.safetyScore >= 75 ? '#3b82f6' : '#f59e0b',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '10, 8',
      }).addTo(map);

      polylineRef.current = routeLine;

      // Fit bounds to show entire route
      const bounds = L.latLngBounds(activeRoute.pathCoordinates);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

  }, [userLat, userLng, emergencyServices, unsafeReports, activeRoute, activeFilter]);

  const handleCenterUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLat, userLng], 16, { animate: true });
    }
  };

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Filter Chips */}
      {showServicesFilter && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition shadow-md whitespace-nowrap border ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-slate-900/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            All Safety Pins
          </button>
          <button
            onClick={() => setActiveFilter('police')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition shadow-md whitespace-nowrap flex items-center gap-1 border ${
              activeFilter === 'police'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-900/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" /> Police
          </button>
          <button
            onClick={() => setActiveFilter('hospital')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition shadow-md whitespace-nowrap flex items-center gap-1 border ${
              activeFilter === 'hospital'
                ? 'bg-rose-600 text-white border-rose-400'
                : 'bg-slate-900/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <Hospital className="w-3.5 h-3.5 text-rose-400" /> Hospitals
          </button>
          <button
            onClick={() => setActiveFilter('reports')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition shadow-md whitespace-nowrap flex items-center gap-1 border ${
              activeFilter === 'reports'
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-slate-900/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Unsafe Spots
          </button>
        </div>
      )}

      {/* Floating Action Controls */}
      <div className="absolute bottom-4 left-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setMapStyle(mapStyle === 'dark' ? 'streets' : 'dark')}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl shadow-lg backdrop-blur-md transition"
          title="Toggle Map Style"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-4 right-3 z-[1000] flex flex-col gap-2">
        {onMapClickForReport && (
          <button
            onClick={() => onMapClickForReport(userLat + 0.001, userLng + 0.001)}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-lg transition backdrop-blur-md border border-amber-400/50"
          >
            <Plus className="w-4 h-4" /> Report Here
          </button>
        )}
        <button
          onClick={handleCenterUser}
          className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg backdrop-blur-md transition border border-purple-400/50 self-end"
          title="Center on My Location"
        >
          <Locate className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
