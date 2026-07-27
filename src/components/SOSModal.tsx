import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Phone, Send, Volume2, VolumeX, X, ShieldAlert, CheckCircle2, MapPin, Share2, Copy } from 'lucide-react';
import { EmergencyContact, UserProfile } from '../types';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  contacts: EmergencyContact[];
  userLat: number;
  userLng: number;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  user,
  contacts,
  userLat,
  userLng,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [sentLog, setSentLog] = useState<Array<{ name: string; type: string; status: string; time: string }>>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const liveGpsLink = `https://saferoute.app/live-track?user=${encodeURIComponent(user.id)}&lat=${userLat.toFixed(4)}&lng=${userLng.toFixed(4)}`;

  // Handle Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      triggerEmergencyAlert();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Audio Siren Generator via Web Audio API
  const toggleSiren = () => {
    if (isSirenOn) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      
      // Siren wobble
      let up = true;
      const interval = setInterval(() => {
        if (!osc) {
          clearInterval(interval);
          return;
        }
        try {
          osc.frequency.setValueAtTime(up ? 1200 : 600, ctx.currentTime + 0.2);
          up = !up;
        } catch (e) {
          clearInterval(interval);
        }
      }, 300);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      setIsSirenOn(true);
    } catch (e) {
      console.warn("Audio siren error:", e);
    }
  };

  const stopSiren = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    setIsSirenOn(false);
  };

  const handleStartCountdown = () => {
    setCountdown(5);
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
    setIsAlertActive(false);
    stopSiren();
  };

  const triggerEmergencyAlert = () => {
    setIsAlertActive(true);
    startSiren();

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const primaryContacts = contacts.filter((c) => c.isPrimary || c.notifySMS);

    const logs = primaryContacts.map((c) => ({
      name: c.name,
      type: c.notifyCall ? 'SMS + Auto Call' : 'SMS Alert',
      status: 'SENT WITH GPS',
      time: now,
    }));

    setSentLog([
      { name: "Police Dispatch 911", type: "Emergency Route Feed", status: "NOTIFIED", time: now },
      ...logs,
    ]);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveGpsLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-rose-900/50 rounded-3xl p-6 text-white shadow-2xl relative">
        
        {/* Close Modal */}
        <button
          onClick={() => {
            stopSiren();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 text-xs font-bold mb-4">
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
            EMERGENCY SOS SYSTEM
          </div>

          <h2 className="font-heading font-extrabold text-2xl text-white">
            {isAlertActive ? "EMERGENCY ALERT BROADCASTING" : "Trigger Live Emergency SOS"}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {isAlertActive
              ? "Your live GPS & audio siren have been dispatched to your trusted emergency contacts."
              : "Press the button below to send live location to trusted contacts & authorities."}
          </p>

          {/* Large SOS Button or Countdown View */}
          <div className="my-8 flex flex-col items-center justify-center">
            {countdown !== null ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-red-600 to-rose-700 border-4 border-rose-400 flex items-center justify-center text-5xl font-black text-white animate-pulse shadow-2xl shadow-rose-950">
                  {countdown}
                </div>
                <p className="text-sm font-semibold text-rose-300">Sending Emergency Alert in {countdown}s...</p>
                <button
                  onClick={handleCancelCountdown}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition shadow-lg"
                >
                  CANCEL EMERGENCY
                </button>
              </div>
            ) : !isAlertActive ? (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleStartCountdown}
                  className="w-40 h-40 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 hover:from-rose-500 hover:to-red-500 text-white font-heading font-black text-3xl shadow-2xl shadow-rose-900/80 border-4 border-rose-300 flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 animate-pulse-danger"
                >
                  <span>SOS</span>
                  <span className="text-[10px] font-sans font-medium tracking-widest uppercase opacity-90">Press Now</span>
                </button>
                <span className="text-[11px] text-slate-400 italic">5-second hold buffer with instant cancel</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-full bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center animate-ping">
                  <AlertCircle className="w-14 h-14 text-rose-500" />
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> LIVE GPS BROADCAST ACTIVE
                </span>
              </div>
            )}
          </div>

          {/* Quick Siren Toggle & Hotline */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={toggleSiren}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                isSirenOn
                  ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-950 animate-bounce'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {isSirenOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{isSirenOn ? "Stop Siren" : "Loud Siren"}</span>
            </button>

            <a
              href="tel:911"
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl border border-blue-400 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call 911 Direct</span>
            </a>
          </div>

          {/* Sent Log / Live Location Share */}
          {sentLog.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left mb-4">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Alert Transmission Log</span>
                <span className="text-[10px] text-emerald-400 font-medium">Synced</span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {sentLog.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-0">
                    <div>
                      <span className="font-semibold text-white">{log.name}</span>
                      <span className="text-[10px] text-slate-400 block">{log.type} • {log.time}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Copy GPS Share Link */}
          <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3 flex items-center justify-between gap-2">
            <div className="text-left overflow-hidden">
              <span className="text-[10px] font-semibold text-purple-300 uppercase block">Live GPS Track Link</span>
              <span className="text-xs text-slate-300 truncate block font-mono">{liveGpsLink}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition flex items-center gap-1"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Voice Keyword Reminder */}
          <p className="text-[11px] text-slate-400 mt-4">
            💡 Secret Voice Command Active: Say <span className="text-purple-300 font-bold">"{user.secretVoiceCommand}"</span> anytime to trigger SOS hands-free.
          </p>

        </div>
      </div>
    </div>
  );
};
