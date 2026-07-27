import React, { useState } from 'react';
import { Navigation, MapPin, Shield, Zap, Sparkles, Compass, AlertTriangle, ArrowRight, CheckCircle2, Clock, Footprints, ShieldCheck, Share2 } from 'lucide-react';
import { RouteOption, ActiveTripState } from '../types';

interface SafeRoutePlannerProps {
  userLat: number;
  userLng: number;
  onSelectRouteForMap: (route: RouteOption) => void;
  onStartTrip: (route: RouteOption, origin: string, destination: string) => void;
  activeTrip: ActiveTripState;
  onEndTrip: () => void;
}

export const SafeRoutePlanner: React.FC<SafeRoutePlannerProps> = ({
  userLat,
  userLng,
  onSelectRouteForMap,
  onStartTrip,
  activeTrip,
  onEndTrip,
}) => {
  const [origin, setOrigin] = useState("Current GPS Position (Market St)");
  const [destination, setDestination] = useState("5th Avenue University Campus");
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'evening' | 'night'>('night');
  const [transportMode, setTransportMode] = useState<'walking' | 'transit' | 'driving'>('walking');
  const [isLoading, setIsLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const handleFetchRoutes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/safe-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          userLat,
          userLng,
          timeOfDay,
          transportMode,
        }),
      });

      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        setRoutes(data.routes);
        const rec = data.routes.find((r: RouteOption) => r.recommended) || data.routes[0];
        setSelectedRouteId(rec.id);
        onSelectRouteForMap(rec);
      }
    } catch (err) {
      console.error("Safe route calculation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRoute = (route: RouteOption) => {
    setSelectedRouteId(route.id);
    onSelectRouteForMap(route);
  };

  const selectedRoute = routes?.find((r) => r.id === selectedRouteId) || routes?.[0];

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-slate-900 border border-purple-700/50 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-purple-400" /> AI Safe Route Generator
        </div>
        <h2 className="font-heading font-extrabold text-xl text-white">Smart Safety Path Planning</h2>
        <p className="text-slate-300 text-xs mt-1">
          Evaluates street lamp illumination, CCTV density, crime reports, and active community warnings for personalized risk minimization.
        </p>
      </div>

      {/* Active Trip Banner if running */}
      {activeTrip.isTraveling && activeTrip.currentRoute && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 rounded-3xl p-5 text-white shadow-xl animate-pulse-ring">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> LIVE TRIP TRACKING ACTIVE
            </span>
            <span className="text-xs text-emerald-300 font-medium">ETA: {activeTrip.estimatedArrival}</span>
          </div>

          <div className="font-bold text-base text-white">{activeTrip.currentRoute.name}</div>
          <p className="text-xs text-emerald-200 mt-0.5">
            Destination: {activeTrip.destinationName} ({activeTrip.currentRoute.distance})
          </p>

          <div className="mt-3 bg-emerald-900/60 rounded-xl p-2.5 text-xs text-emerald-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Contacts auto-notified with live GPS link
            </span>
            <span className="font-bold text-emerald-300">{activeTrip.currentRoute.safetyScore}% Safe</span>
          </div>

          <button
            onClick={onEndTrip}
            className="mt-4 w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            End Journey Safely
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleFetchRoutes} className="bg-slate-900 border border-purple-900/40 rounded-3xl p-5 space-y-4 shadow-xl">
        
        <div className="space-y-3">
          {/* Origin */}
          <div>
            <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Starting Point
            </label>
            <div className="relative">
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Current location or address..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-purple-400" /> Destination
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Quick Destination Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-slate-400 font-medium">Quick:</span>
          {["Home", "Workplace", "Central Metro", "University Lib"].map((place) => (
            <button
              key={place}
              type="button"
              onClick={() => setDestination(`${place} (Downtown)`)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-200 border border-slate-700/80 shrink-0 transition"
            >
              + {place}
            </button>
          ))}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Time of Day</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2 focus:outline-none focus:border-purple-500"
            >
              <option value="day">Daytime (6 AM - 6 PM)</option>
              <option value="evening">Evening (6 PM - 9 PM)</option>
              <option value="night">Late Night (9 PM - 6 AM)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Travel Mode</label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2 focus:outline-none focus:border-purple-500"
            >
              <option value="walking">Walking</option>
              <option value="transit">Public Transit</option>
              <option value="driving">Taxi / Driving</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-950/60 flex items-center justify-center gap-2 transition active:scale-98 border border-purple-400/30 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AI Analyzing Crime & Street Light Safety...</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              <span>Calculate AI Safe Routes</span>
            </>
          )}
        </button>
      </form>

      {/* AI Generated Routes Comparison */}
      {routes && routes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> AI Route Recommendations
            </h3>
            <span className="text-xs text-slate-400">{routes.length} options evaluated</span>
          </div>

          <div className="space-y-3">
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              const isRecommended = route.recommended;

              return (
                <div
                  key={route.id}
                  onClick={() => handleSelectRoute(route)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500 shadow-lg shadow-purple-950/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 right-4 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow border border-emerald-300">
                      ★ SAFEST AI PICK
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                        {route.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Footprints className="w-3.5 h-3.5 text-purple-400" /> {route.distance}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-400" /> {route.duration}</span>
                      </div>
                    </div>

                    {/* Safety Badge Score */}
                    <div className="text-right">
                      <div className={`text-base font-extrabold px-2.5 py-1 rounded-xl inline-block ${
                        route.safetyScore >= 90
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                          : route.safetyScore >= 75
                          ? 'bg-blue-950 text-blue-300 border border-blue-700/60'
                          : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                      }`}>
                        {route.safetyScore}%
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Safety Rating</span>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px]">
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Lit Streets</span>
                      <span className="font-bold text-purple-300">{route.litPercentage}% Illuminated</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Crime Density</span>
                      <span className="font-bold text-emerald-400">{route.crimeRating}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Police Posts</span>
                      <span className="font-bold text-blue-400">{route.policeStationsNearby} Nearby</span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <p className="text-xs text-slate-300 mt-3 bg-purple-950/30 p-2.5 rounded-xl border border-purple-900/30">
                    <strong className="text-purple-300">AI Insight:</strong> {route.aiRecommendationSummary}
                  </p>

                  {/* Step Instructions Expandable Preview */}
                  {isSelected && route.stepInstructions && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Turn-by-Turn Safety Guidance
                      </div>
                      <ol className="space-y-1.5 text-xs text-slate-400 list-decimal list-inside">
                        {route.stepInstructions.map((step, idx) => (
                          <li key={idx} className="leading-snug">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Start Journey Button */}
          {selectedRoute && (
            <button
              onClick={() => onStartTrip(selectedRoute, origin, destination)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-950/80 flex items-center justify-center gap-2 transition active:scale-98 border border-emerald-400/40"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Start Journey on "{selectedRoute.name}"</span>
            </button>
          )}

        </div>
      )}

    </div>
  );
};
