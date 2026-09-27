import React, { useState, useRef } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  LifeBuoy, 
  Activity, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  ShieldAlert, 
  Waves, 
  Compass, 
  Clock, 
  UserCheck, 
  Radio, 
  Split
} from 'lucide-react';
import { RiverGauge, SosAlert, SandMiningHotspot, EvacuationShelter } from '../types/disaster';

interface GeospatialMapProps {
  gauges: RiverGauge[];
  sosAlerts: SosAlert[];
  miningHotspots: SandMiningHotspot[];
  shelters: EvacuationShelter[];
  onSelectSos: (sos: SosAlert) => void;
  onDispatchSos: (sosId: string, unitName: string) => void;
  selectedSosId?: string;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  gauges,
  sosAlerts,
  miningHotspots,
  shelters,
  onSelectSos,
  onDispatchSos,
  selectedSosId,
}) => {
  // Layer visibility toggles
  const [showSarLayer, setShowSarLayer] = useState(true);
  const [showDemContours, setShowDemContours] = useState(true);
  const [showMiningZones, setShowMiningZones] = useState(true);
  const [showRiverGauges, setShowRiverGauges] = useState(true);
  const [showSosBeacons, setShowSosBeacons] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showEvacCorridors, setShowEvacCorridors] = useState(true);
  
  // Interactive tools
  const [splitViewMode, setSplitViewMode] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [activeInspectorItem, setActiveInspectorItem] = useState<{
    type: 'SOS' | 'GAUGE' | 'MINING' | 'SHELTER';
    data: any;
  } | null>(null);

  // Coordinate display
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string }>({
    lat: '26.1912° N',
    lng: '91.7482° E',
  });

  // Map coordinate bounds for Guwahati - Brahmaputra Sector (lat: 26.12 to 26.34, lng: 91.60 to 91.86)
  const MIN_LAT = 26.12;
  const MAX_LAT = 26.34;
  const MIN_LNG = 91.60;
  const MAX_LNG = 91.86;
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 650;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * MAP_WIDTH;
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * MAP_HEIGHT;
    return { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (rect.width / MAP_WIDTH);
    const y = (e.clientY - rect.top) / (rect.height / MAP_HEIGHT);
    const lng = MIN_LNG + (x / MAP_WIDTH) * (MAX_LNG - MIN_LNG);
    const lat = MAX_LAT - (y / MAP_HEIGHT) * (MAX_LAT - MIN_LAT);
    setCursorCoords({
      lat: `${lat.toFixed(4)}° N`,
      lng: `${lng.toFixed(4)}° E`,
    });
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.2, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.85, z - 0.25));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[720px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col font-sans select-none shadow-2xl">
      {/* Top GIS Status Header */}
      <div className="h-12 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-mono">
              Sentinel-1 SAR VV/VH & ISRO Cartosat DEM
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400 font-mono">
            Sector: <span className="text-slate-200">Brahmaputra Basin (Kamrup Reach)</span>
          </div>
        </div>

        {/* Real-time telemetry & Controls */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{cursorCoords.lat}, {cursorCoords.lng}</span>
          </div>

          <button
            onClick={() => setSplitViewMode(!splitViewMode)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium border transition-colors ${
              splitViewMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="Compare Dry Season Baseline vs Current Sentinel SAR Flood Inundation"
          >
            <Split className="w-3.5 h-3.5" />
            <span>{splitViewMode ? 'Exit Split View' : 'SAR Before/After Split'}</span>
          </button>

          <div className="flex items-center bg-slate-800 rounded border border-slate-700">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 transition border-l border-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 transition border-l border-slate-700"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden cursor-crosshair">
        {/* SVG GIS Layer Render */}
        <div
          className="w-full h-full transition-transform duration-100 origin-center"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
          >
            <defs>
              {/* Grid pattern */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.6" />
              </pattern>

              {/* Water wave texture pattern for Sentinel SAR Inundation */}
              <pattern id="waterTexture" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 0 8 Q 4 4, 8 8 T 16 8" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />
              </pattern>

              {/* Linear gradient for Cartosat DEM contours */}
              <linearGradient id="demGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>

              {/* Mining danger pattern */}
              <pattern id="miningHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.5" />
              </pattern>

              {/* Clip path for split view comparison */}
              <clipPath id="splitClip">
                <rect x="0" y="0" width={(MAP_WIDTH * sliderPosition) / 100} height={MAP_HEIGHT} />
              </clipPath>
            </defs>

            {/* Base Background & Coordinate Grid */}
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#demGradient)" />
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

            {/* Topographical Cartosat Elevation Contours */}
            {showDemContours && (
              <g id="cartosat-dem-contours" className="opacity-40">
                {/* 45m Floodplain elevation contour */}
                <path
                  d="M 20 280 C 140 260, 220 310, 340 330 C 480 350, 620 310, 750 340 C 850 360, 930 330, 980 310"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                <text x="50" y="275" fill="#38bdf8" fontSize="8" fontFamily="monospace">DEM 46.5m (Basin Low)</text>

                {/* 55m Terrace contour */}
                <path
                  d="M 40 180 C 180 160, 290 210, 420 220 C 580 240, 720 210, 830 220 C 900 230, 960 210, 990 190"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="0.8"
                />
                <text x="60" y="175" fill="#10b981" fontSize="8" fontFamily="monospace">DEM 55.0m</text>

                {/* 68m High Ground contour (Safe Ridge) */}
                <path
                  d="M 50 110 C 220 90, 360 120, 520 130 C 690 140, 810 110, 920 120 L 980 110"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.2"
                />
                <text x="80" y="105" fill="#34d399" fontSize="8" fontFamily="monospace">DEM 68.0m (Safe Elevated Ridge)</text>

                {/* South Bank Contour */}
                <path
                  d="M 30 500 C 190 480, 310 520, 480 510 C 650 490, 820 540, 980 500"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="0.8"
                />
                <text x="60" y="495" fill="#10b981" fontSize="8" fontFamily="monospace">DEM 58.2m (South Terraces)</text>
              </g>
            )}

            {/* Permanent Normal River Channel (Base hydrology) */}
            <path
              d="M 0 340 C 120 320, 240 370, 380 380 C 520 390, 680 340, 820 360 C 910 375, 960 360, 1000 350 L 1000 420 C 940 435, 850 440, 780 430 C 640 410, 500 450, 360 440 C 220 430, 110 400, 0 410 Z"
              fill="#0369a1"
              fillOpacity="0.45"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <text x="440" y="415" fill="#7dd3fc" fontSize="11" fontWeight="600" letterSpacing="2" opacity="0.8">
              BRAHMAPUTRA MAIN RIVER CHANNEL
            </text>

            {/* Sentinel-1 SAR Flood Inundation Layer (Microwave Water Mask) */}
            {showSarLayer && (
              <g id="sentinel-sar-flood-extent" clipPath={splitViewMode ? "url(#splitClip)" : undefined}>
                {/* Active inundation overflow polygon */}
                <path
                  d="M 0 250 C 140 230, 230 290, 350 310 C 470 330, 580 280, 710 290 C 820 300, 920 280, 1000 270 
                     L 1000 510 C 910 525, 810 520, 720 490 C 590 460, 450 530, 310 510 C 180 490, 90 470, 0 490 Z"
                  fill="#0284c7"
                  fillOpacity="0.32"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                />
                {/* Secondary water wave pattern */}
                <path
                  d="M 0 250 C 140 230, 230 290, 350 310 C 470 330, 580 280, 710 290 C 820 300, 920 280, 1000 270 
                     L 1000 510 C 910 525, 810 520, 720 490 C 590 460, 450 530, 310 510 C 180 490, 90 470, 0 490 Z"
                  fill="url(#waterTexture)"
                />

                {/* Submerged Highway Cut-off Polyline */}
                <path
                  d="M 220 270 L 390 330 L 460 365"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />
                <circle cx="390" cy="330" r="4" fill="#ef4444" />
                <text x="310" y="320" fill="#fca5a5" fontSize="8.5" fontFamily="monospace">
                  ⚠ NH-27 Submerged (Water Depth 1.2m)
                </text>
              </g>
            )}

            {/* Split View Line & Label */}
            {splitViewMode && (
              <g>
                <line
                  x1={(MAP_WIDTH * sliderPosition) / 100}
                  y1="0"
                  x2={(MAP_WIDTH * sliderPosition) / 100}
                  y2={MAP_HEIGHT}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <rect
                  x={(MAP_WIDTH * sliderPosition) / 100 - 60}
                  y={15}
                  width="120"
                  height="22"
                  rx="4"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <text
                  x={(MAP_WIDTH * sliderPosition) / 100}
                  y={30}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  ◀ SAR FLOOD | DRY BASELINE ▶
                </text>
              </g>
            )}

            {/* Safe Evacuation Corridors & NDRF Boat Tracks */}
            {showEvacCorridors && (
              <g id="evacuation-corridors">
                {/* Elevated Road Route to Shelter 1 */}
                <path
                  d="M 280 210 L 360 160 L 510 135 L 680 120"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                />
                <text x="400" y="150" fill="#34d399" fontSize="8.5" fontFamily="monospace">
                  🟢 SAFE ELEVATED EVACUATION CORRIDOR
                </text>

                {/* NDRF Rescue Boat Alpha Track */}
                <path
                  d="M 640 370 C 580 360, 480 340, 410 320"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
                <circle cx="530" cy="350" r="3" fill="#f59e0b" />
                <text x="490" y="340" fill="#fde68a" fontSize="8" fontFamily="monospace">
                  🚤 NDRF Boat Unit Echo-3 In Transit (ETA 12m)
                </text>
              </g>
            )}

            {/* Illegal Sand Mining Hotspots */}
            {showMiningZones &&
              miningHotspots.map((mine) => {
                const { x, y } = projectCoords(mine.coords.lat, mine.coords.lng);
                return (
                  <g
                    key={mine.id}
                    className="cursor-pointer group"
                    onClick={() => setActiveInspectorItem({ type: 'MINING', data: mine })}
                  >
                    {/* Outer crater hazard zone */}
                    <ellipse
                      cx={x}
                      cy={y}
                      rx="32"
                      ry="20"
                      fill="url(#miningHatch)"
                      stroke="#ef4444"
                      strokeWidth="1.2"
                      className="group-hover:opacity-100 transition-opacity"
                    />
                    {/* Pit center marker */}
                    <circle cx={x} cy={y} r="5" fill="#b91c1c" stroke="#fca5a5" strokeWidth="1.5" />
                    <text
                      x={x + 12}
                      y={y + 3}
                      fill="#f87171"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {mine.id}: {mine.areaHectares} Ha (Depth {mine.excavatedDepthM}m)
                    </text>
                    <text
                      x={x + 12}
                      y={y + 14}
                      fill="#fca5a5"
                      fontSize="7.5"
                      fontFamily="monospace"
                    >
                      Breach Hazard: {mine.floodVulnerabilityMultiplier}x
                    </text>
                  </g>
                );
              })}

            {/* River Gauges */}
            {showRiverGauges &&
              gauges.map((gauge) => {
                const { x, y } = projectCoords(gauge.coords.lat, gauge.coords.lng);
                const isOverDanger = gauge.currentLevelM >= gauge.dangerLevelM;
                const isOverWarning = gauge.currentLevelM >= gauge.warningLevelM;
                const gaugeColor = isOverDanger ? '#ef4444' : isOverWarning ? '#f59e0b' : '#10b981';

                return (
                  <g
                    key={gauge.id}
                    className="cursor-pointer group"
                    onClick={() => setActiveInspectorItem({ type: 'GAUGE', data: gauge })}
                  >
                    {/* Base pin */}
                    <rect
                      x={x - 14}
                      y={y - 24}
                      width="28"
                      height="24"
                      rx="3"
                      fill="#0f172a"
                      stroke={gaugeColor}
                      strokeWidth="1.5"
                    />
                    {/* Gauge level mini bar */}
                    <rect
                      x={x - 11}
                      y={y - 5}
                      width="22"
                      height="3"
                      fill={gaugeColor}
                    />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {gauge.currentLevelM.toFixed(1)}m
                    </text>
                    {/* Label below */}
                    <text
                      x={x}
                      y={y + 12}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="8"
                      fontFamily="sans-serif"
                    >
                      {gauge.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

            {/* Evacuation Shelters */}
            {showShelters &&
              shelters.map((sh) => {
                const { x, y } = projectCoords(sh.coords.lat, sh.coords.lng);
                return (
                  <g
                    key={sh.id}
                    className="cursor-pointer group"
                    onClick={() => setActiveInspectorItem({ type: 'SHELTER', data: sh })}
                  >
                    <polygon
                      points={`${x},${y - 18} ${x + 12},${y - 4} ${x - 12},${y - 4}`}
                      fill="#10b981"
                      stroke="#ecfdf5"
                      strokeWidth="1"
                    />
                    <rect
                      x={x - 8}
                      y={y - 4}
                      width="16"
                      height="12"
                      fill="#047857"
                      stroke="#ecfdf5"
                      strokeWidth="0.8"
                    />
                    <text
                      x={x}
                      y={y + 18}
                      textAnchor="middle"
                      fill="#6ee7b7"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {sh.name.split(' ')[0]} ({sh.occupancyCurrent}/{sh.capacityTotal})
                    </text>
                  </g>
                );
              })}

            {/* Citizen SOS Distress Beacons */}
            {showSosBeacons &&
              sosAlerts.map((sos) => {
                const { x, y } = projectCoords(sos.coords.lat, sos.coords.lng);
                const isSelected = selectedSosId === sos.id;
                const isP1 = sos.triagePriority === 'P1-CRITICAL';
                const isDispatched = sos.status === 'DISPATCHED';

                const ringColor = isP1 ? '#ef4444' : sos.triagePriority === 'P2-HIGH' ? '#f59e0b' : '#38bdf8';

                return (
                  <g
                    key={sos.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      onSelectSos(sos);
                      setActiveInspectorItem({ type: 'SOS', data: sos });
                    }}
                  >
                    {/* Pulsing beacon circles for active emergency */}
                    {sos.status !== 'RESCUED' && (
                      <>
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "22" : "16"}
                          fill="none"
                          stroke={ringColor}
                          strokeWidth="1.5"
                          opacity="0.75"
                          className="animate-ping origin-center"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="12"
                          fill={ringColor}
                          fillOpacity="0.25"
                        />
                      </>
                    )}

                    {/* Pin center */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "8" : "6"}
                      fill={ringColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* SOS Badge Tag */}
                    <rect
                      x={x + 9}
                      y={y - 12}
                      width="76"
                      height="20"
                      rx="3"
                      fill="#0f172a"
                      stroke={ringColor}
                      strokeWidth="1"
                    />
                    <text
                      x={x + 13}
                      y={y + 1}
                      fill="#ffffff"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {sos.id} ({sos.peopleTrapped}p)
                    </text>

                    {/* Rescue status subtag */}
                    {isDispatched && (
                      <text
                        x={x + 13}
                        y={y + 19}
                        fill="#34d399"
                        fontSize="7"
                        fontFamily="monospace"
                      >
                        ✔ Boat Dispatched
                      </text>
                    )}
                  </g>
                );
              })}
          </svg>
        </div>

        {/* Split View Range Slider (when active) */}
        {splitViewMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-3 z-30">
            <span className="text-xs text-cyan-400 font-mono">Sentinel-1 SAR</span>
            <input
              type="range"
              min="10"
              max="90"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-48 accent-cyan-500 cursor-pointer"
            />
            <span className="text-xs text-slate-400 font-mono">Dry Baseline</span>
          </div>
        )}

        {/* Floating GIS Layer Filter Controls (Bottom Left) */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-3 text-xs z-30 shadow-xl max-w-xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> GIS Layer Controls
            </span>
            <span className="text-[10px] text-slate-500 font-mono">ISRO/Copernicus</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <button
              onClick={() => setShowSarLayer(!showSarLayer)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition ${
                showSarLayer ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50' : 'text-slate-500 hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-cyan-400" /> Sentinel-1 SAR Flood Inundation
              </span>
              {showSarLayer ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>

            <button
              onClick={() => setShowDemContours(!showDemContours)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition ${
                showDemContours ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' : 'text-slate-500 hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" /> Cartosat DEM Contours (2.5m)
              </span>
              {showDemContours ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>

            <button
              onClick={() => setShowMiningZones(!showMiningZones)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition ${
                showMiningZones ? 'bg-red-950/60 text-red-300 border border-red-800/50' : 'text-slate-500 hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Sand Mining Pit Hazards
              </span>
              {showMiningZones ? <Eye className="w-3 h-3 text-red-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>

            <button
              onClick={() => setShowRiverGauges(!showRiverGauges)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition ${
                showRiverGauges ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50' : 'text-slate-500 hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> Active River Gauges (CWC)
              </span>
              {showRiverGauges ? <Eye className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>

            <button
              onClick={() => setShowSosBeacons(!showSosBeacons)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition ${
                showSosBeacons ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50' : 'text-slate-500 hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-400" /> Citizen SOS Distress Beacons
              </span>
              {showSosBeacons ? <Eye className="w-3 h-3 text-rose-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>

            <button
              onClick={() => setShowShelters(!showShelters)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition ${
                showShelters ? 'bg-teal-950/60 text-teal-300 border border-teal-800/50' : 'text-slate-500 hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5 text-teal-400" /> Evacuation High Shelters
              </span>
              {showShelters ? <Eye className="w-3 h-3 text-teal-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Selected Item Inspector Panel (Bottom Right) */}
        {activeInspectorItem && (
          <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 w-80 text-xs shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {activeInspectorItem.type === 'SOS' && `SOS BEACON: ${activeInspectorItem.data.id}`}
                {activeInspectorItem.type === 'GAUGE' && `HYDRO GAUGE: ${activeInspectorItem.data.id}`}
                {activeInspectorItem.type === 'MINING' && `MINING PIT: ${activeInspectorItem.data.id}`}
                {activeInspectorItem.type === 'SHELTER' && `SHELTER: ${activeInspectorItem.data.id}`}
              </span>
              <button
                onClick={() => setActiveInspectorItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Content for SOS */}
            {activeInspectorItem.type === 'SOS' && (
              <div className="mt-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Caller:</span>
                  <span className="font-semibold text-slate-200">{activeInspectorItem.data.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Trapped:</span>
                  <span className="font-bold text-rose-400">
                    {activeInspectorItem.data.peopleTrapped} Persons ({activeInspectorItem.data.elderlyCount} elderly, {activeInspectorItem.data.infantCount} infants)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Water Depth:</span>
                  <span className="font-mono text-cyan-300 font-semibold">{activeInspectorItem.data.waterLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Triage Priority:</span>
                  <span className="font-mono font-bold text-rose-400">{activeInspectorItem.data.triagePriority}</span>
                </div>
                {activeInspectorItem.data.hasMedicalNeed && (
                  <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded text-rose-300 text-[11px]">
                    ⚠ Medical: {activeInspectorItem.data.medicalDetails}
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-emerald-400">{activeInspectorItem.data.status}</span>
                </div>

                {activeInspectorItem.data.status === 'PENDING' && (
                  <button
                    onClick={() => {
                      onDispatchSos(activeInspectorItem.data.id, 'NDRF Boat Unit Alpha-1');
                      setActiveInspectorItem(null);
                    }}
                    className="w-full mt-2 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <LifeBuoy className="w-3.5 h-3.5" /> Dispatch Immediate Rescue Boat
                  </button>
                )}
              </div>
            )}

            {/* Content for River Gauge */}
            {activeInspectorItem.type === 'GAUGE' && (
              <div className="mt-2.5 space-y-2">
                <div className="text-slate-300 font-semibold">{activeInspectorItem.data.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Level:</span>
                  <span className="font-mono text-base font-bold text-rose-400">
                    {activeInspectorItem.data.currentLevelM} m
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Danger Mark:</span>
                  <span className="font-mono text-slate-300">{activeInspectorItem.data.dangerLevelM} m</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Discharge Rate:</span>
                  <span className="font-mono text-cyan-300">{activeInspectorItem.data.flowDischargeCusecs.toLocaleString()} cusecs</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Rate of Rise:</span>
                  <span className="font-mono text-rose-400">+{activeInspectorItem.data.rateOfRiseMetersPerHour} m/hr</span>
                </div>
              </div>
            )}

            {/* Content for Sand Mining Pit */}
            {activeInspectorItem.type === 'MINING' && (
              <div className="mt-2.5 space-y-2">
                <div className="text-slate-300 font-semibold">{activeInspectorItem.data.locationName}</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-mono text-red-400 font-bold">{activeInspectorItem.data.legalityStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Excavated Depth:</span>
                  <span className="font-mono text-amber-300">{activeInspectorItem.data.excavatedDepthM} meters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Embankment Proximity:</span>
                  <span className="font-mono text-red-400 font-bold">{activeInspectorItem.data.embankmentProximityM} m (CRITICAL)</span>
                </div>
                <div className="p-2 bg-red-950/40 border border-red-800/60 rounded text-red-300 text-[11px]">
                  Breach Hazard Multiplier: {activeInspectorItem.data.floodVulnerabilityMultiplier}x higher water velocity towards human settlements.
                </div>
              </div>
            )}

            {/* Content for Shelter */}
            {activeInspectorItem.type === 'SHELTER' && (
              <div className="mt-2.5 space-y-2">
                <div className="text-slate-300 font-semibold">{activeInspectorItem.data.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ground Elevation:</span>
                  <span className="font-mono text-emerald-400 font-bold">{activeInspectorItem.data.elevationM} m (Dry Zone)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Shelter Capacity:</span>
                  <span className="font-mono text-slate-200">
                    {activeInspectorItem.data.occupancyCurrent} / {activeInspectorItem.data.capacityTotal} persons
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Road Access:</span>
                  <span className="font-mono text-emerald-400 font-bold">{activeInspectorItem.data.accessibleRoadStatus}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Map Legend Bar */}
      <div className="h-10 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono z-20">
        <div className="flex items-center gap-5 overflow-x-auto py-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> P1 Critical SOS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> P2 High SOS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-sky-500/50 border border-sky-400 inline-block"></span> Sentinel SAR Flood Zone
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 border border-red-500 bg-red-950 inline-block"></span> Sand Mining Pit Hazard
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 inline-block"></span> Safe High Shelter
          </span>
        </div>
        <div className="hidden sm:block text-slate-500">
          Scale: 1:25,000 | Datum: WGS 84 / UTM Zone 46N
        </div>
      </div>
    </div>
  );
};
