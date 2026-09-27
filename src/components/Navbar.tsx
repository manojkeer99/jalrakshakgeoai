import React from 'react';
import { 
  ShieldAlert, 
  Map, 
  Radio, 
  Cpu, 
  LifeBuoy, 
  AlertTriangle, 
  Award, 
  PhoneCall,
  Activity
} from 'lucide-react';
import { ActiveTab } from '../types/disaster';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingSosCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingSosCount,
}) => {
  const tabs = [
    { id: 'geospatial_ops', label: 'GIS Command Map', icon: Map },
    { id: 'citizen_sos', label: 'Citizen SOS Beacon', icon: Radio },
    { id: 'ai_predictive', label: 'AI Flood Predictor', icon: Cpu },
    { id: 'ndrf_command', label: 'NDRF Triage Console', icon: LifeBuoy, badge: pendingSosCount },
    { id: 'mining_audit', label: 'Mining Impact Audit', icon: AlertTriangle },
    { id: 'sih_blueprint', label: 'SIH 26013 Blueprint', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & National Problem Statement ID */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-700 text-white rounded-lg shadow-lg shadow-cyan-950/50">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white font-mono">
                  JALRAKSHAK <span className="text-cyan-400">GEOAI</span>
                </span>
                <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-cyan-300">
                  SIH 26013
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sentinel-1 SAR · Cartosat DEM · Gemini 3.8</span>
              </div>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-mono font-bold rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* National Disaster Helplines */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-rose-950/40 border border-rose-900/60 rounded-lg text-rose-300 text-xs font-mono">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>NDMA 1070 | ERSS 112</span>
            </div>
            <button
              onClick={() => setActiveTab('citizen_sos')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trigger</span> SOS
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-900 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 text-[11px] transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1 bg-rose-600 text-white text-[9px] font-mono rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
