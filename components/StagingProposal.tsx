import React from 'react';
import { CompensationResult, ReactorItem } from '../types';
import { Layers, Box } from 'lucide-react';

interface StagingProposalProps {
  result: CompensationResult;
  showReactorInfo: boolean;
}

export const StagingProposal: React.FC<StagingProposalProps> = ({ result, showReactorInfo }) => {
  const { recommendedSteps, totalCompensated, recommendedReactor } = result;

  // Agregace stupňů pro přehled (např. 2x 10 kVAr, 4x 25 kVAr)
  const stepCounts = recommendedSteps.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-indigo-600" />
        Návrh Kompenzačních Stupňů
      </h3>

      <div className="flex flex-wrap gap-3 mb-6">
        {recommendedSteps.map((step, idx) => (
          <div 
            key={idx}
            className="flex flex-col items-center justify-center w-20 h-20 bg-indigo-50 border-2 border-indigo-200 rounded-lg text-indigo-700 font-bold hover:bg-indigo-100 transition-colors cursor-default"
            title={`Stupeň ${idx + 1}`}
          >
            <span className="text-lg">{step}</span>
            <span className="text-[10px] uppercase">kVAr</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="text-slate-600">Celkový instalovaný výkon:</span>
          <span className="font-bold text-slate-900">{totalCompensated} kVAr</span>
        </div>
        
        {/* Souhrn materiálu */}
        <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">Rozpis komponent</h4>
            <ul className="text-sm space-y-1">
                {Object.entries(stepCounts).map(([kvar, count]) => (
                    <li key={kvar} className="flex justify-between text-slate-600">
                        <span>{count}x Kondenzátorová baterie</span>
                        <span className="font-mono font-medium">{kvar} kVAr</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Reactor Suggestion */}
        {showReactorInfo && recommendedReactor && (
             <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mt-4">
                <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Doporučený typ tlumivky (referenční)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-emerald-900">
                    <div>Typ: <span className="font-bold">{recommendedReactor.type}</span></div>
                    <div>Výkon: <span className="font-bold">{recommendedReactor.power} kVAr</span></div>
                    <div>Indukčnost: <span className="font-mono">{recommendedReactor.inductance} mH</span></div>
                    <div>Hmotnost: <span>{recommendedReactor.weight} kg</span></div>
                </div>
                <p className="text-xs text-emerald-600 mt-2 italic">
                    *Zobrazen typ pro jeden stupeň velikosti {recommendedReactor.power} kVAr. Pro reálnou sestavu je nutné osadit tlumivku ke každému stupni zvlášť.
                </p>
             </div>
        )}
      </div>
    </div>
  );
};