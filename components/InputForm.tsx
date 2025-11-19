import React from 'react';
import { CalculationInput, DetuningFactor } from '../types';
import { Zap, Settings } from 'lucide-react';

interface InputFormProps {
  values: CalculationInput;
  onChange: (newValues: CalculationInput) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ values, onChange }) => {
  
  const handleChange = (key: keyof CalculationInput, value: number) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-600" />
        Vstupní Parametry
      </h2>

      <div className="space-y-6">
        {/* Active Power */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Činný výkon (P) [kW]
          </label>
          <div className="relative">
            <input
              type="number"
              value={values.activePower}
              onChange={(e) => handleChange('activePower', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Zap className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Voltage */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Napětí sítě (U) [V]
          </label>
          <select
            value={values.voltage}
            onChange={(e) => handleChange('voltage', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={230}>230 V</option>
            <option value={400}>400 V</option>
            <option value={440}>440 V</option>
            <option value={525}>525 V</option>
            <option value={690}>690 V</option>
          </select>
        </div>

        {/* Current Cos Phi */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-600">Současný účiník (cos φ1)</label>
            <span className="text-sm font-bold text-blue-600">{values.currentCosPhi.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.99"
            step="0.01"
            value={values.currentCosPhi}
            onChange={(e) => handleChange('currentCosPhi', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Špatný (0.5)</span>
            <span>Dobrý (0.99)</span>
          </div>
        </div>

        {/* Target Cos Phi */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-600">Cílový účiník (cos φ2)</label>
            <span className="text-sm font-bold text-green-600">{values.targetCosPhi.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.80"
            max="1.00"
            step="0.01"
            value={values.targetCosPhi}
            onChange={(e) => handleChange('targetCosPhi', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>

         {/* Detuning Factor */}
         <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Typ ochranné tlumivky (Činitel zatlumení p)
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Určuje rezonanční frekvenci pro potlačení harmonických.
          </p>
          <select
            value={values.detuningFactor}
            onChange={(e) => handleChange('detuningFactor', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value={DetuningFactor.NONE}>Bez tlumivky (pouze kondenzátory)</option>
            <option value={DetuningFactor.P7}>7 % (189 Hz) - Nejčastější</option>
            <option value={DetuningFactor.P14}>14 % (134 Hz) - Vysoké znečištění</option>
            <option value={DetuningFactor.P5_67}>5.67 % (210 Hz) - Audiofrekvence</option>
          </select>
        </div>
      </div>
    </div>
  );
};