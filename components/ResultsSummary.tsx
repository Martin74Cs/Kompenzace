import React from 'react';
import { CompensationResult, DetuningFactor } from '../types';
import { ArrowRight, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface ResultsSummaryProps {
  result: CompensationResult;
  detuningFactor: DetuningFactor;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result, detuningFactor }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Primary Result Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={100} />
        </div>
        <h3 className="text-blue-100 font-medium mb-2">Potřebný kompenzační výkon (Qc)</h3>
        <div className="text-5xl font-bold mb-2">
          {result.requiredQc.toFixed(1)} <span className="text-2xl font-normal">kVAr</span>
        </div>
        <div className="flex items-center gap-2 text-blue-200 mt-4">
          <span>Proud kondenzátorem:</span>
          <span className="font-bold text-white">{result.capacitiveCurrent.toFixed(1)} A</span>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-slate-500 text-sm">Aktuální tg φ</p>
            <p className="text-2xl font-semibold text-slate-700">{result.tanPhi1.toFixed(3)}</p>
          </div>
          <ArrowRight className="text-slate-300" />
          <div className="text-center">
            <p className="text-slate-500 text-sm">Cílový tg φ</p>
            <p className="text-2xl font-semibold text-green-600">{result.tanPhi2.toFixed(3)}</p>
          </div>
        </div>

        {result.requiredQc > 0 && detuningFactor !== DetuningFactor.NONE && (
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r">
             <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                    <p className="text-sm text-amber-800 font-medium">Použití Hradicích Tlumivek</p>
                    <p className="text-xs text-amber-700 mt-1">
                        Při použití tlumivek (p={detuningFactor}%) vzniká sériový rezonanční obvod. 
                        Napětí na kondenzátoru stoupne o faktor <span className="font-mono">1/(1-p)</span>.
                        Použijte kondenzátory s vyšším jmenovitým napětím (např. 440V nebo 525V pro 400V síť).
                    </p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};