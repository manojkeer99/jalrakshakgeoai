export type AlertLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type PriorityCode = 'P1-CRITICAL' | 'P2-HIGH' | 'P3-MODERATE';

export interface GpsCoordinate {
  lat: number;
  lng: number;
}

export interface SosAlert {
  id: string;
  name: string;
  phone: string;
  coords: GpsCoordinate;
  address: string;
  waterLevel: string; // 'Ankle' | 'Knee' | 'Waist' | 'Chest' | 'Roof'
  waterDepthMeters: number;
  peopleTrapped: number;
  elderlyCount: number;
  infantCount: number;
  hasMedicalNeed: boolean;
  medicalDetails: string;
  structureType: 'Tin Roof Single-Story' | 'Kutcha Mud House' | 'Pucca 2-Story' | 'School/Community' | 'Tree/High Ground';
  timestamp: string;
  triagePriority: PriorityCode;
  triageScore: number;
  status: 'PENDING' | 'DISPATCHED' | 'RESCUED';
  assignedUnit?: string;
  etaMinutes?: number;
  offlineMeshCode: string;
}

export interface RiverGauge {
  id: string;
  name: string;
  river: string;
  coords: GpsCoordinate;
  currentLevelM: number;
  warningLevelM: number;
  dangerLevelM: number;
  highestFloodLevelM: number;
  flowDischargeCusecs: number;
  trend: 'RISING' | 'STABLE' | 'FALLING';
  rateOfRiseMetersPerHour: number;
}

export interface SandMiningHotspot {
  id: string;
  locationName: string;
  coords: GpsCoordinate;
  areaHectares: number;
  legalityStatus: 'ILLEGAL_UNAUTHORIZED' | 'EXPIRED_LEASE' | 'EXCESS_DREDGING';
  excavatedDepthM: number;
  embankmentProximityM: number;
  floodVulnerabilityMultiplier: number;
  riparianLossPct: number;
  lastSatelliteDetected: string;
}

export interface EvacuationShelter {
  id: string;
  name: string;
  coords: GpsCoordinate;
  elevationM: number;
  capacityTotal: number;
  occupancyCurrent: number;
  hasMedicalCamp: boolean;
  hasCleanWaterSupply: boolean;
  accessibleRoadStatus: 'OPEN' | 'PARTIALLY_FLOODED' | 'CUT_OFF';
}

export interface FloodPredictionResult {
  riskLevel: AlertLevel;
  inundationSpeedKmh: number;
  peakFloodHours: number;
  projectedAreaSqKm: number;
  breachProbability: number;
  criticalSectors: Array<{
    name: string;
    urgency: string;
    estimatedDepthMeters: number;
    evacuatedEst: string;
  }>;
  hydrologicalAssessment: string;
  ndrfDirectives: string[];
}

export interface DisasterAdvisories {
  english: string;
  hindi: string;
  bengali: string;
  assamese: string;
  malayalam: string;
}

export type ActiveTab = 'geospatial_ops' | 'citizen_sos' | 'ai_predictive' | 'ndrf_command' | 'mining_audit' | 'sih_blueprint';
