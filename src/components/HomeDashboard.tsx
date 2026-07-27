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
        if (res.ok) {
          const data = await res.json();
          if (data && data.overallScore) {
            setRiskData(data);
          }
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
      <div className="relative overflow-hidden glass-card-purple rounded-3xl p-6 text-white shadow-2xl glow-purple">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> AI Real-Time Protection
            </span>
            <h1 className="font-heading font-black text-2xl text-white tracking-tight">
              Hello, {user.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-xs leading-relaxed">
              Active monitoring for street lamp illumination, CCTV density, police posts & community warnings.
            </p>
          </div>

          {/* User Avatar */}
          <button onClick={() => onNavigate('profile')} className="shrink-0 relative group">
            <img src={user.avatarUrl} alt="Avatar" className="w-13 h-13 rounded-2xl object-cover border-2 border-purple-400/80 shadow-lg group-hover:scale-105 transition-transform" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
          </button>
        </div>

        {/* AI Personalized Risk Score Card */}
        <div className="mt-5 glass-panel rounded-2xl p-4.5 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-950/80 text-purple-300 border border-purple-500/50 flex items-center justify-center font-bold shadow-inner">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">AI Protection Score</span>
                <span className="text-[11px] text-emerald-400 font-semibold uppercase flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> {riskData.safetyStatus} Environment
                </span>
              </div>
            </div>

            <div className="text-right bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-800/40">
              <span className="text-2xl font-black font-heading gradient-text-purple">{riskData.overallScore}</span>
              <span className="text-xs text-purple-300 font-bold">/100</span>
            </div>
          </div>

          {/* Actionable recommendations */}
          <div className="mt-3.5 pt-3 border-t border-purple-900/40 space-y-1.5">
            {riskData.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Prominent Large SOS Trigger Button Card */}
      <div className="glass-card-rose rounded-3xl p-5 shadow-2xl text-center relative overflow-hidden glow-rose">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-rose-400 animate-bounce" /> Emergency SOS Guard
          </span>
          <span className="text-[10px] text-rose-200/80 font-bold px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/40">Instant Dispatch</span>
        </div>

        <button
          onClick={onOpenSOS}
          className="w-full py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-500 hover:from-rose-500 hover:to-red-500 text-white font-heading font-black text-lg rounded-2xl shadow-2xl shadow-rose-950 border border-rose-300/50 flex items-center justify-center gap-2.5 active:scale-98 transition animate-pulse-danger cursor-pointer"
        >
          <Phone className="w-6 h-6 fill-white" />
          <span>PRESS FOR EMERGENCY SOS</span>
        </button>
        <span className="text-[10px] text-slate-400 block mt-2 font-medium">
          Dispatches live GPS link to trusted contacts & activates distress siren synthesizer.
        </span>
      </div>

      {/* Quick Feature Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* AI Safe Route */}
        <div
          onClick={() => onNavigate('safe-route')}
          className="glass-card hover:border-purple-500/60 rounded-3xl p-4 cursor-pointer transition-all duration-300 shadow-xl group hover:-translate-y-1 hover:glow-purple"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-900/60 border border-purple-500/50 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-heading font-bold text-sm text-white">AI Safe Route</h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            Analyzes street lighting & crime density for safest paths.
          </p>
        </div>

        {/* Live Map & Emergency Services */}
        <div
          onClick={() => onNavigate('map')}
          className="glass-card hover:border-blue-500/60 rounded-3xl p-4 cursor-pointer transition-all duration-300 shadow-xl group hover:-translate-y-1 hover:glow-blue"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-900/60 border border-blue-500/50 flex items-center justify-center text-blue-300 mb-3 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-heading font-bold text-sm text-white">Live Map</h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            Locate police stations, hospitals & safety markers.
          </p>
        </div>

        {/* Report Unsafe Area */}
        <div
          onClick={onOpenReportModal}
          className="glass-card hover:border-amber-500/60 rounded-3xl p-4 cursor-pointer transition-all duration-300 shadow-xl group hover:-translate-y-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-900/60 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="font-heading font-bold text-sm text-white">Report Unsafe Spot</h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            Upload photo & flag dark or suspicious zones.
          </p>
        </div>

        {/* Emergency Contacts */}
        <div
          onClick={() => onNavigate('contacts')}
          className="glass-card hover:border-indigo-500/60 rounded-3xl p-4 cursor-pointer transition-all duration-300 shadow-xl group hover:-translate-y-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-900/60 border border-indigo-500/50 flex items-center justify-center text-indigo-300 mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="font-heading font-bold text-sm text-white">Emergency Contacts</h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            Manage trusted contacts for live GPS alerts.
          </p>
        </div>

      </div>

      {/* Secret Voice Command Banner */}
      <div
        onClick={() => onNavigate('settings')}
        className="glass-card border border-purple-500/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-purple-900/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/80 flex items-center justify-center text-purple-300 border border-purple-500/60 shadow">
            <Volume2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Secret Voice SOS Trigger</span>
            <span className="text-[11px] text-purple-300 font-medium">Keyword: "{user.secretVoiceCommand}"</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-purple-400" />
      </div>

    </div>
  );
};
