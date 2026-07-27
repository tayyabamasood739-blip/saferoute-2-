import React, { useState } from 'react';
import { Users, UserPlus, Phone, Mail, Star, Trash2, Send, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onRemoveContact: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onSendTestAlert: () => void;
}

export const EmergencyContactsManager: React.FC<EmergencyContactsProps> = ({
  contacts,
  onAddContact,
  onRemoveContact,
  onSetPrimary,
  onSendTestAlert,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Mother');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [testSent, setTestSent] = useState(false);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name,
      relation,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      isPrimary: contacts.length === 0,
      notifySMS: true,
      notifyCall: true,
      avatarColor: 'bg-indigo-600',
    };

    onAddContact(newContact);
    setName('');
    setPhone('');
    setEmail('');
    setIsAddModalOpen(false);
  };

  const handleTestTrigger = () => {
    onSendTestAlert();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/80 via-indigo-950/80 to-slate-900 border border-purple-800/40 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-purple-400" /> Trusted Safety Network
          </div>
          <h2 className="font-heading font-extrabold text-xl text-white">Emergency Contacts</h2>
          <p className="text-slate-300 text-xs mt-1">
            These trusted contacts automatically receive your live GPS location during trips & emergency SOS triggers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-950 shrink-0 flex items-center gap-1 transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Contact</span>
        </button>
      </div>

      {/* Test Alert Button */}
      <div className="bg-slate-900 border border-purple-900/40 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div>
          <span className="font-bold text-sm text-white block">Test SOS Notification System</span>
          <span className="text-xs text-slate-400">Simulate sending a test SMS alert to your primary contacts.</span>
        </div>
        <button
          onClick={handleTestTrigger}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            testSent
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/50'
          }`}
        >
          {testSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          <span>{testSent ? 'Test Sent!' : 'Send Test Alert'}</span>
        </button>
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map((c) => (
          <div
            key={c.id}
            className={`p-4 rounded-3xl border transition shadow-xl ${
              c.isPrimary
                ? 'bg-slate-900 border-purple-500 shadow-purple-950/40'
                : 'bg-slate-900/70 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${c.avatarColor} text-white font-extrabold text-base flex items-center justify-center shadow-md`}>
                  {c.name.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-white">{c.name}</h3>
                    {c.isPrimary && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 border border-purple-600 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Primary
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-purple-300 font-semibold block">{c.relation}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {!c.isPrimary && (
                  <button
                    onClick={() => onSetPrimary(c.id)}
                    className="p-2 text-slate-400 hover:text-amber-400 transition"
                    title="Make Primary Contact"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onRemoveContact(c.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 transition"
                  title="Remove Contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contact details */}
            <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 hover:text-purple-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {c.phone}
              </a>
              <span className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> {c.email}
              </span>
            </div>

            {/* Notification Toggles */}
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-3">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SMS GPS Alerts Enabled
              </span>
              <span>•</span>
              <span className="text-purple-300 font-semibold">Auto-Call on SOS</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-purple-800 rounded-3xl p-6 text-white shadow-2xl relative">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-white">Add Emergency Contact</h3>
            <p className="text-xs text-slate-400 mt-1">This person will receive immediate SMS & live location when SOS triggers.</p>

            <form onSubmit={handleCreateContact} className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Relationship</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Spouse / Partner">Spouse / Partner</option>
                  <option value="Friend / Roommate">Friend / Roommate</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl shadow-lg transition"
              >
                Save Trusted Contact
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
