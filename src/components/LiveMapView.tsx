import React, { useState } from 'react';
import { MapContainer } from './MapContainer';
import { EmergencyService, UnsafeAreaReport, RouteOption } from '../types';
import { Shield, Hospital, Building2, PhoneCall, MapPin, Navigation, Compass } from 'lucide-react';

interface LiveMapViewProps {
  userLat: number;
  userLng: number;
  emergencyServices: EmergencyService[];
  unsafeReports: UnsafeAreaReport[];
  activeRoute?: RouteOption | null;
  onOpenReportModal: (lat?: number, lng?: number) => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  userLat,
  userLng,
  emergencyServices,
  unsafeReports,
  activeRoute,
  onOpenReportModal,
}) => {
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);

  return (
    <div className="space-y-4 pb-20">
      
      {/* Map Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" /> Interactive Safety Map
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time GPS tracking, nearby emergency posts & community hazard markers.
          </p>
        </div>
      </div>

      {/* Main Map Box */}
      <MapContainer
        userLat={userLat}
        userLng={userLng}
        emergencyServices={emergencyServices}
        unsafeReports={unsafeReports}
        activeRoute={activeRoute}
        onSelectService={(service) => setSelectedService(service)}
        onMapClickForReport={(lat, lng) => onOpenReportModal(lat, lng)}
        className="h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl relative border border-purple-900/50"
      />

      {/* Selected Service Card */}
      {selectedService && (
        <div className="bg-slate-900 border border-purple-800/80 rounded-2xl p-4 text-white shadow-xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/60">
              {selectedService.type}
            </span>
            <h3 className="font-heading font-bold text-sm mt-1">{selectedService.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{selectedService.address}</p>
            <span className="text-xs font-semibold text-purple-300 block mt-1">{selectedService.distance}</span>
          </div>

          <a
            href={`tel:${selectedService.phone.replace(/[^0-9]/g, '')}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" /> Call
          </a>
        </div>
      )}

      {/* Nearby Emergency Services Drawer */}
      <div className="space-y-3 pt-2">
        <h3 className="font-heading font-bold text-sm text-white flex items-center justify-between">
          <span>Nearby Emergency Protection Services</span>
          <span className="text-xs text-purple-300 font-semibold">{emergencyServices.length} Nearby</span>
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {emergencyServices.map((es) => (
            <div
              key={es.id}
              onClick={() => setSelectedService(es)}
              className="bg-slate-900 hover:bg-slate-800/90 border border-purple-900/30 rounded-2xl p-3.5 transition cursor-pointer flex items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                  es.type === 'police' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {es.type === 'police' ? <Shield className="w-5 h-5" /> : <Hospital className="w-5 h-5" />}
                </div>

                <div>
                  <h4 className="font-heading font-bold text-xs text-white">{es.name}</h4>
                  <span className="text-[11px] text-slate-400 block">{es.address}</span>
                  <span className="text-[10px] font-semibold text-purple-300 block">{es.distance} • Open 24/7</span>
                </div>
              </div>

              <a
                href={`tel:${es.phone.replace(/[^0-9]/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition"
                title="Call Emergency Service"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
