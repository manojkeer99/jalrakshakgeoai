import React, { useState } from 'react';
import { 
  Shield, 
  LifeBuoy, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Clock, 
  MapPin, 
  Radio, 
  Anchor, 
  Phone, 
  HeartPulse, 
  Filter, 
  Search,
  Check
} from 'lucide-react';
import { SosAlert, PriorityCode } from '../types/disaster';

interface NdrfIncidentBoardProps {
  alerts: SosAlert[];
  onDispatchAlert: (id: string, unitName: string) => void;
  onMarkRescued: (id: string) => void;
  onSelectAlertOnMap: (alert: SosAlert) => void;
}

export const NdrfIncidentBoard: React.FC<NdrfIncidentBoardProps> = ({
  alerts,
  onDispatchAlert,
  onMarkRescued,
  onSelectAlertOnMap,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('NDRF Zodiac Boat Unit Alpha-1 (40HP)');

  const availableUnits = [
    'NDRF Zodiac Boat Unit Alpha-1 (40HP)',
    'NDRF Inflatable Rescue Bravo-2 (Medical Paramedic)',
    'SDRF Rapid Rescue Jet Boat Echo-3',
    'Indian Army Amphibious Carrier Unit 4',
    'Heavy-Lift Drone Lifeline Drop (Water/Meds)',
  ];

  const filteredAlerts = alerts.filter((alert) => {
    if (filterPriority !== 'ALL' && alert.triagePriority !== filterPriority) return false;
    if (filterStatus !== 'ALL' && alert.status !== filterStatus) return false;
    if (
      searchQuery &&
      !alert.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !alert.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !alert.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const p1Count = alerts.filter((a) => a.triagePriority === 'P1-CRITICAL' && a.status !== 'RESCUED').length;
  const pendingCount = alerts.filter((a) => a.status === 'PENDING').length;
  const rescuedCount = alerts.filter((a) => a.status === 'RESCUED').length;
  const totalTrapped = alerts.reduce((acc, a) => acc + (a.status !== 'RESCUED' ? a.peopleTrapped : 0), 0);

  return (
    <div className="space-y-6">
      {/* Board Header & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                <Shield className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                NDRF / SDRF Incident Command & Triage Console
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time prioritization queue for flood distress beacons, boat dispatches, and life-support intervention.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Telemetry Uplink: Active | 1st Bn NDRF Patgaon</span>
          </div>
        </div>

        {/* Tactical Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
            <div className="text-[11px] font-mono text-rose-400">P1 CRITICAL CASES</div>
            <div className="text-2xl font-black text-rose-500 mt-0.5 font-mono">{p1Count} Incidents</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Life danger &lt; 45 mins</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
            <div className="text-[11px] font-mono text-amber-400">PENDING DISPATCH</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5 font-mono">{pendingCount} Beacons</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Awaiting rescue unit</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
            <div className="text-[11px] font-mono text-cyan-400">TRAPPED POPULATION</div>
            <div className="text-2xl font-black text-cyan-300 mt-0.5 font-mono">{totalTrapped} Persons</div>
            <div className="text-[10px] text-slate-500 mt-0.5">At reported coordinates</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
            <div className="text-[11px] font-mono text-emerald-400">SUCCESSFULLY EVACUATED</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5 font-mono">{rescuedCount + 42} Rescued</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Transferred to high ground</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by victim name, ward, phone, or SOS ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Priority filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['ALL', 'P1-CRITICAL', 'P2-HIGH', 'P3-MODERATE'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded transition font-mono ${
                  filterPriority === p
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['ALL', 'PENDING', 'DISPATCHED', 'RESCUED'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded transition font-mono ${
                  filterStatus === s
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            No distress beacons match the selected criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isP1 = alert.triagePriority === 'P1-CRITICAL';
            const isDispatched = alert.status === 'DISPATCHED';
            const isRescued = alert.status === 'RESCUED';

            return (
              <div
                key={alert.id}
                className={`bg-slate-900 border rounded-xl p-5 shadow-lg transition-all ${
                  isRescued
                    ? 'border-slate-800 opacity-60'
                    : isP1
                    ? 'border-rose-700/80 bg-gradient-to-r from-rose-950/20 to-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2 rounded-lg font-mono text-xs font-black ${
                        isP1
                          ? 'bg-rose-500 text-white'
                          : alert.triagePriority === 'P2-HIGH'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-cyan-600 text-white'
                      }`}
                    >
                      {alert.triagePriority}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white">{alert.name}</h2>
                        <span className="text-xs font-mono text-slate-400">ID: {alert.id}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-cyan-400" /> {alert.phone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Triage Severity</div>
                      <div className="text-lg font-black text-rose-400 font-mono">
                        {alert.triageScore}/100
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectAlertOnMap(alert)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View on GIS</span>
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">DISTRESS LOCATION</span>
                    <span className="text-slate-200 font-medium">{alert.address}</span>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Lat: {alert.coords.lat}, Lng: {alert.coords.lng}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">WATER HEIGHT & STRUCTURE</span>
                    <span className="text-cyan-300 font-semibold font-mono">{alert.waterLevel}</span>
                    <div className="text-[11px] text-slate-300 mt-0.5">{alert.structureType}</div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">VICTIMS AT LOCATION</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      {alert.peopleTrapped} Total ({alert.elderlyCount} elderly, {alert.infantCount} infants)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">RESCUE STATUS</span>
                    <span
                      className={`font-semibold font-mono text-xs ${
                        isRescued
                          ? 'text-emerald-400'
                          : isDispatched
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {alert.status}
                    </span>
                    {alert.assignedUnit && (
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {alert.assignedUnit} (ETA {alert.etaMinutes}m)
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical Emergency Alert if present */}
                {alert.hasMedicalNeed && (
                  <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-200 text-xs flex items-center gap-2 mb-3">
                    <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong className="text-rose-300">Urgent Medical Triage:</strong> {alert.medicalDetails}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                {!isRescued && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 shrink-0">Assign Unit:</span>
                      <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                      >
                        {availableUnits.map((u, i) => (
                          <option key={i} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDispatchAlert(alert.id, selectedUnit)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          isDispatched
                            ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/40'
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                        }`}
                      >
                        <LifeBuoy className="w-3.5 h-3.5" />
                        <span>{isDispatched ? 'Re-Route / Update Unit' : 'Dispatch Rescue Unit'}</span>
                      </button>

                      <button
                        onClick={() => onMarkRescued(alert.id)}
                        className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Evacuated</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
