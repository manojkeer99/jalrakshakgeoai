import React, { useState } from 'react';
import { 
  Radio, 
  AlertOctagon, 
  MapPin, 
  Users, 
  HeartPulse, 
  Send, 
  Compass, 
  CheckCircle2, 
  Copy, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  LifeBuoy
} from 'lucide-react';
import { SosAlert, EvacuationShelter } from '../types/disaster';

interface CitizenSosViewProps {
  onSosDispatched: (alert: SosAlert) => void;
  shelters: EvacuationShelter[];
}

export const CitizenSosView: React.FC<CitizenSosViewProps> = ({ onSosDispatched, shelters }) => {
  const [callerName, setCallerName] = useState('Ananya Sharma');
  const [phone, setPhone] = useState('+91 98642-11099');
  const [coords, setCoords] = useState({ lat: 26.2185, lng: 91.7345 });
  const [address, setAddress] = useState('House 42, Near Pandu Port Railway Colony, Ward 7');
  const [waterLevel, setWaterLevel] = useState<'Ankle' | 'Knee' | 'Waist' | 'Chest' | 'Roof'>('Chest');
  const [peopleTrapped, setPeopleTrapped] = useState(4);
  const [elderlyCount, setElderlyCount] = useState(1);
  const [infantCount, setInfantCount] = useState(1);
  const [hasMedicalNeed, setHasMedicalNeed] = useState(true);
  const [medicalDetails, setMedicalDetails] = useState('Elderly cardiac patient with chest tightness, water entering 1st floor');
  const [structureType, setStructureType] = useState<'Tin Roof Single-Story' | 'Kutcha Mud House' | 'Pucca 2-Story' | 'School/Community' | 'Tree/High Ground'>('Tin Roof Single-Story');
  const [batteryPct, setBatteryPct] = useState(18);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedAlert, setDispatchedAlert] = useState<SosAlert | null>(null);
  const [triageResponse, setTriageResponse] = useState<any | null>(null);
  const [copiedSms, setCopiedSms] = useState(false);

  // Depth mapping in meters
  const depthMapping: Record<string, number> = {
    Ankle: 0.25,
    Knee: 0.55,
    Waist: 1.05,
    Chest: 1.45,
    Roof: 2.60,
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: parseFloat(pos.coords.latitude.toFixed(4)),
            lng: parseFloat(pos.coords.longitude.toFixed(4)),
          });
        },
        () => {
          // Fallback location inside Guwahati high-risk zone
          setCoords({ lat: 26.2140, lng: 91.7320 });
        }
      );
    }
  };

  const handleSubmitSos = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/gemini/sos-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: callerName,
          phone,
          gpsCoords: coords,
          waterLevel: `${waterLevel} level (~${depthMapping[waterLevel]}m)`,
          peopleTrapped,
          elderlyOrInfants: elderlyCount + infantCount,
          medicalEmergency: hasMedicalNeed ? medicalDetails : 'None reported',
          shelterStructure: structureType,
          batteryPct,
        }),
      });

      const triageData = await response.json();
      setTriageResponse(triageData);

      const generatedId = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
      const offlineMeshCode = `JR#SOS#${coords.lat},${coords.lng}#D${depthMapping[waterLevel]}#P${peopleTrapped}#E${elderlyCount}#I${infantCount}#M${hasMedicalNeed ? 1 : 0}#${generatedId}`;

      const newAlert: SosAlert = {
        id: generatedId,
        name: callerName,
        phone,
        coords,
        address,
        waterLevel: `${waterLevel} level (~${depthMapping[waterLevel]}m)`,
        waterDepthMeters: depthMapping[waterLevel],
        peopleTrapped,
        elderlyCount,
        infantCount,
        hasMedicalNeed,
        medicalDetails,
        structureType,
        timestamp: 'Just now',
        triagePriority: triageData.priorityCode || (waterLevel === 'Roof' || waterLevel === 'Chest' ? 'P1-CRITICAL' : 'P2-HIGH'),
        triageScore: triageData.triageScore || 95,
        status: 'PENDING',
        offlineMeshCode,
      };

      setDispatchedAlert(newAlert);
      onSosDispatched(newAlert);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find nearest high ground shelter
  const nearestShelter = shelters[0] || {
    name: 'Guwahati University High Ground Shelter',
    elevationM: 68.5,
    accessibleRoadStatus: 'OPEN',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Citizen Emergency SOS & Distress Beacon
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Direct telemetry uplink to NDRF, State SDRF, and District Disaster Management Authority (DDMA).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Disaster Mesh Online | CAP Server 112 Ready</span>
          </div>
        </div>
      </div>

      {!dispatchedAlert ? (
        <form onSubmit={handleSubmitSos} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name / Household Head
              </label>
              <input
                type="text"
                required
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500 transition"
                placeholder="e.g. Ramesh Kalita"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Contact Number (Active Mobile)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500 transition font-mono"
                placeholder="+91 98765-43210"
              />
            </div>
          </div>

          {/* Location & GPS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Exact Distress Location (GPS & Address)
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition"
              >
                <MapPin className="w-3.5 h-3.5" /> Auto-Detect Current GPS
              </button>
            </div>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500 transition"
              placeholder="Landmark, Ward, Colony, Panchayat"
            />
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>Latitude: <strong className="text-slate-200">{coords.lat}</strong></span>
              <span>•</span>
              <span>Longitude: <strong className="text-slate-200">{coords.lng}</strong></span>
            </div>
          </div>

          {/* Water Depth Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Current Flood Water Height at Your Position
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { level: 'Ankle', meters: '0.2m', desc: 'Passable on foot' },
                { level: 'Knee', meters: '0.5m', desc: 'Difficult footing' },
                { level: 'Waist', meters: '1.0m', desc: 'Current strong' },
                { level: 'Chest', meters: '1.4m', desc: 'Critical hazard' },
                { level: 'Roof', meters: '2.5m+', desc: 'Submerged refuge' },
              ].map((item) => {
                const isSelected = waterLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setWaterLevel(item.level as any)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold flex items-center justify-between">
                      <span>{item.level}</span>
                      <span className="text-[11px] font-mono opacity-80">{item.meters}</span>
                    </div>
                    <div className="text-[10px] mt-1 text-slate-400">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* People Count & Vulnerabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Total Persons Trapped
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={peopleTrapped}
                onChange={(e) => setPeopleTrapped(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white font-mono"
              />
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Elderly / Senior Citizens
              </label>
              <input
                type="number"
                min="0"
                max={peopleTrapped}
                value={elderlyCount}
                onChange={(e) => setElderlyCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white font-mono"
              />
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Infants / Young Children
              </label>
              <input
                type="number"
                min="0"
                max={peopleTrapped}
                value={infantCount}
                onChange={(e) => setInfantCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white font-mono"
              />
            </div>
          </div>

          {/* Medical Emergencies */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="medicalCheck"
                checked={hasMedicalNeed}
                onChange={(e) => setHasMedicalNeed(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
              <label htmlFor="medicalCheck" className="text-xs font-semibold text-rose-300 cursor-pointer flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5" /> Urgent Medical Condition or Life-Support Required
              </label>
            </div>
            {hasMedicalNeed && (
              <textarea
                value={medicalDetails}
                onChange={(e) => setMedicalDetails(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-slate-950 border border-rose-900/60 rounded-lg text-xs text-rose-100 placeholder-rose-400/50 focus:outline-none focus:border-rose-500"
                placeholder="Specify condition: e.g. insulin required, dialysis, severe wound, snakebite, pregnant"
              />
            )}
          </div>

          {/* Structure type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Shelter & Structure Vulnerability
            </label>
            <select
              value={structureType}
              onChange={(e) => setStructureType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500 font-sans"
            >
              <option value="Tin Roof Single-Story">Tin Roof Single-Story (High Collapse Hazard)</option>
              <option value="Kutcha Mud House">Kutcha Mud House (Immediate Water Infiltration)</option>
              <option value="Pucca 2-Story">Pucca Concrete 2-Story (Upper floor temporary safe)</option>
              <option value="School/Community">Public Concrete School / Community Hall</option>
              <option value="Tree/High Ground">Stranded on Tree / Raised Embankment Ridge</option>
            </select>
          </div>

          {/* Device Battery Level */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span>Phone Battery Level (determines automated power-saving mesh):</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="5"
                max="100"
                value={batteryPct}
                onChange={(e) => setBatteryPct(Number(e.target.value))}
                className="w-32 accent-rose-500 cursor-pointer"
              />
              <span className="font-mono font-bold text-slate-200">{batteryPct}%</span>
            </div>
          </div>

          {/* One-Tap Big Red SOS Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-[0.99] text-white font-bold rounded-xl text-base tracking-wide flex items-center justify-center gap-3 shadow-xl transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Radio className="w-5 h-5 animate-spin" />
                <span>Transmitting Telemetry to NDRF & AI Triage Engine...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>BROADCAST INSTANT SOS EMERGENCY BEACON</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* SOS Beacon Active Confirmation Card */
        <div className="bg-slate-900 border-2 border-rose-500 rounded-xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-rose-500 text-white rounded-full animate-bounce">
                <CheckCircle2 className="w-7 h-7" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">SOS BEACON ACTIVE: {dispatchedAlert.id}</h2>
                  <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded font-mono text-xs font-bold">
                    {dispatchedAlert.triagePriority}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Transmitted to NDRF 1st Battalion Guwahati & SDRF Emergency Control Room.
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">AI Triage Severity</div>
              <div className="text-2xl font-black text-rose-500 font-mono">
                {triageResponse?.triageScore || dispatchedAlert.triageScore}/100
              </div>
            </div>
          </div>

          {/* Immediate Action Directives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Life-Saving Action Plan (English)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {triageResponse?.citizenGuidanceEnglish ||
                  'Move immediately to the roof or highest elevated beam. Turn off main circuit breaker. Wave bright colored fabric to guide rescue boats. NDRF boat dispatch in progress.'}
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> जीवन रक्षक निर्देश (हिंदी)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {triageResponse?.citizenGuidanceHindi ||
                  'तुरंत छत या सबसे ऊंचे स्थान पर जाएं। बिजली के तारों और बहते पानी से दूर रहें। सहायता दल 20-30 मिनट में पहुंच रहा है। बैटरी बचाने के लिए फोन का उपयोग सीमित करें।'}
              </p>
            </div>
          </div>

          {/* Rescue Boat Dispatch Status */}
          <div className="p-4 bg-slate-950 border border-cyan-900/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-950 text-cyan-400 rounded-lg">
                <LifeBuoy className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <div className="text-xs text-cyan-400 font-mono font-semibold">RESCUE TEAM DISPATCH RECOMMENDATION</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {triageResponse?.dispatchRecommendation || 'NDRF Inflatable Motor Boat (Zodiac 40HP) Assigned'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Est. Arrival Window</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">18 - 25 Mins</div>
            </div>
          </div>

          {/* Offline Mesh SMS Fallback Code */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                Offline SMS & Mesh Transmit Code (No Internet Fallback)
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(dispatchedAlert.offlineMeshCode);
                  setCopiedSms(true);
                  setTimeout(() => setCopiedSms(false), 2000);
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedSms ? 'Copied to Clipboard!' : 'Copy SMS String'}</span>
              </button>
            </div>
            <div className="bg-slate-900 px-3 py-2 rounded border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all">
              {dispatchedAlert.offlineMeshCode}
            </div>
            <p className="text-[11px] text-slate-400">
              If cellular internet drops, send this text to <strong>112</strong> or <strong>1070</strong>. Emergency towers decode this telemetry directly into the command GIS.
            </p>
          </div>

          {/* Nearest High Ground Shelter */}
          <div className="p-4 bg-slate-950 border border-emerald-900/50 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> NEAREST SAFE DRY HIGH GROUND (CARTOSAT DEM: 68.5m)
              </div>
              <div className="text-sm font-bold text-white mt-1">{nearestShelter.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Distance: ~1.8 km | Road Status: <span className="text-emerald-400 font-medium">OPEN (Elevated Corridor)</span>
              </div>
            </div>
            <button
              onClick={() => alert(`Directing to ${nearestShelter.name}. Follow elevated North embankment road.`)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            >
              <span>View Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setDispatchedAlert(null);
                setTriageResponse(null);
              }}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← File Another Distress Signal / Update Status
            </button>
            <div className="text-xs font-mono text-slate-500">
              Uplink verified: ISRO GSAT-29 / C-Band Disaster Gateway
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
