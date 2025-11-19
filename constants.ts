import { ReactorItem, DetuningFactor } from './types';

// Typické hodnoty tlumivek podobné katalogu ZEZ SILKO
// Pro 400V síť, často se používají kondenzátory na vyšší napětí (např. 440V) v sérii s tlumivkou.
// Výkony zde uvádíme jako "efektivní výkon kompenzačního stupně" (Qlc).

export const REACTORS_7_PERCENT: ReactorItem[] = [
  { type: 'TK 5-189', power: 5, inductance: 7.66, current: 7.2, weight: 4, detuning: 7 },
  { type: 'TK 10-189', power: 10, inductance: 3.83, current: 14.4, weight: 7, detuning: 7 },
  { type: 'TK 12.5-189', power: 12.5, inductance: 3.07, current: 18.0, weight: 8, detuning: 7 },
  { type: 'TK 15-189', power: 15, inductance: 2.55, current: 21.7, weight: 9, detuning: 7 },
  { type: 'TK 20-189', power: 20, inductance: 1.92, current: 28.9, weight: 13, detuning: 7 },
  { type: 'TK 25-189', power: 25, inductance: 1.53, current: 36.1, weight: 14, detuning: 7 },
  { type: 'TK 30-189', power: 30, inductance: 1.28, current: 43.3, weight: 16, detuning: 7 },
  { type: 'TK 40-189', power: 40, inductance: 0.96, current: 57.7, weight: 20, detuning: 7 },
  { type: 'TK 50-189', power: 50, inductance: 0.77, current: 72.2, weight: 25, detuning: 7 },
  { type: 'TK 60-189', power: 60, inductance: 0.64, current: 86.6, weight: 28, detuning: 7 },
];

export const REACTORS_14_PERCENT: ReactorItem[] = [
  { type: 'TK 10-134', power: 10, inductance: 8.15, current: 14.4, weight: 12, detuning: 14 },
  { type: 'TK 15-134', power: 15, inductance: 5.43, current: 21.7, weight: 15, detuning: 14 },
  { type: 'TK 20-134', power: 20, inductance: 4.07, current: 28.9, weight: 18, detuning: 14 },
  { type: 'TK 25-134', power: 25, inductance: 3.26, current: 36.1, weight: 20, detuning: 14 },
  { type: 'TK 30-134', power: 30, inductance: 2.72, current: 43.3, weight: 26, detuning: 14 },
  { type: 'TK 40-134', power: 40, inductance: 2.04, current: 57.7, weight: 33, detuning: 14 },
  { type: 'TK 50-134', power: 50, inductance: 1.63, current: 72.2, weight: 38, detuning: 14 },
];

export const REACTORS_5_67_PERCENT: ReactorItem[] = [
    { type: 'TK 25-210', power: 25, inductance: 1.22, current: 36.1, weight: 14, detuning: 5.67 },
    { type: 'TK 50-210', power: 50, inductance: 0.61, current: 72.2, weight: 25, detuning: 5.67 },
];

// Standardní kroky kondenzátorů (kVAr)
export const STANDARD_STEPS = [2.5, 5, 6.25, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60];

export const getReactorsByFactor = (factor: DetuningFactor): ReactorItem[] => {
    switch(factor) {
        case DetuningFactor.P7: return REACTORS_7_PERCENT;
        case DetuningFactor.P14: return REACTORS_14_PERCENT;
        case DetuningFactor.P5_67: return REACTORS_5_67_PERCENT;
        default: return [];
    }
};