import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle2, Share, X, Sparkles } from 'lucide-react';

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed as PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIOS(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      alert("To install SafeRoute:\n\n1. Open browser menu (3 dots or share icon)\n2. Tap 'Add to Home Screen' or 'Install App'");
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="glass-card-purple rounded-3xl p-4 border border-purple-500/50 shadow-2xl relative overflow-hidden glow-purple">
      <button
        onClick={() => setShowBanner(false)}
        className="absolute top-3 right-3 p-1 rounded-full text-purple-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg glow-purple">
          <Smartphone className="w-6 h-6 animate-bounce" />
        </div>

        <div className="flex-1 pr-6">
          <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
            <Sparkles className="w-3 h-3 text-purple-400" /> Install Mobile & Web App
          </div>
          <h3 className="font-heading font-black text-sm text-white">Install SafeRoute</h3>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            Add to home screen for 1-tap emergency access & instant GPS alerts.
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-purple-800/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] text-purple-200 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Works Offline & On Mobile</span>
        </div>

        <button
          onClick={handleInstallClick}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-bold text-xs rounded-xl shadow-lg border border-purple-300/40 flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Install App</span>
        </button>
      </div>

      {/* iOS Modal Guide */}
      {showIOSGuide && (
        <div className="mt-3 p-3 bg-purple-950/90 rounded-2xl border border-purple-600/60 text-xs text-purple-200 space-y-1.5 animate-fadeIn">
          <div className="font-bold text-white flex items-center gap-1">
            <Share className="w-4 h-4 text-purple-400" /> How to Install on iOS (iPhone/iPad):
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-200">
            <li>Tap the <strong>Share</strong> icon in Safari bottom bar.</li>
            <li>Scroll down & tap <strong>"Add to Home Screen"</strong>.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
