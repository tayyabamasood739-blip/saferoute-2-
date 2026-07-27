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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-purple-900/30 px-2 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-purple-300 font-bold bg-purple-900/30 border border-purple-700/50 scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
