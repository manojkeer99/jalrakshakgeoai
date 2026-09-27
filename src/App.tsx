import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GeospatialMap } from './components/GeospatialMap';
import { CitizenSosView } from './components/CitizenSosView';
import { AiPredictiveEngine } from './components/AiPredictiveEngine';
import { NdrfIncidentBoard } from './components/NdrfIncidentBoard';
import { MiningImpactAudit } from './components/MiningImpactAudit';
import { SihBlueprintView } from './components/SihBlueprintView';
import { 
  INITIAL_RIVER_GAUGES, 
  INITIAL_SOS_ALERTS, 
  INITIAL_MINING_HOTSPOTS, 
  INITIAL_SHELTERS 
} from './data/mockDisasterData';
import { ActiveTab, SosAlert, SandMiningHotspot } from './types/disaster';
import { Radio, AlertTriangle, ShieldCheck, Activity, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('geospatial_ops');
  const [gauges, setGauges] = useState(INITIAL_RIVER_GAUGES);
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>(INITIAL_SOS_ALERTS);
  const [miningHotspots] = useState(INITIAL_MINING_HOTSPOTS);
  const [shelters] = useState(INITIAL_SHELTERS);
  const [selectedSosId, setSelectedSosId] = useState<string | undefined>(undefined);
  const [bannerNotice, setBannerNotice] = useState<string | null>(
    'ALERT: Brahmaputra River at Guwahati DC Court Gauge has reached 50.12m (+0.18m/hr), crossing warning threshold. Level-3 Red Common Alerting Protocol active.'
  );

  // Dispatch rescue boat to SOS
  const handleDispatchSos = (sosId: string, unitName: string) => {
    setSosAlerts((prev) =>
      prev.map((alert) =>
        alert.id === sosId
          ? {
              ...alert,
              status: 'DISPATCHED',
              assignedUnit: unitName,
              etaMinutes: Math.floor(10 + Math.random() * 15),
            }
          : alert
      )
    );
    setBannerNotice(`DISPATCH ORDER CONFIRMED: ${unitName} deployed to Incident ${sosId}.`);
  };

  // Mark SOS as Evacuated
  const handleMarkRescued = (sosId: string) => {
    setSosAlerts((prev) =>
      prev.map((alert) =>
        alert.id === sosId
          ? {
              ...alert,
              status: 'RESCUED',
            }
          : alert
      )
    );
    setBannerNotice(`EVACUATION COMPLETE: Victims at ${sosId} transferred to designated high ground shelter.`);
  };

  // Add newly triggered Citizen SOS
  const handleNewCitizenSos = (newAlert: SosAlert) => {
    setSosAlerts((prev) => [newAlert, ...prev]);
    setSelectedSosId(newAlert.id);
    setBannerNotice(`NEW CRITICAL SOS RECEIVED: ${newAlert.name} (${newAlert.id}) reported ${newAlert.waterLevel}. Triage priority: ${newAlert.triagePriority}`);
  };

  // Select on map
  const handleSelectSos = (sos: SosAlert) => {
    setSelectedSosId(sos.id);
  };

  const handleSelectMiningOnMap = (hotspot: SandMiningHotspot) => {
    setActiveTab('geospatial_ops');
  };

  const pendingSosCount = sosAlerts.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingSosCount={pendingSosCount}
      />

      {/* Emergency Alert Ticker */}
      {bannerNotice && (
        <div className="bg-gradient-to-r from-rose-950 via-red-950 to-slate-950 border-b border-rose-900/60 px-4 py-2 text-xs flex items-center justify-between text-rose-200">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-hidden w-full">
            <span className="p-1 bg-rose-600 text-white rounded shrink-0 flex items-center gap-1 font-mono font-bold text-[10px]">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE BULLETIN
            </span>
            <div className="truncate font-mono">{bannerNotice}</div>
          </div>
          <button
            onClick={() => setBannerNotice(null)}
            className="text-rose-400 hover:text-white shrink-0 ml-3 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'geospatial_ops' && (
          <div className="space-y-6">
            {/* Quick telemetry indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-400">SAR SATELLITE:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  SENTINEL-1B ORBIT 244
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-400">DEM CONTOURS:</span>
                <span className="text-cyan-400 font-bold">ISRO CARTOSAT 2.5m</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-400">ACTIVE SOS:</span>
                <span className="text-rose-400 font-bold">{pendingSosCount} PENDING DISPATCH</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-400">HIGH SHELTERS:</span>
                <span className="text-teal-400 font-bold">4 ZONES (8,900 CAP)</span>
              </div>
            </div>

            {/* Interactive GIS Map */}
            <GeospatialMap
              gauges={gauges}
              sosAlerts={sosAlerts}
              miningHotspots={miningHotspots}
              shelters={shelters}
              onSelectSos={handleSelectSos}
              onDispatchSos={handleDispatchSos}
              selectedSosId={selectedSosId}
            />

            {/* Quick Action Navigation Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => setActiveTab('citizen_sos')}
                className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left transition group"
              >
                <div className="text-xs font-mono text-rose-400 font-bold flex items-center justify-between">
                  <span>CITIZEN SOS INTERFACE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Trigger Emergency Distress Beacon
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  1-tap GPS, water level, trapped individuals, and offline SMS mesh payload.
                </div>
              </button>

              <button
                onClick={() => setActiveTab('ai_predictive')}
                className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition group"
              >
                <div className="text-xs font-mono text-cyan-400 font-bold flex items-center justify-between">
                  <span>AI PREDICTIVE ENGINE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Run Gemini Hydrological Forecast
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Simulate rainfall, dam release, mining breach risks, and 5-language CAP warnings.
                </div>
              </button>

              <button
                onClick={() => setActiveTab('mining_audit')}
                className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-red-500/50 rounded-xl text-left transition group"
              >
                <div className="text-xs font-mono text-amber-400 font-bold flex items-center justify-between">
                  <span>SAND MINING AUDIT</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Riverbed Degradation & Levee Scour
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Examine how illegal sand dredging strips natural floodplains and speeds levee collapse.
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'citizen_sos' && (
          <CitizenSosView
            onSosDispatched={handleNewCitizenSos}
            shelters={shelters}
          />
        )}

        {activeTab === 'ai_predictive' && (
          <AiPredictiveEngine />
        )}

        {activeTab === 'ndrf_command' && (
          <NdrfIncidentBoard
            alerts={sosAlerts}
            onDispatchAlert={handleDispatchSos}
            onMarkRescued={handleMarkRescued}
            onSelectAlertOnMap={(alert) => {
              setSelectedSosId(alert.id);
              setActiveTab('geospatial_ops');
            }}
          />
        )}

        {activeTab === 'mining_audit' && (
          <MiningImpactAudit
            hotspots={miningHotspots}
            onSelectOnMap={handleSelectMiningOnMap}
          />
        )}

        {activeTab === 'sih_blueprint' && (
          <SihBlueprintView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">JALRAKSHAK GEOAI</span>
            <span>·</span>
            <span>JalRakshak GeoAi platform</span>
          </div>
          <div>
            Built with Sentinel-1 SAR · Cartosat DEM · NDMA CAP 2.1
          </div>
        </div>
      </footer>
    </div>
  );
}
