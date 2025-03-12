// Retirement Calculator Utility Functions

// Types for retirement calculation
export interface RetirementInputs {
  age: number;
  currentSalary: number;
  currentSavings: number;
  monthlySavings: number;
  riskTolerance: 'low' | 'medium' | 'high';
  retirementAge: number;
  desiredRetirementIncome: number;
  hasAdditionalIncome: boolean;
  additionalIncomeAmount: number;
  hasPropertyInvestments: boolean;
  propertyValue: number;
  hasPrivatePension: boolean;
  privatePensionValue: number;
  employmentType: 'employed' | 'self-employed' | 'civil-servant' | 'freelancer';
  yearsInGermany: number;
  germanCitizenship: boolean;
}

export interface RetirementResults {
  score: number;
  scoreCategory: 'excellent' | 'good' | 'fair' | 'poor';
  retirementIncome: number;
  projectedSavings: number;
  savingsGap: number;
  germanRetirementBenefit: number;
  totalRequiredSavings: number;
  recommendations: string[];
  
  // Radar chart scores (out of 100 for each category)
  radarScores: {
    savingsRate: number;
    investmentStrategy: number;
    riskManagement: number;
    timeHorizon: number;
    incomeSecurity: number;
  };
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface InvestmentIdea {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number; // Annual percentage
  minimumInvestment: number;
  taxAdvantages: string;
  suitableFor: string[];
}

export interface PensionPlan {
  id: string;
  name: string;
  description: string;
  providerType: 'government' | 'private' | 'employer';
  eligibility: string[];
  benefits: string[];
  taxTreatment: string;
  suitableFor: string[];
}

export interface TaxBenefit {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  potentialSavings: string;
}

// Constants for calculation
const INFLATION_RATE = 0.02; // 2% annual inflation
const LIFE_EXPECTANCY = 85; // Average life expectancy in Germany
const GERMAN_PENSION_FACTOR = 0.0045; // Simplified factor for German pension system
const INVESTMENT_RETURNS = {
  low: 0.04, // 4% annual return for low risk
  medium: 0.06, // 6% annual return for medium risk
  high: 0.08, // 8% annual return for high risk
};

// Helper function to calculate the radar chart scores
function calculateRadarScores(inputs: RetirementInputs, results: Partial<RetirementResults>): RetirementResults['radarScores'] {
  // Calculate savings rate score (% of monthly savings relative to current salary)
  const monthlySalary = inputs.currentSalary / 12;
  const savingsRate = (inputs.monthlySavings / monthlySalary) * 100;
  const savingsRateScore = Math.min(100, savingsRate * 5); // 20% savings would be 100 score
  
  // Calculate investment strategy score based on risk tolerance and age
  let investmentStrategyScore = 0;
  const yearsToRetirement = inputs.retirementAge - inputs.age;
  
  if (inputs.riskTolerance === 'high' && yearsToRetirement > 20) {
    investmentStrategyScore = 100;
  } else if (inputs.riskTolerance === 'high' && yearsToRetirement > 10) {
    investmentStrategyScore = 90;
  } else if (inputs.riskTolerance === 'medium' && yearsToRetirement > 15) {
    investmentStrategyScore = 85;
  } else if (inputs.riskTolerance === 'medium') {
    investmentStrategyScore = 75;
  } else if (inputs.riskTolerance === 'low' && yearsToRetirement > 25) {
    investmentStrategyScore = 65;
  } else if (inputs.riskTolerance === 'low') {
    investmentStrategyScore = 50;
  }
  
  // Calculate risk management score based on diversification factors
  let riskFactors = 0;
  if (inputs.hasAdditionalIncome) riskFactors += 20;
  if (inputs.hasPropertyInvestments) riskFactors += 25;
  if (inputs.hasPrivatePension) riskFactors += 25;
  if (inputs.yearsInGermany > 5) riskFactors += 15;
  if (inputs.germanCitizenship) riskFactors += 15;
  const riskManagementScore = Math.min(100, riskFactors);
  
  // Calculate time horizon score based on years to retirement
  let timeHorizonScore = 0;
  if (yearsToRetirement >= 30) timeHorizonScore = 100;
  else if (yearsToRetirement >= 25) timeHorizonScore = 90;
  else if (yearsToRetirement >= 20) timeHorizonScore = 80;
  else if (yearsToRetirement >= 15) timeHorizonScore = 70;
  else if (yearsToRetirement >= 10) timeHorizonScore = 60;
  else if (yearsToRetirement >= 5) timeHorizonScore = 40;
  else timeHorizonScore = 20;
  
  // Calculate income security score based on employment type and benefits
  let incomeSecurity = 0;
  if (inputs.employmentType === 'civil-servant') incomeSecurity = 90;
  else if (inputs.employmentType === 'employed') incomeSecurity = 75;
  else if (inputs.employmentType === 'self-employed') incomeSecurity = 60;
  else if (inputs.employmentType === 'freelancer') incomeSecurity = 50;
  
  // Adjust income security based on additional factors
  if (inputs.hasAdditionalIncome) incomeSecurity += 10;
  if (inputs.hasPropertyInvestments) incomeSecurity += 10;
  if (inputs.hasPrivatePension) incomeSecurity += 10;
  
  const incomeSecurityScore = Math.min(100, incomeSecurity);
  
  return {
    savingsRate: Math.round(savingsRateScore),
    investmentStrategy: Math.round(investmentStrategyScore),
    riskManagement: Math.round(riskManagementScore),
    timeHorizon: Math.round(timeHorizonScore),
    incomeSecurity: Math.round(incomeSecurityScore)
  };
}

export function calculateRetirementReadiness(inputs: RetirementInputs): RetirementResults {
  // Number of years until retirement
  const yearsToRetirement = inputs.retirementAge - inputs.age;
  
  // Calculate expected return based on risk tolerance
  let expectedAnnualReturn = 0;
  switch (inputs.riskTolerance) {
    case 'low':
      expectedAnnualReturn = 0.04; // 4%
      break;
    case 'medium':
      expectedAnnualReturn = 0.06; // 6%
      break;
    case 'high':
      expectedAnnualReturn = 0.08; // 8%
      break;
  }
  
  // Calculate projected savings at retirement using compound interest formula
  // Future Value = P(1+r)^n + PMT * ((1+r)^n - 1) / r
  // Where P = initial principal, r = rate, n = time periods, PMT = regular payment
  const monthlyRate = expectedAnnualReturn / 12;
  const totalMonths = yearsToRetirement * 12;
  
  const initialPrincipalFactor = Math.pow(1 + monthlyRate, totalMonths);
  const futureValueOfPrincipal = inputs.currentSavings * initialPrincipalFactor;
  
  const annuityFactor = (initialPrincipalFactor - 1) / monthlyRate;
  const futureValueOfPayments = inputs.monthlySavings * annuityFactor;
  
  const projectedSavings = futureValueOfPrincipal + futureValueOfPayments;
  
  // Calculate German retirement benefit based on years in Germany and employment type
  // Simplified calculation - this would be more complex in reality
  const baseRetirementBenefit = inputs.currentSalary * 0.015 * Math.min(inputs.yearsInGermany, 40);
  
  let employmentMultiplier = 1.0;
  switch (inputs.employmentType) {
    case 'civil-servant':
      employmentMultiplier = 1.5;
      break;
    case 'employed':
      employmentMultiplier = 1.0;
      break;
    case 'self-employed':
      employmentMultiplier = 0.7;
      break;
    case 'freelancer':
      employmentMultiplier = 0.6;
      break;
  }
  
  const germanRetirementBenefit = baseRetirementBenefit * employmentMultiplier * (inputs.germanCitizenship ? 1.2 : 1.0);
  
  // Calculate total annual retirement income
  const annualRetirementIncomeFromSavings = projectedSavings * 0.04; // Assume 4% withdrawal rate
  const totalRetirementIncome = annualRetirementIncomeFromSavings + germanRetirementBenefit;
  
  // Calculate desired annual retirement income for gap analysis
  const desiredAnnualRetirementIncome = inputs.desiredRetirementIncome * 12;
  
  // Calculate savings gap
  const savingsGap = Math.max(0, desiredAnnualRetirementIncome - totalRetirementIncome);
  
  // Calculate total required savings
  const totalRequiredSavings = projectedSavings + (savingsGap / 0.04);
  
  // Generate recommendations based on results
  const recommendations: string[] = [];
  
  if (savingsGap > 0) {
    if (inputs.monthlySavings < inputs.currentSalary * 0.15) {
      recommendations.push("Increase your monthly retirement contributions to at least 15% of your income.");
    }
    
    if (inputs.riskTolerance === 'low' && yearsToRetirement > 10) {
      recommendations.push("Consider a more growth-oriented investment strategy given your time horizon.");
    }
    
    if (!inputs.hasPrivatePension) {
      recommendations.push("Explore private pension options to supplement your retirement income.");
    }
  }
  
  if (inputs.yearsInGermany < 5 && !inputs.germanCitizenship) {
    recommendations.push("Investigate legal residency options to maximize your German retirement benefits.");
  }
  
  if (!inputs.hasPropertyInvestments && projectedSavings > 200000) {
    recommendations.push("Consider real estate investments as part of your retirement portfolio.");
  }
  
  // Add general diversification recommendation
  recommendations.push("Ensure your retirement savings are diversified across different asset classes.");
  
  // Calculate overall score (0-100)
  let score: number;
  if (savingsGap <= 0) {
    // No gap means excellent score
    score = 90 + Math.min(10, (projectedSavings / totalRequiredSavings) * 10);
  } else {
    // Calculate score based on how close projected savings are to required savings
    const savingsRatio = projectedSavings / totalRequiredSavings;
    score = Math.max(20, Math.min(85, savingsRatio * 100));
  }
  
  // Calculate score category
  let scoreCategory: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 85) {
    scoreCategory = 'excellent';
  } else if (score >= 70) {
    scoreCategory = 'good';
  } else if (score >= 50) {
    scoreCategory = 'fair';
  } else {
    scoreCategory = 'poor';
  }
  
  // Calculate radar chart scores
  const radarScores = calculateRadarScores(inputs, {
    score,
    scoreCategory,
    projectedSavings,
    savingsGap
  });
  
  return {
    score: Math.round(score),
    scoreCategory,
    retirementIncome: Math.round(totalRetirementIncome),
    projectedSavings: Math.round(projectedSavings),
    savingsGap: Math.round(savingsGap),
    germanRetirementBenefit: Math.round(germanRetirementBenefit),
    totalRequiredSavings: Math.round(totalRequiredSavings),
    recommendations,
    radarScores
  };
}

// Helper functions
function calculateStatePensionFactor(inputs: RetirementInputs): number {
  // Simplified calculation for German state pension
  // Based on years in Germany, employment type, and salary
  let factor = GERMAN_PENSION_FACTOR;
  
  // Adjust for years in Germany (simplified)
  const yearsContributionFactor = Math.min(1, inputs.yearsInGermany / 40);
  
  // Adjust for employment type
  let employmentFactor = 1;
  switch (inputs.employmentType) {
    case 'employed':
      employmentFactor = 1;
      break;
    case 'self-employed':
      employmentFactor = 0.7; // Self-employed often have lower state pension
      break;
    case 'civil-servant':
      employmentFactor = 1.2; // Civil servants often have better pension
      break;
    case 'freelancer':
      employmentFactor = 0.6; // Freelancers often have lower state pension
      break;
  }
  
  return factor * yearsContributionFactor * employmentFactor;
}

function calculateProjectedSavings(inputs: RetirementInputs, yearsUntilRetirement: number): number {
  // Start with current savings
  let totalSavings = inputs.currentSavings;
  
  // Get annual return rate based on risk tolerance
  const annualReturnRate = INVESTMENT_RETURNS[inputs.riskTolerance];
  
  // Calculate future value of current savings
  totalSavings = totalSavings * Math.pow(1 + annualReturnRate, yearsUntilRetirement);
  
  // Calculate future value of monthly contributions
  const monthlyContribution = inputs.monthlySavings;
  for (let year = 1; year <= yearsUntilRetirement; year++) {
    const yearlyContribution = monthlyContribution * 12;
    totalSavings += yearlyContribution * Math.pow(1 + annualReturnRate, yearsUntilRetirement - year);
  }
  
  // Add property value if applicable
  if (inputs.hasPropertyInvestments && inputs.propertyValue) {
    // Assume property appreciates at 2% per year
    const futurePropertyValue = inputs.propertyValue * Math.pow(1 + 0.02, yearsUntilRetirement);
    totalSavings += futurePropertyValue;
  }
  
  // Add private pension if applicable
  if (inputs.hasPrivatePension && inputs.privatePensionValue) {
    // Assume private pension grows at 3% per year
    const futurePrivatePensionValue = inputs.privatePensionValue * Math.pow(1 + 0.03, yearsUntilRetirement);
    totalSavings += futurePrivatePensionValue;
  }
  
  return totalSavings;
}

function calculateRequiredSavings(monthlyGap: number, yearsInRetirement: number, riskTolerance: 'low' | 'medium' | 'high'): number {
  // Calculate total needed for retirement
  const monthsInRetirement = yearsInRetirement * 12;
  
  // Adjust for inflation and returns during retirement
  // Using a simplified calculation
  const withdrawalRate = 0.04; // 4% safe withdrawal rate
  
  // Required capital to generate the monthly gap
  const requiredCapital = monthlyGap * 12 / withdrawalRate;
  
  return requiredCapital;
}

function calculateScore(coverageRatio: number, inputs: RetirementInputs): number {
  // Base score on coverage ratio (0-100)
  let score = Math.min(100, coverageRatio * 100);
  
  // Adjust score based on other factors
  
  // Age factor - younger people have more time to adjust
  const ageFactor = Math.max(0, 1 - (inputs.age / 100));
  
  // Risk tolerance factor
  let riskFactor = 0;
  switch (inputs.riskTolerance) {
    case 'low':
      riskFactor = -5; // Conservative approach might lead to lower returns
      break;
    case 'medium':
      riskFactor = 0; // Neutral
      break;
    case 'high':
      riskFactor = 5; // Higher potential returns but also higher risk
      break;
  }
  
  // Diversification factor
  let diversificationScore = 0;
  if (inputs.hasPropertyInvestments) diversificationScore += 5;
  if (inputs.hasPrivatePension) diversificationScore += 5;
  if (inputs.hasAdditionalIncome) diversificationScore += 5;
  
  // Apply adjustments
  score = score + (ageFactor * 10) + riskFactor + diversificationScore;
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

function determineScoreCategory(score: number): 'critical' | 'concerning' | 'fair' | 'good' | 'excellent' {
  if (score < 20) return 'critical';
  if (score < 40) return 'concerning';
  if (score < 60) return 'fair';
  if (score < 80) return 'good';
  return 'excellent';
}

function generateSuggestions(
  inputs: RetirementInputs, 
  savingsGap: number, 
  score: number
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  
  // Calculate recommended monthly savings increase
  const recommendedMonthlySavingsIncrease = savingsGap / (inputs.retirementAge - inputs.age) * 12;
  
  // Basic suggestions for everyone
  suggestions.push({
    id: 'basic-1',
    title: 'Review Your Budget',
    description: 'Analyze your monthly expenses to identify potential savings opportunities.',
    impact: 'medium',
    actionable: true,
  });
  
  // Score-based suggestions
  if (score < 40) {
    // Critical/Concerning suggestions
    suggestions.push({
      id: 'critical-1',
      title: 'Increase Monthly Savings',
      description: `Consider increasing your monthly savings by at least €${Math.ceil(recommendedMonthlySavingsIncrease)} to bridge your retirement gap.`,
      impact: 'high',
      actionable: true,
    });
    
    suggestions.push({
      id: 'critical-2',
      title: 'Delay Retirement',
      description: 'Consider delaying retirement by a few years to increase savings and reduce the number of years in retirement.',
      impact: 'high',
      actionable: true,
    });
  }
  
  // Employment type specific suggestions
  if (inputs.employmentType === 'self-employed' || inputs.employmentType === 'freelancer') {
    suggestions.push({
      id: 'employment-1',
      title: 'Voluntary State Pension Contributions',
      description: 'As a self-employed individual, consider making voluntary contributions to the German state pension system.',
      impact: 'medium',
      actionable: true,
    });
  }
  
  // Risk tolerance suggestions
  if (inputs.riskTolerance === 'low' && inputs.age < 50) {
    suggestions.push({
      id: 'risk-1',
      title: 'Reconsider Risk Tolerance',
      description: 'Given your age, you might consider a slightly more aggressive investment strategy to potentially increase returns.',
      impact: 'medium',
      actionable: true,
    });
  }
  
  // Diversification suggestions
  if (!inputs.hasPrivatePension) {
    suggestions.push({
      id: 'diversification-1',
      title: 'Consider Private Pension',
      description: 'A private pension plan can provide tax advantages and additional retirement income.',
      impact: 'medium',
      actionable: true,
    });
  }
  
  if (!inputs.hasPropertyInvestments) {
    suggestions.push({
      id: 'diversification-2',
      title: 'Explore Property Investment',
      description: 'Real estate can provide both appreciation and rental income for retirement.',
      impact: 'high',
      actionable: true,
    });
  }
  
  // Tax optimization
  suggestions.push({
    id: 'tax-1',
    title: 'Optimize Tax Situation',
    description: 'Ensure you are taking advantage of all available tax deductions and credits for retirement savings.',
    impact: 'medium',
    actionable: true,
  });
  
  return suggestions;
}

function generateInvestmentIdeas(inputs: RetirementInputs): InvestmentIdea[] {
  const investmentIdeas: InvestmentIdea[] = [];
  
  // Basic investment ideas for everyone
  investmentIdeas.push({
    id: 'investment-1',
    name: 'Globally Diversified ETF Portfolio',
    description: 'A mix of low-cost ETFs covering global stock and bond markets for long-term growth.',
    riskLevel: 'medium',
    expectedReturn: 6,
    minimumInvestment: 1000,
    taxAdvantages: 'Can be held in tax-advantaged accounts',
    suitableFor: ['All investors', 'Long-term goals'],
  });
  
  // Risk-based investment ideas
  if (inputs.riskTolerance === 'low') {
    investmentIdeas.push({
      id: 'investment-low-1',
      name: 'German Government Bonds (Bundesanleihen)',
      description: 'Safe government bonds with stable but lower returns, ideal for conservative investors.',
      riskLevel: 'low',
      expectedReturn: 2.5,
      minimumInvestment: 100,
      taxAdvantages: 'Interest may be partially tax-exempt',
      suitableFor: ['Conservative investors', 'Near-retirement'],
    });
    
    investmentIdeas.push({
      id: 'investment-low-2',
      name: 'Defensive Dividend Stocks',
      description: 'Blue-chip companies with stable dividends and lower volatility.',
      riskLevel: 'low',
      expectedReturn: 4,
      minimumInvestment: 1000,
      taxAdvantages: 'Dividend allowance of €801 per year',
      suitableFor: ['Income-focused investors', 'Lower risk tolerance'],
    });
  }
  
  if (inputs.riskTolerance === 'medium') {
    investmentIdeas.push({
      id: 'investment-medium-1',
      name: 'Balanced Fund (Mischfonds)',
      description: 'A balanced mix of stocks and bonds for moderate growth with reduced volatility.',
      riskLevel: 'medium',
      expectedReturn: 5.5,
      minimumInvestment: 1000,
      taxAdvantages: 'Can be part of tax-advantaged retirement accounts',
      suitableFor: ['Balanced investors', 'Medium-term goals'],
    });
    
    investmentIdeas.push({
      id: 'investment-medium-2',
      name: 'Real Estate Investment Trusts (REITs)',
      description: 'Investments in income-producing real estate without direct property ownership.',
      riskLevel: 'medium',
      expectedReturn: 6,
      minimumInvestment: 1000,
      taxAdvantages: 'Potential for tax-efficient income',
      suitableFor: ['Income investors', 'Diversification seekers'],
    });
  }
  
  if (inputs.riskTolerance === 'high') {
    investmentIdeas.push({
      id: 'investment-high-1',
      name: 'Growth Stock ETFs',
      description: 'Focused on companies with above-average growth potential, higher volatility but potential for greater returns.',
      riskLevel: 'high',
      expectedReturn: 8,
      minimumInvestment: 1000,
      taxAdvantages: 'Long-term capital gains may have tax advantages',
      suitableFor: ['Growth-oriented investors', 'Longer time horizons'],
    });
    
    investmentIdeas.push({
      id: 'investment-high-2',
      name: 'Emerging Markets Funds',
      description: 'Investments in developing economies with higher growth potential and higher risk.',
      riskLevel: 'high',
      expectedReturn: 9,
      minimumInvestment: 1000,
      taxAdvantages: 'Potential for tax-efficient growth',
      suitableFor: ['Risk-tolerant investors', 'Long-term investors'],
    });
  }
  
  // Special cases
  if (inputs.hasPropertyInvestments) {
    investmentIdeas.push({
      id: 'investment-property-1',
      name: 'Property Renovation & Improvement',
      description: 'Invest in improving existing property to increase value and potential rental income.',
      riskLevel: 'medium',
      expectedReturn: 7,
      minimumInvestment: 5000,
      taxAdvantages: 'Renovation costs may be tax-deductible',
      suitableFor: ['Existing property owners', 'DIY-oriented investors'],
    });
  }
  
  return investmentIdeas;
}

function generatePensionPlans(inputs: RetirementInputs): PensionPlan[] {
  const pensionPlans: PensionPlan[] = [];
  
  // German State Pension (for everyone)
  pensionPlans.push({
    id: 'pension-state-1',
    name: 'German State Pension (Gesetzliche Rentenversicherung)',
    description: 'The mandatory state pension system for employees in Germany.',
    providerType: 'government',
    eligibility: ['Employees with 5+ years of contributions', 'Voluntary for self-employed'],
    benefits: ['Guaranteed lifetime income', 'Disability coverage', 'Survivor benefits'],
    taxTreatment: 'Contributions partially tax-deductible, benefits partially taxable',
    suitableFor: ['All employees', 'Self-employed (voluntary)'],
  });
  
  // Riester Pension
  pensionPlans.push({
    id: 'pension-private-1',
    name: 'Riester Pension',
    description: 'Government-subsidized private pension plan with tax advantages.',
    providerType: 'private',
    eligibility: ['Employees subject to social security', 'Civil servants', 'Self-employed with compulsory pension insurance'],
    benefits: ['Government subsidies', 'Tax advantages', 'Guaranteed minimum return'],
    taxTreatment: 'Contributions tax-deductible up to €2,100/year, benefits taxable',
    suitableFor: ['Lower to middle income earners', 'Families with children'],
  });
  
  // Rürup Pension
  if (inputs.employmentType === 'self-employed' || inputs.employmentType === 'freelancer') {
    pensionPlans.push({
      id: 'pension-private-2',
      name: 'Rürup Pension (Basis-Rente)',
      description: 'Private pension plan designed for self-employed individuals and high-income earners.',
      providerType: 'private',
      eligibility: ['Self-employed', 'Freelancers', 'High-income employees'],
      benefits: ['High tax deduction potential', 'Bankruptcy protection', 'Lifetime income'],
      taxTreatment: 'Contributions tax-deductible up to €25,639/year (2023), benefits partially taxable',
      suitableFor: ['Self-employed without access to state pension', 'High-income earners'],
    });
  }
  
  // Company Pension
  if (inputs.employmentType === 'employed') {
    pensionPlans.push({
      id: 'pension-employer-1',
      name: 'Company Pension (Betriebliche Altersvorsorge)',
      description: 'Employer-sponsored pension plan with tax advantages.',
      providerType: 'employer',
      eligibility: ['Employees'],
      benefits: ['Employer contributions', 'Tax advantages', 'Social security savings'],
      taxTreatment: 'Contributions tax-free up to 8% of income ceiling, benefits taxable',
      suitableFor: ['Employees with supportive employers', 'Those seeking to reduce tax burden'],
    });
  }
  
  // Direct Insurance
  pensionPlans.push({
    id: 'pension-private-3',
    name: 'Direct Insurance (Direktversicherung)',
    description: 'Life insurance policy taken out by an employer for an employee.',
    providerType: 'private',
    eligibility: ['Employees'],
    benefits: ['Tax advantages', 'Potential employer contributions', 'Flexible payout options'],
    taxTreatment: 'Contributions tax-free up to limits, benefits taxable',
    suitableFor: ['Employees looking for additional retirement savings', 'Those with supportive employers'],
  });
  
  return pensionPlans;
}

function generateTaxBenefits(inputs: RetirementInputs): TaxBenefit[] {
  const taxBenefits: TaxBenefit[] = [];
  
  // Basic tax benefits for everyone
  taxBenefits.push({
    id: 'tax-benefit-1',
    name: 'Retirement Expense Deduction (Altersvorsorgeaufwendungen)',
    description: 'Tax deduction for contributions to the statutory pension insurance and basic pension (Rürup).',
    eligibility: ['All taxpayers contributing to retirement plans'],
    potentialSavings: 'Up to 92% of contributions in 2023, increasing to 100% by 2025',
  });
  
  // Riester subsidies
  taxBenefits.push({
    id: 'tax-benefit-2',
    name: 'Riester Subsidies',
    description: 'Government subsidies and tax benefits for Riester pension plans.',
    eligibility: ['Contributors to Riester pension plans'],
    potentialSavings: 'Basic subsidy of €175/year per person, €300/year per child born after 2008',
  });
  
  // Self-employed specific
  if (inputs.employmentType === 'self-employed' || inputs.employmentType === 'freelancer') {
    taxBenefits.push({
      id: 'tax-benefit-3',
      name: 'Rürup Pension Tax Deduction',
      description: 'Substantial tax deductions for contributions to Rürup pension plans.',
      eligibility: ['Self-employed individuals', 'High-income earners'],
      potentialSavings: 'Up to €25,639 deductible in 2023 (92% of contributions)',
    });
  }
  
  // Employee specific
  if (inputs.employmentType === 'employed') {
    taxBenefits.push({
      id: 'tax-benefit-4',
      name: 'Company Pension Tax Benefits',
      description: 'Tax and social security advantages for contributions to company pension plans.',
      eligibility: ['Employees with company pension plans'],
      potentialSavings: 'Contributions up to 8% of income ceiling free from tax and social security',
    });
  }
  
  // Property related
  if (inputs.hasPropertyInvestments) {
    taxBenefits.push({
      id: 'tax-benefit-5',
      name: 'Property Depreciation (AfA)',
      description: 'Tax deduction for the depreciation of rental property.',
      eligibility: ['Owners of rental property'],
      potentialSavings: '2% of property acquisition cost per year (3% for buildings constructed before 1925)',
    });
  }
  
  return taxBenefits;
}

export function convertToRRSScore(results: RetirementResults): any {
  // Convert score category from lowercase to capitalized version
  let category: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  
  switch (results.scoreCategory) {
    case 'excellent':
      category = 'Excellent';
      break;
    case 'good':
      category = 'Good';
      break;
    case 'fair':
      category = 'Fair';
      break;
    case 'poor':
      category = 'Poor';
      break;
    default:
      category = 'Fair';
  }
  
  // Convert radar scores to breakdown format expected by RRSScore
  // Make sure to include all radar scores for the visualization
  const breakdown = {
    savingsRate: results.radarScores.savingsRate,
    investmentAllocation: results.radarScores.investmentStrategy,
    pensionCoverage: results.radarScores.incomeSecurity,
    retirementReadiness: results.score,
    riskManagement: results.radarScores.riskManagement,
    timeHorizon: results.radarScores.timeHorizon // Add timeHorizon for complete visualization
  };
  
  // Convert string recommendations to structured recommendations with more meaningful impact values
  const recommendations = results.recommendations.map((rec, index) => {
    // Determine impact and priority based on content or index
    let impact = 'Medium';
    let priority = 'Medium';
    
    // Check for keywords in the recommendation text to assign appropriate impact level
    if (rec.toLowerCase().includes('increase') || 
        rec.toLowerCase().includes('critical') || 
        rec.toLowerCase().includes('significant')) {
      impact = 'High';
      priority = 'High';
    } else if (rec.toLowerCase().includes('consider') || 
               rec.toLowerCase().includes('explore')) {
      impact = 'Medium';
      priority = 'Medium';
    } else {
      impact = 'Low';
      priority = 'Low';
    }
    
    // For the first recommendations, prioritize them higher if not already set
    if (index === 0 && impact !== 'High') {
      impact = 'High';
      priority = 'High';
    } else if (index === 1 && impact !== 'High') {
      impact = 'Medium';
      priority = 'Medium';
    }
    
    return {
      title: `Recommendation ${index + 1}`,
      description: rec,
      impact,
      priority
    };
  });
  
  return {
    overall: results.score,
    category,
    breakdown,
    recommendations
  };
} 