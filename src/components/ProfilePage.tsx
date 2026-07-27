import React, { useState } from 'react';
import { User, Shield, Phone, Mail, Heart, Edit2, LogOut, FileText, CheckCircle2 } from 'lucide-react';
import { UserProfile, TabType } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onNavigate: (tab: TabType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateProfile,
  onLogout,
  onNavigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);
  const [medicalNotes, setMedicalNotes] = useState(user.medicalNotes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName,
      phone,
      bloodGroup,
      medicalNotes,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Profile Card Banner */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 border border-purple-800/50 rounded-3xl p-6 text-white shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative inline-block mx-auto mb-3">
          <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-3xl object-cover border-4 border-purple-400/80 shadow-2xl mx-auto" />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
        </div>

        <h2 className="font-heading font-extrabold text-2xl text-white">{user.fullName}</h2>
        <p className="text-purple-300 text-xs font-medium">{user.email}</p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-900/80 border border-purple-600/60 text-purple-200">
            Safety Score: {user.safetyScore}%
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300">
            Active Protection
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950 border border-emerald-600 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Profile & Medical Emergency Info Updated!
        </div>
      )}

      {/* Emergency Medical ID Card */}
      <div className="bg-slate-900 border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" /> Emergency Medical ID Card
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-purple-300 hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> {isEditing ? 'Cancel' : 'Edit Info'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Medical Notes / Allergies</label>
              <textarea
                rows={2}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
              <span className="font-extrabold text-rose-400 text-base">{user.bloodGroup}</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
              <span className="font-bold text-purple-200">{user.phone}</span>
            </div>

            <div className="col-span-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Medical Instructions & Allergies</span>
              <p className="text-slate-300 leading-snug">{user.medicalNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Settings & Quick Nav */}
      <div className="space-y-2">
        <button
          onClick={() => onNavigate('settings')}
          className="w-full p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-left text-xs text-white font-bold flex items-center justify-between transition"
        >
          <span>App & Voice Command Settings</span>
          <span className="text-purple-400 font-normal">Configure →</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full p-4 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 rounded-2xl text-left text-xs text-rose-300 font-bold flex items-center justify-between transition"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </span>
        </button>
      </div>

    </div>
  );
};
