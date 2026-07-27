import React, { useState } from 'react';
import { Bell, ShieldAlert, AlertTriangle, Navigation, CheckCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAllRead,
  onClearNotifications,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-purple-400" /> Safety Alert Center
          </div>
          <h2 className="font-heading font-extrabold text-xl text-white">Notifications</h2>
          <p className="text-slate-300 text-xs mt-1">Real-time route advisories & contact readiness checks.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl border border-slate-700 transition"
            title="Mark All Read"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button
            onClick={onClearNotifications}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 transition"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'emergency', label: 'Emergency' },
          { id: 'safety_warning', label: 'Warnings' },
          { id: 'route_update', label: 'Route Updates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
              filter === tab.id
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 p-6 text-slate-400 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((n) => {
            const isHigh = n.severity === 'high' || n.type === 'emergency';
            return (
              <div
                key={n.id}
                className={`p-4 rounded-3xl border transition shadow-lg ${
                  !n.read
                    ? 'bg-slate-900 border-purple-600/80'
                    : 'bg-slate-900/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                    isHigh ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-purple-950 text-purple-400 border border-purple-800'
                  }`}>
                    {n.type === 'emergency' ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : n.type === 'safety_warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Navigation className="w-5 h-5 text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-bold text-sm text-white">{n.title}</h3>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
