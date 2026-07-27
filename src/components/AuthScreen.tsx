import React, { useState } from 'react';
import { Shield, Lock, Mail, User, Phone, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('Sophia Vance');
  const [email, setEmail] = useState('sophia.vance@saferoute.org');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+1 (555) 382-9012');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user: UserProfile = {
        id: `user-${Date.now()}`,
        fullName: fullName || 'Sophia Vance',
        email: email || 'sophia.vance@saferoute.org',
        phone: phone || '+1 (555) 382-9012',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        bloodGroup: 'O+',
        medicalNotes: 'Asthma inhaler in outer bag pocket. No known drug allergies.',
        secretVoiceCommand: 'SafeRoute Help',
        isLoggedIn: true,
        liveSharingEnabled: true,
        batteryLevel: 86,
        safetyScore: 92,
      };

      setIsLoading(false);
      onLoginSuccess(user);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-purple-900/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        
        {/* Top Glow Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-xl shadow-purple-900/50 border border-purple-400/30 mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
            SafeRoute
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            AI-Powered Women's Personal Safety & Navigation App
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 rounded-xl transition ${
              !isSignUp ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 rounded-xl transition ${
              isSignUp ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sophia Vance"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white"
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sophia@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (For Emergency Alerts)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 382-9012"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white"
                  required
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2 transition active:scale-98 border border-purple-400/30"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isSignUp ? 'Create SafeRoute Account' : 'Secure Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Sign In */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <button
            onClick={handleSubmit}
            className="text-xs font-bold text-purple-300 hover:text-white transition flex items-center justify-center gap-1.5 mx-auto"
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> Fast Demo Login (Sophia Vance)
          </button>
        </div>

      </div>
    </div>
  );
};
