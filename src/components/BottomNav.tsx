import React from 'react';
import { Home, Navigation, MapPin, AlertTriangle, Users, User, Settings } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenSOS: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate, onOpenSOS }) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'safe-route' as TabType, label: 'Safe Route', icon: Navigation },
    { id: 'map' as TabType, label: 'Live Map', icon: MapPin },
    { id: 'reports' as TabType, label: 'Reports', icon: AlertTriangle },
    { id: 'contacts' as TabType, label: 'Contacts', icon: Users },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-purple-900/40 px-2 py-2.5 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 relative ${
                isActive
                  ? 'text-purple-200 font-bold bg-purple-950/80 border border-purple-500/60 scale-105 glow-purple'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-purple-400 scale-110' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium whitespace-nowrap">{item.label}</span>
              {isActive && (
                <span className="absolute -top-1 w-2 h-0.5 rounded-full bg-purple-400"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
