import React, { useEffect } from 'react';
import { CalculationInput, CompensationResult, DetuningFactor } from '../types';
import { Calculator } from 'lucide-react';

interface FormulaDisplayProps {
  input: CalculationInput;
  result: CompensationResult;
}

// Rozšíření window objektu pro TypeScript
declare global {
  interface Window {
    MathJax: {
      typesetPromise: () => Promise<void>;
    };
  }
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ input, result }) => {
  
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [input, result]);

  const p = input.detuningFactor;
  // Výpočet rezonanční frekvence
  const f_res = Math.round(input.frequency * Math.sqrt(1 / (p / 100)));

  return (
    <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-200 mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-slate-500" />
        Použité výpočetní vzorce
      </h3>

      <div className="space-y-6 text-slate-700">
        
        {/* Základní výpočet Qc */}
        <div>
          <p className="text-sm font-semibold mb-2">1. Výpočet potřebného jalového výkonu</p>
          <div className="overflow-x-auto pb-2">
            <div className="text-sm">
              {`$$Q_C = P \\cdot (\\tan \\varphi_1 - \\tan \\varphi_2)$$`}
            </div>
            <div className="text-xs text-slate-500 mt-1">
                kde: <br/>
                $P$ = Činný výkon ({input.activePower} kW)<br/>
                $\tan \varphi_1$ = Tangens aktuálního úhlu ({result.tanPhi1.toFixed(3)})<br/>
                $\tan \varphi_2$ = Tangens cílového úhlu ({result.tanPhi2.toFixed(3)})
            </div>
          </div>
        </div>

        {/* Hradicí tlumivky */}
        {input.detuningFactor !== DetuningFactor.NONE && (
          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm font-semibold mb-2">2. Parametry hradicích tlumivek ({p} %)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-slate-500 mb-1">Sériová rezonanční frekvence:</p>
                    <div className="text-sm">
                        {`$$f_{res} = f_n \\cdot \\sqrt{\\frac{1}{p}} = ${input.frequency} \\cdot \\sqrt{\\frac{1}{ ${p/100} }} \\approx ${f_res} \\text{ Hz}$$`}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1">Zvýšení napětí na kondenzátoru:</p>
                    <div className="text-sm">
                         {`$$U_C = \\frac{U_n}{1 - p} = \\frac{${input.voltage}}{1 - ${p/100}} \\approx ${(input.voltage / (1 - p/100)).toFixed(0)} \\text{ V}$$`}
                    </div>
                </div>
            </div>
            <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded">
              <strong>Důležité:</strong> Z důvodu sériového řazení tlumivky a kondenzátoru dochází ke zvýšení napětí na svorkách kondenzátoru. 
              Pro 400V síť s tlumivkami 7% (189 Hz) je nutné použít kondenzátory na jmenovité napětí min. 440V.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};