import React, { useState } from 'react';
import { 
  Cpu, 
  Waves, 
  CloudRain, 
  AlertTriangle, 
  Activity, 
  Compass, 
  ShieldAlert, 
  Languages, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  RefreshCw,
  Gauge
} from 'lucide-react';
import { FloodPredictionResult, DisasterAdvisories } from '../types/disaster';

export const AiPredictiveEngine: React.FC = () => {
  // Input parameters
  const [basin, setBasin] = useState('Brahmaputra Valley Reach (Kamrup/Guwahati)');
  const [rainfallMmHr, setRainfallMmHr] = useState(68);
  const [damDischarge, setDamDischarge] = useState(48500);
  const [cartosatSlope, setCartosatSlope] = useState(1.8);
  const [sarDelta, setSarDelta] = useState(38);
  const [miningSeverity, setMiningSeverity] = useState(8);
  const [soilSat, setSoilSat] = useState(94);
  const [vulnerablePop, setVulnerablePop] = useState(185000);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<FloodPredictionResult | null>(null);

  // Multilingual advisory states
  const [selectedLang, setSelectedLang] = useState<'english' | 'hindi' | 'bengali' | 'assamese' | 'malayalam'>('english');
  const [advisories, setAdvisories] = useState<DisasterAdvisories | null>(null);
  const [isLoadingAdvisories, setIsLoadingAdvisories] = useState(false);
  const [copiedLang, setCopiedLang] = useState(false);

  // Run AI Flood Prediction
  const handleRunPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/flood-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionName: basin,
          rainfallMmHr,
          damDischargeCusecs: damDischarge,
          cartosatSlopeGrade: cartosatSlope,
          sentinelSarInundationDelta: sarDelta,
          sandMiningSeverity: miningSeverity,
          soilSaturationPct: soilSat,
          vulnerablePopulation: vulnerablePop,
        }),
      });

      const data = await res.json();
      setPrediction(data);

      // Also trigger multilingual advisories
      handleFetchAdvisories(data.riskLevel || 'CRITICAL');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Multilingual CAP Advisories
  const handleFetchAdvisories = async (riskLevel: string) => {
    setIsLoadingAdvisories(true);
    try {
      const res = await fetch('/api/gemini/generate-advisories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floodSeverity: riskLevel,
          affectedBasin: basin,
          risingMetersPerHr: 0.35,
          safeShelter: 'Guwahati University & District Stadium High Complex',
          emergencyNumber: '1070 / 112',
        }),
      });
      const data = await res.json();
      if (data.advisories) {
        setAdvisories(data.advisories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAdvisories(false);
    }
  };

  // Initial auto run on mount if not yet run
  React.useEffect(() => {
    handleRunPrediction();
  }, []);

  const handleCopyAdvisory = () => {
    if (!advisories) return;
    navigator.clipboard.writeText(advisories[selectedLang]);
    setCopiedLang(true);
    setTimeout(() => setCopiedLang(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Engine Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Predictive AI & Geospatial Hydrological Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gemini 3.8 multi-modal fusion of Sentinel-1 SAR microwave backscatter, ISRO Cartosat DEM flow accumulation, and river sand mining degradation.
          </p>
        </div>
        <button
          onClick={handleRunPrediction}
          disabled={isLoading}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Running Simulation...' : 'Re-Run AI Hydrological Model'}</span>
        </button>
      </div>

      {/* Main Grid: Controls + AI Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Hydro Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Hydrological Telemetry Controls
            </h2>
            <span className="text-[11px] text-cyan-400 font-mono">Live Inputs</span>
          </div>

          {/* Basin Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Monitored River Basin / Sub-Basin
            </label>
            <select
              value={basin}
              onChange={(e) => setBasin(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Brahmaputra Valley Reach (Kamrup/Guwahati)">Brahmaputra Valley Reach (Kamrup/Guwahati)</option>
              <option value="Mahanadi Delta (Cuttack-Kendrapara Sector)">Mahanadi Delta (Cuttack-Kendrapara Sector)</option>
              <option value="Yamuna Floodplain (Delhi NCT & Wazirabad Reach)">Yamuna Floodplain (Delhi NCT & Wazirabad Reach)</option>
              <option value="Godavari Lower Basin (Rajahmundry / Polavaram)">Godavari Lower Basin (Rajahmundry / Polavaram)</option>
            </select>
          </div>

          {/* Rainfall Intensity Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Rainfall Intensity (IMD Doppler Radar)
              </span>
              <span className="font-mono font-bold text-cyan-300">{rainfallMmHr} mm/hr</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={rainfallMmHr}
              onChange={(e) => setRainfallMmHr(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Moderate (10mm)</span>
              <span>Cloudburst (150mm)</span>
            </div>
          </div>

          {/* Upstream Dam Discharge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-blue-400" /> Upstream Reservoir Discharge
              </span>
              <span className="font-mono font-bold text-blue-300">{damDischarge.toLocaleString()} cusecs</span>
            </div>
            <input
              type="range"
              min="10000"
              max="120000"
              step="5000"
              value={damDischarge}
              onChange={(e) => setDamDischarge(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* ISRO Cartosat DEM Slope */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" /> ISRO Cartosat DEM Slope Factor
              </span>
              <span className="font-mono font-bold text-emerald-300">{cartosatSlope}% Gradient</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={cartosatSlope}
              onChange={(e) => setCartosatSlope(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 font-mono">
              Flat floodplain ({'<'}2%) retains water 4.5x longer than undulating terrain.
            </div>
          </div>

          {/* Sentinel-1 SAR Backscatter Delta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" /> Sentinel SAR Surface Water Spread Delta
              </span>
              <span className="font-mono font-bold text-sky-300">+{sarDelta}% expansion</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              value={sarDelta}
              onChange={(e) => setSarDelta(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Sand Mining & Quarrying Degradation Index */}
          <div className="space-y-1.5 p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-300 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Riverbed Sand Mining Degradation
              </span>
              <span className="font-mono font-bold text-red-400">{miningSeverity}/10 (Severe)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={miningSeverity}
              onChange={(e) => setMiningSeverity(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <p className="text-[10.5px] text-red-200/70 leading-relaxed">
              Illicit suction dredging strips natural riverbank toe-weight, increases eddy vortexing, and triples levee breach probability.
            </p>
          </div>

          {/* Soil Saturation */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Soil Saturation: <strong className="text-white font-mono">{soilSat}%</strong></span>
            <span>Vulnerable Pop: <strong className="text-white font-mono">{vulnerablePop.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Right Column: AI Predictions & Action Orders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
              <div className="text-[11px] text-slate-400 font-mono">RISK LEVEL</div>
              <div className={`text-xl font-black mt-1 font-mono ${
                prediction?.riskLevel === 'CRITICAL' ? 'text-rose-500 animate-pulse' : 'text-amber-400'
              }`}>
                {prediction?.riskLevel || 'CRITICAL'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Common Alert Protocol L3</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
              <div className="text-[11px] text-slate-400 font-mono">PEAK FLOOD ETA</div>
              <div className="text-xl font-black text-cyan-400 mt-1 font-mono">
                {prediction?.peakFloodHours || 4} Hours
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Arrival Window</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
              <div className="text-[11px] text-slate-400 font-mono">SUBMERGED AREA</div>
              <div className="text-xl font-black text-sky-400 mt-1 font-mono">
                {prediction?.projectedAreaSqKm || 320} km²
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Sentinel-1 Projected</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
              <div className="text-[11px] text-slate-400 font-mono">BREACH PROBABILITY</div>
              <div className="text-xl font-black text-red-400 mt-1 font-mono">
                {prediction?.breachProbability || 88}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Embankment Failure</div>
            </div>
          </div>

          {/* AI Hydrological & Mining Assessment */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Gemini 3.8 Multi-Modal Hydrological Synthesis
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Grounding: Sentinel SAR + Cartosat DEM
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {prediction?.hydrologicalAssessment ||
                'Running deep multi-modal synthesis on satellite passes and terrain elevations...'}
            </p>
          </div>

          {/* Critical Sectors at Risk */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              High-Risk Village Sectors & Evacuation Priority
            </span>
            <div className="space-y-2">
              {(prediction?.criticalSectors || [
                { name: 'Lower Embankment Ward 4', urgency: 'Immediate (0-2h)', estimatedDepthMeters: 2.8, evacuatedEst: '12,400 / 18,000' },
                { name: 'Riverbank Quarry Zone (Sand Mining Depleted)', urgency: 'Immediate (0-2h)', estimatedDepthMeters: 3.4, evacuatedEst: '4,200 / 6,500' },
                { name: 'North Highway Bypass Km 42', urgency: 'Warning (2-6h)', estimatedDepthMeters: 1.2, evacuatedEst: 'Transit cut-off' },
              ]).map((sec, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{sec.name}</div>
                    <div className="text-[11px] text-slate-400">
                      Evacuation Urgency: <span className="text-rose-400 font-semibold">{sec.urgency}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-cyan-300 font-bold">~{sec.estimatedDepthMeters}m Depth</div>
                    <div className="text-[10px] text-slate-500 font-mono">{sec.evacuatedEst}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NDRF Emergency Directives */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              NDRF & District Magistrate Tactical Directives
            </span>
            <div className="space-y-1.5">
              {(prediction?.ndrfDirectives || [
                'Pre-position 12 Inflatable Rescue Boats (IRBs) at Highway Km 42 staging node.',
                'Issue Level-3 Red Common Alerting Protocol (CAP) sirens to Panchayat Wards 7, 8, 12.',
                'Close sluice gates 4-7 on Western Canal to prevent backflow into populated urban fringe.',
                'Activate high-elevation community shelters at Government Polytechnic and St. Jude High School.',
              ]).map((dir, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="font-mono font-bold text-cyan-400">{i + 1}.</span>
                  <span>{dir}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual CAP Emergency Advisory Broadcast Unit */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded">
                <Languages className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white">
                Multi-Lingual CAP Emergency Broadcast Generator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Standardized NDMA Common Alerting Protocol sirens and SMS broadcasts in 5 Indian languages.
            </p>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            {[
              { id: 'english', label: 'English' },
              { id: 'hindi', label: 'हिन्दी' },
              { id: 'bengali', label: 'বাংলা' },
              { id: 'assamese', label: 'অসমীয়া' },
              { id: 'malayalam', label: 'മലയാളം' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLang(tab.id as any)}
                className={`px-3 py-1.5 rounded-md transition ${
                  selectedLang === tab.id
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Language Advisory Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative">
          {isLoadingAdvisories ? (
            <div className="flex items-center justify-center py-6 gap-2 text-xs text-slate-400 font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Generating regional disaster translation...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                  OFFICIAL CAP ALERT BROADCAST PAYLOAD
                </span>
                <button
                  onClick={handleCopyAdvisory}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-mono transition"
                >
                  {copiedLang ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLang ? 'Copied!' : 'Copy Broadcast Text'}</span>
                </button>
              </div>

              <p className="text-sm font-medium text-slate-100 leading-relaxed font-sans">
                {advisories
                  ? advisories[selectedLang]
                  : `FLASH FLOOD EMERGENCY WARNING: River water is rising at 0.35m/hr. Residents in low-lying zones must evacuate immediately to Guwahati University High Shelter. Do not cross flooded roads. Call 1070 / 112 for NDRF rescue.`}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-500 font-mono">
                <span>Channels: Cell Broadcast Siren (CBS) · All-India Radio · SMS Gateway</span>
                <span>Encoding: UTF-8 / NDMA Standard 2.1</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
