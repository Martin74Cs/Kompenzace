import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { ResultsSummary } from './components/ResultsSummary';
import { StagingProposal } from './components/StagingProposal';
import { Charts } from './components/Charts';
import { FormulaDisplay } from './components/FormulaDisplay';
import { CalculationInput, CompensationResult, DetuningFactor } from './types';
import { calculateCompensation } from './utils/compensationCalculator';
import { Zap, Info, BookOpen, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  // Default state
  const [input, setInput] = useState<CalculationInput>({
    activePower: 100, // kW
    voltage: 400, // V
    currentCosPhi: 0.70,
    targetCosPhi: 0.95,
    frequency: 50,
    detuningFactor: DetuningFactor.P7
  });

  const [result, setResult] = useState<CompensationResult>({
    tanPhi1: 0,
    tanPhi2: 0,
    requiredQc: 0,
    capacitiveCurrent: 0,
    recommendedSteps: [],
    totalCompensated: 0
  });

  useEffect(() => {
    const res = calculateCompensation(input);
    setResult(res);
  }, [input]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-2xl font-bold tracking-tight">Kalkulátor Kompenzace</h1>
               <p className="text-slate-400 text-xs uppercase tracking-wider">Dle standardů ZEZ SILKO</p>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4">
            <InputForm values={input} onChange={setInput} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <ResultsSummary result={result} detuningFactor={input.detuningFactor} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StagingProposal 
                    result={result} 
                    showReactorInfo={input.detuningFactor !== DetuningFactor.NONE} 
                />
                <Charts input={input} result={result} />
            </div>

            <FormulaDisplay input={input} result={result} />
          </div>
        </div>

        {/* Full Width Tips Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-800">Technický průvodce návrhem kompenzace</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tip 1: Harmonics */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        Harmonické zkreslení & Tlumivky
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        V moderních provozech s frekvenčními měniči, UPS nebo LED osvětlením vznikají vyšší harmonické. 
                        Použití <strong>Hradicích tlumivek</strong> (detuned reactors) je nezbytné pro ochranu kondenzátorů před rezonancí.
                    </p>
                    <ul className="text-sm text-slate-600 list-disc list-inside pl-2 space-y-1">
                        <li><strong>7 % (189 Hz):</strong> Standardní ochrana pro většinu průmyslových sítí.</li>
                        <li><strong>14 % (134 Hz):</strong> Pro sítě s velmi vysokým podílem 3. harmonické.</li>
                        <li><strong>5.67 % (210 Hz):</strong> Často používané v sítích s HDO signálem.</li>
                    </ul>
                </div>

                {/* Tip 2: Staging */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Volba kompenzačních stupňů
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Regulátor účiníku spíná stupně tak, aby se přiblížil cílovému $\cos \varphi$.
                        Ideální je mít nejmenší stupeň (např. 12.5 kVAr) pro jemné doladění a větší stupně (25 nebo 50 kVAr) pro hrubou kompenzaci.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 italic border border-slate-100">
                        Tento kalkulátor automaticky navrhuje optimální rozložení stupňů (např. řada 1:2:2) pro minimalizaci počtu spínání stykačů.
                    </div>
                </div>

                {/* Tip 3: Voltage */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Napěťová hladina kondenzátorů
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Při použití tlumivek vzniká na kondenzátoru přepětí. Pro síť <strong>400 V</strong>:
                    </p>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex justify-between border-b border-slate-100 pb-1">
                            <span>Bez tlumivek:</span>
                            <span className="font-mono font-bold">400 V / 415 V</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 pb-1">
                            <span>S tlumivkou 7%:</span>
                            <span className="font-mono font-bold text-blue-600">440 V</span>
                        </li>
                        <li className="flex justify-between">
                            <span>S tlumivkou 14%:</span>
                            <span className="font-mono font-bold text-blue-600">525 V</span>
                        </li>
                    </ul>
                    <p className="text-xs text-slate-400 mt-1">
                        Vždy kontrolujte štítkové údaje kondenzátoru vs. vypočtené napětí v sekci vzorců.
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;