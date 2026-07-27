import React, { useState, useEffect } from 'react';
import { Shield, Bell, Mic, Battery, Zap, AlertCircle, Download } from 'lucide-react';
import { TabType, UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  unreadCount: number;
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  isVoiceListening: boolean;
  onOpenSOS: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  unreadCount,
  activeTab,
  onNavigate,
  isVoiceListening,
  onOpenSOS,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-purple-900/30 px-4 py-3 text-white">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Status */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform border border-purple-400/30">
            <Shield className="w-5 h-5 text-white fill-purple-200/20" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-lg tracking-tight bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
                SafeRoute
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50">
                PWA
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Protected
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Battery className="w-3 h-3 text-emerald-400" /> {user.batteryLevel}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">

          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              onClick={handleInstallPWA}
              className="px-2.5 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/50 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition animate-bounce"
              title="Install SafeRoute PWA App"
            >
              <Download className="w-3.5 h-3.5 text-purple-300" />
              <span>Install App</span>
            </button>
          )}

          {/* Voice Keyword Indicator */}
          <button
            onClick={() => onNavigate('settings')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition border ${
              isVoiceListening
                ? 'bg-purple-950/80 text-purple-300 border-purple-600/60 shadow-sm shadow-purple-800/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title={`Secret Command: "${user.secretVoiceCommand}"`}
          >
            <Mic className={`w-4 h-4 ${isVoiceListening ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
          </button>

          {/* Quick SOS Trigger Button */}
          <button
            onClick={onOpenSOS}
            className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-950/60 border border-rose-400/40 flex items-center gap-1 active:scale-95 transition"
          >
            <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse border border-slate-950">
                {unreadCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
