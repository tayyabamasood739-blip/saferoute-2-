import React, { useState, useEffect } from 'react';
import { Shield, Compass, MapPin, AlertTriangle, Users, Phone, Zap, Sparkles, Navigation, Volume2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserProfile, TabType, ActiveTripState, RiskAssessmentData } from '../types';

interface HomeDashboardProps {
  user: UserProfile;
  userLat: number;
  userLng: number;
  activeTrip: ActiveTripState;
  onNavigate: (tab: TabType) => void;
  onOpenSOS: () => void;
  onOpenReportModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  userLat,
  userLng,
  activeTrip,
  onNavigate,
  onOpenSOS,
  onOpenReportModal,
}) => {
  const [riskData, setRiskData] = useState<RiskAssessmentData>({
    overallScore: user.safetyScore || 92,
    safetyStatus: 'safe',
    riskFactors: ['Evening visibility slightly reduced in side lanes'],
    recommendations: [
      'Stay on main illuminated avenues',
      'Keep secret voice command active ("' + user.secretVoiceCommand + '")',
      'Live location auto-sharing enabled with primary contacts'
    ],
    activeAlertsCount: 2,
  });
  const [isAssessing, setIsAssessing] = useState(false);

  useEffect(() => {
    const fetchRisk = async () => {
      setIsAssessing(true);
      try {
        const res = await fetch('/api/ai/risk-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: userLat,
            lng: userLng,
            timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            activeHazardsCount: 2,
            isWalkingAlone: true,
          }),
        });
        const data = await res.json();
        if (data && data.overallScore) {
          setRiskData(data);
        }
      } catch (err) {
        console.warn('Risk assessment error:', err);
      } finally {
        setIsAssessing(false);
      }
    };

    fetchRisk();
  }, [userLat, userLng]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Hero Welcome & AI Safety Meter */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 border border-purple-700/50 rounded-3xl p-6 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Real-Time Protection
            </span>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Hello, {user.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-xs">
              Your location is actively monitored for lit streets, nearby police posts, and community warnings.
            </p>
          </div>

          {/* User Avatar */}
          <button onClick={() => onNavigate('profile')} className="shrink-0 relative">
            <img src={user.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-400/60 shadow-lg" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
          </button>
        </div>

        {/* AI Personalized Risk Score Card */}
        <div className="mt-5 bg-slate-900/80 backdrop-blur-md border border-purple-800/40 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 border border-purple-700/60 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">AI Safety Risk Score</span>
                <span className="text-[11px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {riskData.safetyStatus} Environment
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-heading text-purple-300">{riskData.overallScore}</span>
              <span className="text-xs text-slate-400 font-semibold">/100</span>
            </div>
          </div>

          {/* Actionable recommendations */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1">
            {riskData.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Prominent Large SOS Trigger Button Card */}
      <div className="bg-gradient-to-r from-rose-950/80 via-red-950/60 to-slate-900 border border-rose-800/50 rounded-3xl p-5 shadow-xl text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-4 h-4 text-rose-400 animate-bounce" /> Emergency SOS Guard
          </span>
          <span className="text-[10px] text-slate-400 font-medium">1-Tap Alert</span>
        </div>

        <button
          onClick={onOpenSOS}
          className="w-full py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-500 hover:from-rose-500 hover:to-red-500 text-white font-heading font-black text-lg rounded-2xl shadow-xl shadow-rose-950 border border-rose-300/40 flex items-center justify-center gap-2 active:scale-98 transition animate-pulse-danger"
        >
          <Phone className="w-5 h-5 fill-white" />
          <span>PRESS FOR EMERGENCY SOS</span>
        </button>
        <span className="text-[10px] text-slate-400 block mt-2">
          Dispatches live GPS link to trusted contacts + activates loud siren synthesizer.
        </span>
      </div>

      {/* Quick Feature Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* AI Safe Route */}
        <div
          onClick={() => onNavigate('safe-route')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-purple-900/40 rounded-3xl p-4 cursor-pointer transition shadow-lg group"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-heading font-bold text-sm text-white">AI Safe Route</h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            Analyzes street lighting & crime density for safer travel paths.
          </p>
        </div>

        {/* Live Map & Emergency Services */}
        <div
          onClick={() => onNavigate('map')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-blue-900/40 rounded-3xl p-4 cursor-pointer transition shadow-lg group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-blue-300 mb-3 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-heading font-bold text-sm text-white">Live Map</h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            Locate nearby police stations, hospitals, and emergency services.
          </p>
        </div>

        {/* Report Unsafe Area */}
        <div
          onClick={onOpenReportModal}
          className="bg-slate-900 hover:bg-slate-800/80 border border-amber-900/40 rounded-3xl p-4 cursor-pointer transition shadow-lg group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-900/60 border border-amber-700/50 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="font-heading font-bold text-sm text-white">Report Unsafe Spot</h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            Upload photo & flag dark or suspicious zones for community.
          </p>
        </div>

        {/* Emergency Contacts */}
        <div
          onClick={() => onNavigate('contacts')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-indigo-900/40 rounded-3xl p-4 cursor-pointer transition shadow-lg group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-indigo-300 mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="font-heading font-bold text-sm text-white">Emergency Contacts</h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            Manage trusted family & friends for live tracking alerts.
          </p>
        </div>

      </div>

      {/* Secret Voice Command Banner */}
      <div
        onClick={() => onNavigate('settings')}
        className="bg-purple-950/40 border border-purple-800/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-purple-900/30 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-900/80 flex items-center justify-center text-purple-300 border border-purple-600/50">
            <Volume2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Secret Voice SOS Trigger</span>
            <span className="text-[11px] text-purple-300">Keyword: "{user.secretVoiceCommand}"</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-purple-400" />
      </div>

    </div>
  );
};
