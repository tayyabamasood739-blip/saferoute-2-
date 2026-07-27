import React, { useState } from 'react';
import { Settings, Mic, Shield, Volume2, Bell, MapPin, Camera, CheckCircle2, Sliders } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  isVoiceListening: boolean;
  setIsVoiceListening: (val: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateUser,
  isVoiceListening,
  setIsVoiceListening,
}) => {
  const [secretCommand, setSecretCommand] = useState(user.secretVoiceCommand);
  const [liveSharing, setLiveSharing] = useState(user.liveSharingEnabled);
  const [silentMode, setSilentMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      secretVoiceCommand: secretCommand,
      liveSharingEnabled: liveSharing,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-900 border border-purple-800/40 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-purple-400" /> System Preferences
        </div>
        <h2 className="font-heading font-extrabold text-xl text-white">App & Emergency Settings</h2>
        <p className="text-slate-300 text-xs mt-1">
          Configure hands-free voice SOS triggers, silent alarm modes, and live GPS sharing timers.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950 border border-emerald-600 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Settings updated successfully!
        </div>
      )}

      {/* Secret Voice Command Card */}
      <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-purple-900/40 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-heading font-bold text-sm text-white">Secret Voice Activated SOS</h3>
              <p className="text-[11px] text-slate-400">Triggers SOS hands-free when spoken</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsVoiceListening(!isVoiceListening)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
              isVoiceListening
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isVoiceListening ? 'Listening ON' : 'Disabled'}
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Secret Keyword Phrase
          </label>
          <input
            type="text"
            value={secretCommand}
            onChange={(e) => setSecretCommand(e.target.value)}
            placeholder="e.g. SafeRoute Help or Code Red"
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white"
            required
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Choose a unique phrase easy for you to speak in emergencies but difficult for strangers to guess.
          </p>
        </div>

        {/* Alarm & Silent Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Silent SOS Alert</span>
              <span className="text-[10px] text-slate-400">Sends alerts without loud audio siren</span>
            </div>
            <input
              type="checkbox"
              checked={silentMode}
              onChange={(e) => setSilentMode(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Auto Location Sharing on Trips</span>
              <span className="text-[10px] text-slate-400">Broadcasting live GPS link to primary contacts during active route</span>
            </div>
            <input
              type="checkbox"
              checked={liveSharing}
              onChange={(e) => setLiveSharing(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl shadow transition"
        >
          Save System Preferences
        </button>
      </form>

      {/* Permissions Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" /> Device Permission Diagnostic
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400" /> High-Accuracy GPS Location
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Granted
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-2 text-slate-300">
              <Mic className="w-4 h-4 text-purple-400" /> Microphone (Voice Command)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Granted
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-2 text-slate-300">
              <Camera className="w-4 h-4 text-blue-400" /> Camera (Hazard Photo Upload)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Granted
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
