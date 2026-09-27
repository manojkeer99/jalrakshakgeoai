import React, { useState } from 'react';
import { 
  Award, 
  Layers, 
  Cpu, 
  Database, 
  Compass, 
  Sparkles, 
  Target, 
  Share2, 
  Download, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  FileCode, 
  Activity, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { SIH_SYSTEM_ARCHITECTURE } from '../data/mockDisasterData';

export const SihBlueprintView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'tech_stack' | 'mvp_roadmap' | 'pitch_deck' | 'future_scope'>('architecture');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                     JalRakshak GeoAi Blueprint
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time SOS & Predictive Geospatial Disaster Monitoring for Floods (JalRakshak GeoAI)
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded text-xs font-mono font-bold">
              JalRakshak GeoAi
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto border-t border-slate-800 pt-3 text-xs font-medium">
          {[
            { id: 'architecture', label: '1. System Architecture Diagram', icon: Layers },
            { id: 'tech_stack', label: '2. Tech Stack Recommendations', icon: Database },
            { id: 'mvp_roadmap', label: '3. Step-by-Step MVP Guide', icon: Target },
            { id: 'pitch_deck', label: '4. Key Pitch Points', icon: Award },
            { id: 'future_scope', label: '5. Future Scope & Scale', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: ARCHITECTURE DIAGRAM */}
      {activeSection === 'architecture' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              End-to-End System Architecture (4-Tier Pipeline)
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              How Earth Observation satellite streams (Sentinel-1 SAR, ISRO Cartosat DEM) fuse with Citizen SOS distress signals and Gemini AI hydrological modeling.
            </p>

            {/* Visual Interactive Pipeline Diagram */}
            <div className="space-y-4">
              {SIH_SYSTEM_ARCHITECTURE.layers.map((layer, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-200 font-mono">{layer.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                    {layer.components.map((comp, cIdx) => (
                      <div key={cIdx} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg">
                        <div className="text-xs font-semibold text-cyan-300 font-mono">{comp.name}</div>
                        <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{comp.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Workflow Bridge (Current Gaps vs JalRakshak) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Bridging the Gap: Legacy Emergency Systems vs JalRakshak GeoAI
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl space-y-3">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wide block">
                  Current Emergency Mechanisms (Gaps & Failures)
                </span>
                <ul className="space-y-2 text-xs text-red-200/80">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>112/1070 Voice Congestion:</strong> Responders overwhelmed with unverified calls; zero depth or GPS clarity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>Static Hazard Atlases:</strong> Paper or PDF flood maps cannot calculate dynamic flood crest arrival times.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>Blind Evacuation Routing:</strong> Citizens flee onto low-lying roads that submerge halfway, causing drownings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>Unaccounted Sand Mining:</strong> Riverbed dredging hollows out embankments secretly until catastrophic breaches happen.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                  JalRakshak GeoAI Solution (Bridged Innovation)
                </span>
                <ul className="space-y-2 text-xs text-emerald-200/90">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Geospatial SOS Beacon:</strong> 1-tap distress captures GPS + flood depth + trapped demographic metadata with offline mesh.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Sentinel-1 SAR Real-Time Inundation:</strong> Cloud-penetrating radar tracks moving water edges through stormy skies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Cartosat DEM Safe Evacuation Corridors:</strong> Routes refugees strictly along ridges &gt;60m elevation to dry shelters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Satellite Mining Audit:</strong> Flags illegal excavation pits that alter hydrodynamic velocity and levee toe-weight.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TECH STACK */}
      {activeSection === 'tech_stack' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Recommended Production Technology Stack
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Engineered for low-latency disaster response, geospatial vector rendering, and satellite telemetry processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-cyan-400 font-mono uppercase">1. Frontend & Client Apps</div>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• <strong>React 19 + TypeScript + Vite:</strong> Ultra-fast rendering.</li>
                <li>• <strong>Tailwind CSS v4:</strong> Tactical military dark-mode aesthetic.</li>
                <li>• <strong>Lucide Icons & Motion:</strong> Real-time operational feedback.</li>
                <li>• <strong>Progressive Web App (PWA):</strong> Offline cache & background GPS.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-emerald-400 font-mono uppercase">2. Backend & Real-time GIS</div>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• <strong>Node.js / Express + TS:</strong> Event-driven architecture.</li>
                <li>• <strong>PostGIS & PostgreSQL:</strong> Spatial queries (ST_Contains, ST_Distance).</li>
                <li>• <strong>WebSockets / SSE:</strong> Sub-second SOS dispatch updates.</li>
                <li>• <strong>GeoServer / MapServer:</strong> WMS/WFS tile serving.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-amber-400 font-mono uppercase">3. Satellite & Geospatial APIs</div>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• <strong>Copernicus Open Access Hub:</strong> Sentinel-1 SAR VV/VH.</li>
                <li>• <strong>ISRO Bhuvan Geo-Portal:</strong> Cartosat-1/3 Stereo DEM (2.5m).</li>
                <li>• <strong>Google Earth Engine (GEE):</strong> Time-series water masking.</li>
                <li>• <strong>IMD Doppler Radar API:</strong> Real-time rainfall intensity.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-rose-400 font-mono uppercase">4. AI / ML & Hydrology</div>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• <strong>JalRakshak GeoAi:</strong> Multi-modal risk synthesis & CAP translator.</li>
                <li>• <strong>Python GDAL / Rasterio:</strong> GeoTIFF backscatter extraction.</li>
                <li>• <strong>HEC-RAS 2D Hydrodynamic Model:</strong> Flow velocity vector solver.</li>
                <li>• <strong>Random Forest / U-Net:</strong> Water segmentation on SAR tiles.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-sky-400 font-mono uppercase">5. Offline & Resilient Comms</div>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• <strong>Base64-encoded Compact SMS:</strong> Zero-data SOS transmit.</li>
                <li>• <strong>LoRaWAN / Disaster Mesh:</strong> Peer-to-peer radio frequency link.</li>
                <li>• <strong>Common Alerting Protocol (CAP 2.1):</strong> Cell Broadcast sirens.</li>
                <li>• <strong>Service Worker IndexedDB:</strong> Offline raster tile caching.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-teal-400 font-mono uppercase">6. Deployment & Cloud Infra</div>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• <strong>Google Cloud Run / Kubernetes:</strong> Auto-scaling during disasters.</li>
                <li>• <strong>Cloud Storage Buckets:</strong> Cloud-optimized GeoTIFFs (COG).</li>
                <li>• <strong>C-Band Disaster SATCOM:</strong> Satellite backhaul for NDRF.</li>
                <li>• <strong>Redis Cache:</strong> In-memory triage queue prioritization.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: MVP ROADMAP */}
      {activeSection === 'mvp_roadmap' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Step-by-Step MVP Implementation Guide (Hackathon Execution)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Chronological build steps to demonstrate end-to-end functionality during the JalRakshak GeoAi evaluation.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                phase: 'Step 1: Satellite & River Gauge Data Stream Acquisition',
                duration: 'Hours 1 - 8',
                tasks: [
                  'Ingest Sentinel-1 SAR GRD tiles over selected flood basin (VV polarization).',
                  'Apply Lee speckle filtering and Otsu thresholding to classify water vs land pixels.',
                  'Download ISRO Cartosat DEM 10m tiles and generate elevation contours and flow accumulation lines.',
                  'Connect Central Water Commission (CWC) API for live gauge levels and warning marks.',
                ],
              },
              {
                phase: 'Step 2: Environmental Mining Hazard & Embankment Erosion Auditing',
                duration: 'Hours 9 - 16',
                tasks: [
                  'Perform multi-temporal Cartosat DEM subtraction to pinpoint illegal sand excavation trenches.',
                  'Calculate Embankment Stability Vulnerability Index (ESVI) based on distance to nearest river mining pit.',
                  'Build interactive 3D/2D bathymetric cross-section viewer demonstrating bank toe scour.',
                ],
              },
              {
                phase: 'Step 3: AI Predictive Engine & Gemini Multi-Modal Integration',
                duration: 'Hours 17 - 24',
                tasks: [
                  'Integrate @google/genai SDK with gemini-3.8-flash.',
                  'Feed real-time rainfall, dam discharge, terrain slope, and mining indices into structured prompt.',
                  'Output flood peak arrival hours, breach probability, sector-by-sector depth forecasts, and NDRF tactical directives.',
                  'Implement multi-lingual CAP disaster bulletin generator in 5 Indian languages.',
                ],
              },
              {
                phase: 'Step 4: Citizen Mobile SOS & Offline Mesh Communicator',
                duration: 'Hours 25 - 32',
                tasks: [
                  'Build 1-tap mobile SOS distress beacon with geolocation and water depth picker.',
                  'Implement automated priority triage scoring (P1-Critical, P2-High, P3-Moderate).',
                  'Generate compact SMS/mesh payload string (JALRAKSHAK#SOS#...) for telecommunication blackout situations.',
                  'Calculate safe elevation escape corridor to nearest high-ground relief shelter.',
                ],
              },
              {
                phase: 'Step 5: NDRF Command Center & Final Demonstration Polishing',
                duration: 'Hours 33 - 36',
                tasks: [
                  'Construct live tactical command room with GIS map overlays and interactive layer switcher.',
                  'Add rescue boat dispatch and survivor status tracking.',
                  'Run end-to-end live disaster drill for JalRakshak GeoAI evaluation: SOS Trigger -> AI Triage -> Boat Dispatch -> CAP Alert.',
                ],
              },
            ].map((step, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-900">
                  <span className="font-bold text-sm text-cyan-300 font-mono">{step.phase}</span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 w-fit">
                    {step.duration}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {step.tasks.map((task, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: KEY PITCH POINTS */}
      {activeSection === 'pitch_deck' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Key Pitch Points for JalRakshak GeoAi
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              High-impact arguments demonstrating technical novelty, societal value, and national importance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 1. Radically Solves the "Last-Mile Information Void"
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                During floods, victims panic and responders are blind. JalRakshak bridges this by giving citizens a 1-tap SOS that doesn't just ask for help—it transmits water height, elderly counts, and medical needs, while showing them which roads are <em>actually dry</em> based on Cartosat DEM contours.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> 2. Unique Environmental Sand Mining Correlation
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
              Most flood apps only look at rain. Environmental factors are also critical. JalRakshak GeoAI combines these factors to assess flood risk, including the impact of riverbed sand mining, and supports automated emergency response workflows.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. Cloud-Penetrating All-Weather Radar (SAR)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Optical satellites (Google Maps / Landsat) are completely blinded by heavy monsoon cloud cover. JalRakshak uses Sentinel-1 Synthetic Aperture Radar (C-Band microwave), which pierces through monsoon storm clouds 24/7 to map water extent even in torrential darkness.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> 4. Zero-Data Offline Mesh Resiliency
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                When cell towers drown and 4G fails, standard apps crash. JalRakshak generates encrypted 48-byte SMS strings that can traverse low-bandwidth 2G signaling channels or local radio meshes directly to emergency 112 receiver towers.
              </p>
            </div>
          </div>

          {/* Social Impact Metric Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-900/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-amber-300">NATIONAL RESILIENCE METRIC</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                Estimated 65% reduction in flood response latency and 80% elimination of blind evacuation hazards.
              </div>
            </div>
            <span className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs font-mono shrink-0">
              NDMA / ISRO Aligned
            </span>
          </div>
        </div>
      )}

      {/* SECTION 5: FUTURE SCOPE */}
      {activeSection === 'future_scope' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Future Scope & Scalable Extensions Beyond Floods
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              How the JalRakshak GeoAI engine scales to multi-hazard disaster monitoring across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-cyan-400 font-mono uppercase">
                1. Landslides & Debris Flows (Western Ghats & Himalayas)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Utilize Cartosat DEM slope angles combined with Sentinel-1 InSAR surface displacement interferometry to predict hill slope failures before catastrophic mudslides occur.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-amber-400 font-mono uppercase">
                2. Dam Breach & Flash Flood Surge Modeling
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automate real-time downstream dam-break hydrographs for 5,300+ large dams in India, calculating inundation wave height and arrival minutes for immediate siren triggers.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-emerald-400 font-mono uppercase">
                3. Urban Stormwater & Smart City IoT Gauges
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Integrate municipal storm drain IoT sensors with street-level lidar scans to eliminate urban flash flooding in major metros like Mumbai, Bengaluru, and Chennai.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
