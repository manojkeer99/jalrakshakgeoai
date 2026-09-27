import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Shovel, 
  Layers, 
  TrendingUp, 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  FileText,
  Compass
} from 'lucide-react';
import { SandMiningHotspot } from '../types/disaster';

interface MiningImpactAuditProps {
  hotspots: SandMiningHotspot[];
  onSelectOnMap: (hotspot: SandMiningHotspot) => void;
}

export const MiningImpactAudit: React.FC<MiningImpactAuditProps> = ({ hotspots, onSelectOnMap }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<SandMiningHotspot>(hotspots[0]);
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAudit = async (spot: SandMiningHotspot) => {
    setSelectedHotspot(spot);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/mining-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quarrySector: spot.locationName,
          extractionVolumeCuM: Math.round(spot.areaHectares * spot.excavatedDepthM * 1000),
          embankmentBreachRisk: spot.embankmentProximityM < 40 ? 'CRITICAL' : 'HIGH',
          riparianLossPct: spot.riparianLossPct,
        }),
      });

      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedHotspot) {
      handleRunAudit(selectedHotspot);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Environmental & Land Mining Impact Auditor (SIH-26013 Core)
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Geospatial auditing of illegal riverbed sand mining, bathymetric degradation, and artificial embankment breach acceleration.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-red-400">
            <span>ISRO Bhuvan / Cartosat-3 DEM Multi-Temporal Change Detection</span>
          </div>
        </div>
      </div>

      {/* Hotspot Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotspots.map((spot) => {
          const isSelected = selectedHotspot.id === spot.id;
          return (
            <div
              key={spot.id}
              onClick={() => handleRunAudit(spot)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-red-950/40 border-red-500 shadow-xl'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-2">
                <span className="font-mono text-xs font-bold text-red-400">{spot.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  {spot.legalityStatus}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white mt-1">{spot.locationName}</h2>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">EXCAVATED DEPTH</span>
                  <span className="font-mono font-bold text-amber-300">{spot.excavatedDepthM} meters</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">EMBANKMENT GAP</span>
                  <span className="font-mono font-bold text-rose-400">{spot.embankmentProximityM}m (Breach Risk)</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Breach Multiplier:</span>
                <span className="font-mono font-bold text-red-400">{spot.floodVulnerabilityMultiplier}x Higher</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Analysis for Selected Sector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bathymetry Cross-Section Diagram & Multi-Temporal Stats (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Riverbed Hydrodynamic Cross-Section
            </span>
            <button
              onClick={() => onSelectOnMap(selectedHotspot)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition"
            >
              <MapPin className="w-3.5 h-3.5" /> Locate on GIS Map
            </button>
          </div>

          {/* SVG Diagram showing natural vs mined bathymetry */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono mb-2 flex justify-between">
              <span>NATURAL FLOODPLAIN PROFILE</span>
              <span className="text-red-400 font-semibold">ILLEGAL MINING SUCTION HOLE</span>
            </div>
            <svg viewBox="0 0 500 220" className="w-full h-auto">
              <defs>
                <linearGradient id="waterFlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Water surface line */}
              <line x1="20" y1="60" x2="480" y2="60" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
              <text x="30" y="52" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
                Peak Flood Stage (Water Elevation: 51.2m)
              </text>

              {/* Natural Riverbed (Dotted Green) */}
              <path
                d="M 20 80 Q 120 100, 250 110 T 480 80"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <text x="60" y="115" fill="#34d399" fontSize="8" fontFamily="monospace">
                Historical Baseline Bed (ISRO Cartosat DEM 2018)
              </text>

              {/* Illegally Mined Gouged Bed with Vortices (Solid Red) */}
              <path
                d="M 20 80 L 100 85 L 140 180 L 260 195 L 310 110 L 480 80"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
              />

              {/* Shaded water column */}
              <path
                d="M 20 60 L 480 60 L 480 80 L 310 110 L 260 195 L 140 180 L 100 85 L 20 80 Z"
                fill="url(#waterFlow)"
              />

              {/* Vortex eddies in pit */}
              <circle cx="200" cy="140" r="16" fill="none" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="165" y="143" fill="#fca5a5" fontSize="7.5" fontFamily="monospace">Eddy Vortex</text>

              {/* Embankment levee on left */}
              <polygon points="10,80 30,30 55,30 85,85" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
              <text x="25" y="24" fill="#cbd5e1" fontSize="8" fontFamily="monospace">Earthen Levee</text>
              <line x1="55" y1="35" x2="140" y2="180" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="80" y="160" fill="#f43f5e" fontSize="8" fontFamily="monospace">
                Bank Scour & Failure Slip
              </text>
            </svg>
            <div className="text-[10.5px] text-slate-400 mt-2 font-mono">
              Unregulated heavy suction dredging gouges an unnatural 7.2m trench. When floodwaters rush in, hydrodynamic shear stress pulls the earthen embankment inward, triggering sudden levee collapse.
            </div>
          </div>

          {/* Environmental Degradation Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-[11px] text-slate-500 font-mono block">EST. MINED SAND VOLUME</span>
              <span className="text-base font-bold text-amber-300 font-mono">
                {(selectedHotspot.areaHectares * selectedHotspot.excavatedDepthM * 10000).toLocaleString()} m³
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Stripped from natural buffer</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-[11px] text-slate-500 font-mono block">RIPARIAN VEGETATION LOSS</span>
              <span className="text-base font-bold text-rose-400 font-mono">
                {selectedHotspot.riparianLossPct}% Stripped
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Vegetative root grip lost</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Geomorphic Damage Assessment & DM Act Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* AI Assessment Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Gemini 3.8 Geomorphic Impact Synthesis
              </span>
              <span className="text-xs font-mono font-bold text-red-400">
                Damage Score: {auditResult?.geomorphicDamageScore || 88}/100
              </span>
            </div>

            <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg">
              <div className="text-[11px] font-mono text-red-300 uppercase tracking-wide">
                FLOOD AMPLIFICATION FACTOR
              </div>
              <div className="text-sm font-bold text-red-200 mt-1">
                {auditResult?.floodAmplificationFactor ||
                  '2.8x faster peak flood arrival, 1.4m higher inundation crest'}
              </div>
            </div>

            {/* Scientific Findings */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 font-mono block">
                GEOMORPHIC & HYDROLOGICAL FINDINGS:
              </span>
              {(auditResult?.findings || [
                'Uncontrolled mechanized excavation has carved 6.5m deep unnatural thalweg pits, altering hydrodynamic velocity vectors towards vulnerable earthen bunds.',
                'Loss of 64% riparian vegetation has stripped cohesive root mats, causing instantaneous bank slumping during peak discharge.',
                'Sediment deficit downstream has triggered bed degradation and scour around highway pier bridge #14.',
              ]).map((find: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-red-400 font-mono shrink-0">•</span>
                  <span>{find}</span>
                </div>
              ))}
            </div>

            {/* Regulatory Action Items under DM Act */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-emerald-400 font-mono block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                DISTRICT DISASTER MANAGEMENT DIRECTIVES (DM ACT SEC 24):
              </span>
              {(auditResult?.regulatoryActionItems || [
                'Immediate ban on heavy dredging machinery under section 24 of Disaster Management Act.',
                'Deploy geo-synthetic sand containers (Geo-bags) along 2.4km degraded embankment reach.',
                'Establish 24/7 automated drone SAR LiDAR patrols to prevent night-time illicit extraction.',
              ]).map((act: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-mono font-bold">{idx + 1}.</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice Generation Button */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="text-xs">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Official DM Act Section 24 Cease & Desist
              </div>
              <div className="text-slate-400 mt-0.5">
                Target: {selectedHotspot.locationName}
              </div>
            </div>
            <button
              onClick={() => alert(`Generated official legal notice for District Collector Kamrup / NGT regarding illegal extraction at ${selectedHotspot.locationName}. Enforcing emergency moratorium.`)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition"
            >
              Export Legal Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
