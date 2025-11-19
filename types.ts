export enum DetuningFactor {
  P7 = 7, // 189 Hz
  P14 = 14, // 134 Hz
  P5_67 = 5.67, // 210 Hz
  NONE = 0
}

export interface CalculationInput {
  activePower: number; // kW
  voltage: number; // V
  currentCosPhi: number;
  targetCosPhi: number;
  frequency: number; // Hz
  detuningFactor: DetuningFactor;
}

export interface CompensationResult {
  tanPhi1: number;
  tanPhi2: number;
  requiredQc: number; // kVAr
  capacitiveCurrent: number; // A
  recommendedReactor?: ReactorItem;
  recommendedSteps: number[];
  totalCompensated: number;
}

export interface ReactorItem {
  type: string;
  power: number; // kVAr
  inductance: number; // mH
  current: number; // A
  weight: number; // kg
  detuning: number; // %
}

export interface CapacitorItem {
  power: number; // kVAr
  voltage: number; // V
}