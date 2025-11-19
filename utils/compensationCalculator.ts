import { CalculationInput, CompensationResult, DetuningFactor, ReactorItem } from '../types';
import { getReactorsByFactor, STANDARD_STEPS } from '../constants';

export const calculateCompensation = (input: CalculationInput): CompensationResult => {
  const { activePower, currentCosPhi, targetCosPhi, voltage, detuningFactor } = input;

  // 1. Výpočet tangens
  // tan(phi) = sqrt(1 - cos^2(phi)) / cos(phi)
  // Ošetření dělení nulou nebo nesmyslných hodnot
  const validCurrentCosPhi = Math.max(0.01, Math.min(0.999, currentCosPhi));
  const validTargetCosPhi = Math.max(0.01, Math.min(1.0, targetCosPhi));

  const tanPhi1 = Math.sqrt(1 - Math.pow(validCurrentCosPhi, 2)) / validCurrentCosPhi;
  const tanPhi2 = Math.sqrt(1 - Math.pow(validTargetCosPhi, 2)) / validTargetCosPhi;

  // 2. Potřebný výkon Qc
  // Qc = P * (tanPhi1 - tanPhi2)
  let requiredQc = activePower * (tanPhi1 - tanPhi2);
  requiredQc = Math.max(0, requiredQc); // Nemůže být záporný pro kompenzaci indukční zátěže

  // 3. Výpočet proudu
  // I = Qc / (sqrt(3) * U)
  // Qc v kVAr, U v V -> I v A
  const capacitiveCurrent = (requiredQc * 1000) / (Math.sqrt(3) * voltage);

  // 4. Návrh tlumivky (nejsilnější stupeň nebo celková, zjednodušeně pro příklad)
  let recommendedReactor: ReactorItem | undefined;
  
  if (detuningFactor !== DetuningFactor.NONE) {
    const reactors = getReactorsByFactor(detuningFactor);
    // Najdi nejbližší vyšší nebo rovnou tlumivku pro celkový výkon (jen pro referenci)
    // V praxi se skládá z více tlumivek, zde najdeme typickou pro dominantní zátěž
    recommendedReactor = reactors.reduce((prev, curr) => {
      return (Math.abs(curr.power - requiredQc) < Math.abs(prev.power - requiredQc) ? curr : prev);
    }, reactors[0]);
  }

  // 5. Návrh stupňů (Automatická regulace)
  // Algoritmus: Pokusit se složit requiredQc ze standardních kroků.
  // Preferujeme řady 1:1:1, 1:2:2, 1:2:4 atd.
  // Pro jednoduchost: Zvolíme nejmenší krok cca 5-10% celkového výkonu a zbytek doplníme.
  
  const recommendedSteps: number[] = [];
  let remainingQc = requiredQc;
  
  // Určení velikosti nejmenšího kroku (min 2.5, max 50)
  // Cíl: cca 6-12 stupňů regulátoru
  let stepSize = 2.5;
  if (requiredQc > 500) stepSize = 50;
  else if (requiredQc > 300) stepSize = 25;
  else if (requiredQc > 150) stepSize = 12.5;
  else if (requiredQc > 75) stepSize = 10;
  else if (requiredQc > 40) stepSize = 5;
  
  // Najdi nejbližší standardní krok k vypočtenému stepSize
  stepSize = STANDARD_STEPS.reduce((prev, curr) => 
    Math.abs(curr - stepSize) < Math.abs(prev - stepSize) ? curr : prev
  );

  // Naplnění pole stupňů
  while (remainingQc > stepSize * 0.6) { // 0.6 tolerance
    // Pokud zbývá hodně, dej velký krok (násobek základního, pokud existuje v standardu)
    let currentStep = stepSize;
    
    // Logika pro "větší" stupně (např. 1:2:2) - pokud zbývá víc než 2x stepSize, použijeme větší, max 50/60
    if (remainingQc > stepSize * 4) {
        const bigStepCandidates = STANDARD_STEPS.filter(s => s <= remainingQc && s >= stepSize * 2 && s <= 60);
        if (bigStepCandidates.length > 0) {
            currentStep = bigStepCandidates[bigStepCandidates.length - 1];
        }
    }

    recommendedSteps.push(currentStep);
    remainingQc -= currentStep;
  }

  // Seřadit stupně (menší pro jemné doladění první)
  recommendedSteps.sort((a, b) => a - b);

  const totalCompensated = recommendedSteps.reduce((a, b) => a + b, 0);

  return {
    tanPhi1,
    tanPhi2,
    requiredQc,
    capacitiveCurrent,
    recommendedReactor,
    recommendedSteps,
    totalCompensated
  };
};