import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculationInput, CompensationResult } from '../types';

interface ChartsProps {
  input: CalculationInput;
  result: CompensationResult;
}

export const Charts: React.FC<ChartsProps> = ({ input, result }) => {
  // Zjednodušená vizualizace poměrů výkonů před a po
  const p = input.activePower;
  
  // Q1 = P * tanPhi1
  const q1 = p * result.tanPhi1;
  
  // Q2 = P * tanPhi2
  const q2 = p * result.tanPhi2;
  
  const qComp = result.requiredQc;

  const data = [
    { name: 'Činný výkon (P)', value: p, color: '#3b82f6' }, // Blue
    { name: 'Jalový výkon cílový (Q2)', value: q2, color: '#22c55e' }, // Green
    { name: 'Kompenzovaný výkon (Qc)', value: qComp, color: '#f59e0b' }, // Amber
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mt-6">
       <h3 className="text-lg font-bold text-slate-800 mb-4">Rozložení Výkonu</h3>
       <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}`, 'kW / kVAr']} />
                <Legend verticalAlign="bottom" height={36} />
            </PieChart>
        </ResponsiveContainer>
       </div>
       <div className="text-center text-xs text-slate-500 mt-2">
           Graf zobrazuje poměr činného výkonu a složek jalového výkonu (původního vs. kompenzovaného).
       </div>
    </div>
  );
};