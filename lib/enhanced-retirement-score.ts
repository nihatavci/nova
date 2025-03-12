/**
 * Enhanced Retirement Readiness Score (RRS) Calculation
 * 
 * This module implements a comprehensive approach to calculating retirement readiness
 * that considers multiple dimensions of retirement preparedness including:
 * - Income replacement
 * - Savings adequacy
 * - Debt management
 * - Investment diversification
 * - Retirement planning knowledge
 * - Special circumstances (expat status, etc.)
 */

import { 
  calculateNetIncome, 
  calculateFutureValue, 
  calculateRequiredSavings
} from './financial-calculations';

// Constants for calculations
const INVESTMENT_RETURNS = {
  conservative: 0.04,  // 4% annual return
  balanced: 0.06,      // 6% annual return
  growth: 0.08,        // 8% annual return
  aggressive: 0.10     // 10% annual return
};

// Inflation assumption
const INFLATION_RATE = 0.02; // 2% annual inflation

// Types for the enhanced RRS calculation
export interface EnhancedRRSInput {
  // Core demographics
  age: number;
  gender: string;
  retirementAge: number;
  
  // Financial status
  grossMonthlyIncome: number;
  currentSavings: number;
  monthlyContribution: number;
  debtLevel?: number; // Optional: total debt amount
  
  // Risk profile
  riskTolerance: number; // 1-10 scale
  investmentExperience: string;
  
  // Special circumstances
  isExpat: boolean;
  hasInvestmentProperty: boolean;
  hasForeignIncome: boolean;
  
  // Tax situation
  taxClass?: string;
  maritalStatus?: string;
  children?: string;
  residenceStatus?: string;
  
  // Retirement expectations
  retirementGoal?: string; // e.g., "modest", "comfortable", "luxurious"
}

export interface ComponentScores {
  incomeReplacement: number;
  savingsAdequacy: number;
  debtManagement: number;
  investmentDiversification: number;
  retirementKnowledge: number;
  specialCircumstances: number;
}

export interface FinancialProjections {
  currentNetWorth: number;
  projectedRetirementSavings: number;
  requiredRetirementSavings: number;
  savingsGap: number;
  netMonthlyIncome: number;
  estimatedMonthlyRetirementIncome: number;
  incomeReplacementRate: number;
  safeWithdrawalAmount: number;
}

export interface TaxOptimization {
  potentialAnnualSavings: number;
  recommendedVehicles: string[];
  expatSpecificOpportunities: string[];
}

export interface MonteCarloResults {
  successProbability: number;
  medianOutcome: number;
  worstCaseOutcome: number;
  bestCaseOutcome: number;
}

export interface ActionPlan {
  prioritizedActions: string[];
  savingsAdjustment: number;
  retirementAgeAdjustment: number;
  investmentStrategyChanges: string[];
}

export interface EnhancedRRSResult {
  rrsScore: number;
  rrsCategory: string;
  componentScores: ComponentScores;
  financialProjections: FinancialProjections;
  investmentAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
  taxOptimization: TaxOptimization;
  monteCarloResults: MonteCarloResults;
  actionPlan: ActionPlan;
}

/**
 * Calculate the Income Replacement Ratio score
 * @param projectedSavings Projected savings at retirement
 * @param requiredSavings Required savings for retirement
 * @param yearsInRetirement Expected years in retirement
 * @returns Score from 0-100
 */
function calculateIncomeReplacementScore(
  projectedSavings: number,
  requiredSavings: number,
  yearsInRetirement: number
): number {
  // Calculate monthly income from projected savings using 4% rule
  const monthlyIncomeFromSavings = (projectedSavings * 0.04) / 12;
  
  // Calculate required monthly income
  const requiredMonthlyIncome = (requiredSavings * 0.04) / 12;
  
  // Calculate replacement ratio
  const replacementRatio = monthlyIncomeFromSavings / requiredMonthlyIncome;
  
  // Score based on replacement ratio
  if (replacementRatio >= 0.9) return 100;
  if (replacementRatio >= 0.8) return 85;
  if (replacementRatio >= 0.7) return 70;
  if (replacementRatio >= 0.6) return 55;
  if (replacementRatio >= 0.5) return 40;
  return 25;
}

/**
 * Calculate the Savings Adequacy score
 * @param projectedSavings Projected savings at retirement
 * @param requiredSavings Required savings for retirement
 * @returns Score from 0-100
 */
function calculateSavingsAdequacyScore(
  projectedSavings: number,
  requiredSavings: number
): number {
  // Calculate savings ratio
  const savingsRatio = projectedSavings / requiredSavings;
  
  // Score based on savings ratio
  if (savingsRatio >= 1.0) return 100;
  if (savingsRatio >= 0.8) return 80;
  if (savingsRatio >= 0.6) return 60;
  if (savingsRatio >= 0.4) return 40;
  return 20;
}

/**
 * Calculate the Debt Management score
 * @param debtLevel Total debt amount
 * @param annualIncome Annual income
 * @returns Score from 0-100
 */
function calculateDebtManagementScore(
  debtLevel: number = 0,
  annualIncome: number
): number {
  // If no debt information, assume average score
  if (debtLevel === 0) return 70;
  
  // Calculate debt-to-income ratio
  const debtToIncomeRatio = debtLevel / annualIncome;
  
  // Score based on debt-to-income ratio
  if (debtToIncomeRatio < 0.2) return 100;
  if (debtToIncomeRatio < 0.4) return 75;
  if (debtToIncomeRatio < 0.6) return 50;
  if (debtToIncomeRatio < 0.8) return 25;
  return 0;
}

/**
 * Calculate the Investment Diversification score
 * @param investmentExperience Investment experience level
 * @param riskTolerance Risk tolerance level (1-10)
 * @param age Current age
 * @returns Score from 0-100
 */
function calculateInvestmentDiversificationScore(
  investmentExperience: string,
  riskTolerance: number,
  age: number
): number {
  // Base score based on investment experience
  let baseScore = 50;
  
  if (investmentExperience === 'none') baseScore = 30;
  if (investmentExperience === 'beginner') baseScore = 50;
  if (investmentExperience === 'intermediate') baseScore = 70;
  if (investmentExperience === 'advanced') baseScore = 90;
  
  // Adjust based on age and risk tolerance alignment
  const idealRiskTolerance = Math.max(1, 10 - Math.floor(age / 10));
  const riskAlignmentFactor = 1 - (Math.abs(riskTolerance - idealRiskTolerance) / 10);
  
  return Math.round(baseScore * riskAlignmentFactor);
}

/**
 * Calculate the Retirement Planning Knowledge score
 * @param knowledgeLevel Knowledge level (derived from questionnaire)
 * @returns Score from 0-100
 */
function calculateRetirementKnowledgeScore(
  knowledgeLevel: string = 'average'
): number {
  // Score based on knowledge level
  if (knowledgeLevel === 'excellent') return 100;
  if (knowledgeLevel === 'good') return 75;
  if (knowledgeLevel === 'average') return 50;
  if (knowledgeLevel === 'limited') return 25;
  return 0;
}

/**
 * Calculate the Special Circumstances Adjustment score
 * @param isExpat Whether the person is an expat
 * @param hasInvestmentProperty Whether the person has investment property
 * @param hasForeignIncome Whether the person has foreign income
 * @returns Score adjustment from -20 to +20
 */
function calculateSpecialCircumstancesScore(
  isExpat: boolean,
  hasInvestmentProperty: boolean,
  hasForeignIncome: boolean
): number {
  let score = 50; // Base score
  
  // Adjust for expat status
  if (isExpat) score += 10;
  
  // Adjust for investment property
  if (hasInvestmentProperty) score += 10;
  
  // Adjust for foreign income
  if (hasForeignIncome) score += 10;
  
  // Cap at 0-100
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate life expectancy based on gender and age
 * @param gender Gender ('male', 'female', or 'other')
 * @param age Current age
 * @returns Estimated life expectancy
 */
function calculateLifeExpectancy(
  gender: string,
  age: number
): number {
  // Base life expectancy (German averages)
  const baseLifeExpectancy = gender === 'female' ? 83 : 78;
  
  // Adjust based on current age (the older you are, the longer you're expected to live)
  const ageAdjustment = Math.max(0, Math.floor((age - 30) / 10));
  
  return baseLifeExpectancy + ageAdjustment;
}

/**
 * Calculate tax optimization opportunities
 * @param isExpat Whether the person is an expat
 * @param grossMonthlyIncome Monthly gross income
 * @param hasInvestmentProperty Whether the person has investment property
 * @param hasForeignIncome Whether the person has foreign income
 * @returns Tax optimization information
 */
function calculateTaxOptimization(
  isExpat: boolean,
  grossMonthlyIncome: number,
  hasInvestmentProperty: boolean,
  hasForeignIncome: boolean
): TaxOptimization {
  const annualIncome = grossMonthlyIncome * 12;
  let potentialSavings = 0;
  const recommendedVehicles: string[] = [];
  const expatSpecificOpportunities: string[] = [];
  
  // Base savings potential (2-5% of income)
  potentialSavings = annualIncome * 0.02;
  
  // Add standard recommendations
  recommendedVehicles.push('Riester Pension');
  recommendedVehicles.push('Rürup Pension');
  
  // Expat-specific optimizations
  if (isExpat) {
    potentialSavings += annualIncome * 0.02;
    expatSpecificOpportunities.push('Foreign income exclusion');
    expatSpecificOpportunities.push('Tax treaty benefits');
  }
  
  // Investment property optimizations
  if (hasInvestmentProperty) {
    potentialSavings += annualIncome * 0.01;
    recommendedVehicles.push('Property depreciation');
  }
  
  // Foreign income optimizations
  if (hasForeignIncome) {
    potentialSavings += annualIncome * 0.02;
    expatSpecificOpportunities.push('Foreign tax credits');
  }
  
  return {
    potentialAnnualSavings: Math.round(potentialSavings),
    recommendedVehicles,
    expatSpecificOpportunities
  };
}

/**
 * Run Monte Carlo simulations for retirement projections
 * @param currentSavings Current retirement savings
 * @param monthlyContribution Monthly contribution to retirement
 * @param yearsToRetirement Years until retirement
 * @param yearsInRetirement Expected years in retirement
 * @param riskTolerance Risk tolerance (1-10)
 * @returns Monte Carlo simulation results
 */
function runMonteCarloSimulations(
  currentSavings: number,
  monthlyContribution: number,
  yearsToRetirement: number,
  yearsInRetirement: number,
  riskTolerance: number
): MonteCarloResults {
  // In a real implementation, this would run actual Monte Carlo simulations
  // For now, we'll use a simplified model
  
  // Map risk tolerance to expected return and volatility
  const expectedReturn = 0.04 + (riskTolerance * 0.006); // 4% to 10%
  const volatility = 0.05 + (riskTolerance * 0.01); // 5% to 15%
  
  // Calculate median outcome (similar to our standard projection)
  const medianOutcome = calculateFutureValue(
    monthlyContribution,
    yearsToRetirement,
    expectedReturn,
    currentSavings
  );
  
  // Calculate worst case (10th percentile)
  const worstCaseOutcome = calculateFutureValue(
    monthlyContribution,
    yearsToRetirement,
    expectedReturn - volatility,
    currentSavings
  );
  
  // Calculate best case (90th percentile)
  const bestCaseOutcome = calculateFutureValue(
    monthlyContribution,
    yearsToRetirement,
    expectedReturn + volatility,
    currentSavings
  );
  
  // Calculate success probability
  const requiredMonthlyIncome = monthlyContribution * 2; // Simplified assumption
  const requiredSavings = requiredMonthlyIncome * 12 * yearsInRetirement;
  const successProbability = Math.min(100, Math.round((medianOutcome / requiredSavings) * 100));
  
  return {
    successProbability,
    medianOutcome: Math.round(medianOutcome),
    worstCaseOutcome: Math.round(worstCaseOutcome),
    bestCaseOutcome: Math.round(bestCaseOutcome)
  };
}

/**
 * Generate an action plan based on RRS results
 * @param rrsScore Overall RRS score
 * @param componentScores Individual component scores
 * @param projectedSavings Projected retirement savings
 * @param requiredSavings Required retirement savings
 * @returns Action plan with prioritized recommendations
 */
function generateActionPlan(
  rrsScore: number,
  componentScores: ComponentScores,
  projectedSavings: number,
  requiredSavings: number
): ActionPlan {
  const prioritizedActions: string[] = [];
  let savingsAdjustment = 0;
  let retirementAgeAdjustment = 0;
  const investmentStrategyChanges: string[] = [];
  
  // Find the lowest scoring components
  const scores = [
    { name: 'incomeReplacement', score: componentScores.incomeReplacement },
    { name: 'savingsAdequacy', score: componentScores.savingsAdequacy },
    { name: 'debtManagement', score: componentScores.debtManagement },
    { name: 'investmentDiversification', score: componentScores.investmentDiversification },
    { name: 'retirementKnowledge', score: componentScores.retirementKnowledge }
  ];
  
  // Sort by score (ascending)
  scores.sort((a, b) => a.score - b.score);
  
  // Generate recommendations based on lowest scores
  for (const component of scores) {
    if (component.name === 'incomeReplacement' && component.score < 70) {
      prioritizedActions.push('Increase retirement savings rate');
      savingsAdjustment = Math.round((requiredSavings - projectedSavings) / 20 / 12); // Monthly increase needed over 20 years
    }
    
    if (component.name === 'savingsAdequacy' && component.score < 70) {
      prioritizedActions.push('Consider delaying retirement by 2-3 years');
      retirementAgeAdjustment = 2;
    }
    
    if (component.name === 'debtManagement' && component.score < 70) {
      prioritizedActions.push('Focus on reducing high-interest debt before retirement');
    }
    
    if (component.name === 'investmentDiversification' && component.score < 70) {
      prioritizedActions.push('Review and diversify investment portfolio');
      investmentStrategyChanges.push('Increase diversification across asset classes');
    }
    
    if (component.name === 'retirementKnowledge' && component.score < 70) {
      prioritizedActions.push('Learn more about retirement planning and investment strategies');
    }
  }
  
  // Add general recommendations if needed
  if (prioritizedActions.length < 2) {
    prioritizedActions.push('Regularly review and adjust retirement plan');
  }
  
  return {
    prioritizedActions,
    savingsAdjustment,
    retirementAgeAdjustment,
    investmentStrategyChanges
  };
}

/**
 * Categorize RRS score into descriptive category
 * @param score RRS score (0-100)
 * @returns Category description
 */
function categorizeRRS(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs Attention';
  return 'Critical';
}

/**
 * Calculate the enhanced retirement readiness score
 * @param inputs User inputs for RRS calculation
 * @returns Enhanced RRS result with detailed components
 */
export function calculateEnhancedRRS(inputs: EnhancedRRSInput): EnhancedRRSResult {
  // Extract inputs
  const {
    age,
    gender,
    retirementAge,
    grossMonthlyIncome,
    currentSavings,
    monthlyContribution,
    debtLevel = 0,
    riskTolerance,
    investmentExperience,
    isExpat,
    hasInvestmentProperty,
    hasForeignIncome,
    retirementGoal = 'comfortable'
  } = inputs;
  
  // Calculate years until retirement
  const yearsToRetirement = retirementAge - age;
  
  // Calculate life expectancy and years in retirement
  const lifeExpectancy = calculateLifeExpectancy(gender, age);
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Calculate net income
  const netMonthlyIncome = calculateNetIncome(grossMonthlyIncome);
  const annualIncome = grossMonthlyIncome * 12;
  
  // Determine desired replacement ratio based on retirement goal
  let desiredReplacementRatio = 0.7; // Default: 70%
  if (retirementGoal === 'modest') desiredReplacementRatio = 0.6;
  if (retirementGoal === 'comfortable') desiredReplacementRatio = 0.75;
  if (retirementGoal === 'luxurious') desiredReplacementRatio = 0.85;
  
  // Calculate desired monthly income in retirement
  const desiredMonthlyIncome = netMonthlyIncome * desiredReplacementRatio;
  
  // Calculate projected savings at retirement
  const projectedSavings = calculateFutureValue(
    monthlyContribution,
    yearsToRetirement,
    INVESTMENT_RETURNS.balanced,
    currentSavings
  );
  
  // Calculate required savings for desired income
  const requiredSavings = calculateRequiredSavings(
    desiredMonthlyIncome,
    yearsInRetirement
  );
  
  // Calculate estimated monthly retirement income
  const estimatedMonthlyRetirementIncome = (projectedSavings * 0.04) / 12; // 4% rule
  
  // Calculate income replacement rate
  const incomeReplacementRate = estimatedMonthlyRetirementIncome / netMonthlyIncome;
  
  // Calculate component scores
  const incomeReplacementScore = calculateIncomeReplacementScore(
    projectedSavings,
    requiredSavings,
    yearsInRetirement
  );
  
  const savingsAdequacyScore = calculateSavingsAdequacyScore(
    projectedSavings,
    requiredSavings
  );
  
  const debtManagementScore = calculateDebtManagementScore(
    debtLevel,
    annualIncome
  );
  
  const investmentDiversificationScore = calculateInvestmentDiversificationScore(
    investmentExperience,
    riskTolerance,
    age
  );
  
  // For now, use a default value for retirement knowledge
  const retirementKnowledgeScore = calculateRetirementKnowledgeScore();
  
  const specialCircumstancesScore = calculateSpecialCircumstancesScore(
    isExpat,
    hasInvestmentProperty,
    hasForeignIncome
  );
  
  // Calculate weighted RRS
  const componentScores = {
    incomeReplacement: incomeReplacementScore,
    savingsAdequacy: savingsAdequacyScore,
    debtManagement: debtManagementScore,
    investmentDiversification: investmentDiversificationScore,
    retirementKnowledge: retirementKnowledgeScore,
    specialCircumstances: specialCircumstancesScore
  };
  
  const rrsScore = Math.round(
    (incomeReplacementScore * 0.30) +
    (savingsAdequacyScore * 0.25) +
    (debtManagementScore * 0.15) +
    (investmentDiversificationScore * 0.15) +
    (retirementKnowledgeScore * 0.10) +
    (specialCircumstancesScore * 0.05)
  );
  
  // Determine RRS category
  const rrsCategory = categorizeRRS(rrsScore);
  
  // Calculate optimal investment allocation
  const stocksAllocation = Math.max(20, 100 - age);
  const bondsAllocation = Math.min(60, 100 - stocksAllocation - 10);
  const cashAllocation = Math.min(20, 100 - stocksAllocation - bondsAllocation);
  const alternativesAllocation = 100 - stocksAllocation - bondsAllocation - cashAllocation;
  
  const investmentAllocation = {
    stocks: stocksAllocation,
    bonds: bondsAllocation,
    cash: cashAllocation,
    alternatives: alternativesAllocation
  };
  
  // Calculate tax optimization opportunities
  const taxOptimization = calculateTaxOptimization(
    isExpat,
    grossMonthlyIncome,
    hasInvestmentProperty,
    hasForeignIncome
  );
  
  // Run Monte Carlo simulations
  const monteCarloResults = runMonteCarloSimulations(
    currentSavings,
    monthlyContribution,
    yearsToRetirement,
    yearsInRetirement,
    riskTolerance
  );
  
  // Generate action plan
  const actionPlan = generateActionPlan(
    rrsScore,
    componentScores,
    projectedSavings,
    requiredSavings
  );
  
  // Compile financial projections
  const financialProjections = {
    currentNetWorth: currentSavings,
    projectedRetirementSavings: Math.round(projectedSavings),
    requiredRetirementSavings: Math.round(requiredSavings),
    savingsGap: Math.round(requiredSavings - projectedSavings),
    netMonthlyIncome: Math.round(netMonthlyIncome),
    estimatedMonthlyRetirementIncome: Math.round(estimatedMonthlyRetirementIncome),
    incomeReplacementRate: Math.round(incomeReplacementRate * 100),
    safeWithdrawalAmount: Math.round((projectedSavings * 0.04) / 12) // 4% rule
  };
  
  return {
    rrsScore,
    rrsCategory,
    componentScores,
    financialProjections,
    investmentAllocation,
    taxOptimization,
    monteCarloResults,
    actionPlan
  };
} 