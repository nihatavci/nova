/**
 * Financial Calculations Module
 * Contains all equations and formulas for calculating retirement readiness score
 */

// German tax brackets for 2024 (simplified)
const TAX_BRACKETS = [
  { threshold: 11604, rate: 0 },        // 0% up to €11,604
  { threshold: 15786, rate: 0.14 },     // 14% from €11,604 to €15,786
  { threshold: 66761, rate: 0.24 },     // 24% from €15,786 to €66,761
  { threshold: 277826, rate: 0.42 },    // 42% from €66,761 to €277,826
  { threshold: Infinity, rate: 0.45 }   // 45% above €277,826
];

// Social security contribution rates for 2024
const SOCIAL_SECURITY_RATES = {
  pension: 0.186,      // 18.6% (split between employer and employee)
  health: 0.146,       // 14.6% (split between employer and employee)
  unemployment: 0.024, // 2.4% (split between employer and employee)
  care: 0.035,         // 3.5% (split between employer and employee)
  average: 0.20        // Simplified average rate for quick calculations
};

// Contribution assessment ceilings 2024
const CONTRIBUTION_CEILINGS = {
  pension: 7550,       // Monthly ceiling for pension insurance
  health: 5175,        // Monthly ceiling for health insurance
};

// Investment return assumptions
const INVESTMENT_RETURNS = {
  conservative: 0.04,  // 4% annual return
  balanced: 0.06,      // 6% annual return
  growth: 0.08,        // 8% annual return
  aggressive: 0.10     // 10% annual return
};

// Inflation assumption
const INFLATION_RATE = 0.02; // 2% annual inflation

/**
 * Calculate income tax based on German tax brackets
 * @param annualIncome Annual gross income in EUR
 * @returns Annual income tax in EUR
 */
export function calculateIncomeTax(annualIncome: number): number {
  let tax = 0;
  let remainingIncome = annualIncome;
  
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const currentBracket = TAX_BRACKETS[i];
    const previousThreshold = i === 0 ? 0 : TAX_BRACKETS[i-1].threshold;
    
    if (remainingIncome <= 0) break;
    
    const taxableInThisBracket = Math.min(
      remainingIncome,
      currentBracket.threshold - previousThreshold
    );
    
    tax += taxableInThisBracket * currentBracket.rate;
    remainingIncome -= taxableInThisBracket;
  }
  
  return tax;
}

/**
 * Calculate social security contributions
 * @param monthlyIncome Monthly gross income in EUR
 * @returns Monthly social security contributions in EUR
 */
export function calculateSocialSecurity(monthlyIncome: number): number {
  // Calculate pension contribution (employee portion)
  const pensionContribution = Math.min(monthlyIncome, CONTRIBUTION_CEILINGS.pension) * 
    (SOCIAL_SECURITY_RATES.pension / 2);
  
  // Calculate health insurance contribution (employee portion)
  const healthContribution = Math.min(monthlyIncome, CONTRIBUTION_CEILINGS.health) * 
    (SOCIAL_SECURITY_RATES.health / 2);
  
  // Calculate unemployment insurance (employee portion)
  const unemploymentContribution = Math.min(monthlyIncome, CONTRIBUTION_CEILINGS.pension) * 
    (SOCIAL_SECURITY_RATES.unemployment / 2);
  
  // Calculate long-term care insurance (employee portion)
  const careContribution = Math.min(monthlyIncome, CONTRIBUTION_CEILINGS.health) * 
    (SOCIAL_SECURITY_RATES.care / 2);
  
  return pensionContribution + healthContribution + unemploymentContribution + careContribution;
}

/**
 * Calculate net monthly income after tax and social security
 * @param grossMonthlyIncome Monthly gross income in EUR
 * @returns Monthly net income in EUR
 */
export function calculateNetIncome(grossMonthlyIncome: number): number {
  const annualIncome = grossMonthlyIncome * 12;
  const monthlyIncomeTax = calculateIncomeTax(annualIncome) / 12;
  const socialSecurityContributions = calculateSocialSecurity(grossMonthlyIncome);
  
  return grossMonthlyIncome - monthlyIncomeTax - socialSecurityContributions;
}

/**
 * Calculate future value of investments
 * @param monthlyContribution Monthly contribution in EUR
 * @param years Number of years
 * @param annualReturnRate Annual return rate (decimal)
 * @param initialAmount Initial investment amount in EUR
 * @returns Future value in EUR
 */
export function calculateFutureValue(
  monthlyContribution: number,
  years: number,
  annualReturnRate: number,
  initialAmount: number = 0
): number {
  const monthlyRate = annualReturnRate / 12;
  const months = years * 12;
  
  // Future value of initial amount
  const futureValueInitial = initialAmount * Math.pow(1 + monthlyRate, months);
  
  // Future value of regular contributions (annuity)
  const futureValueContributions = monthlyContribution * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  return futureValueInitial + futureValueContributions;
}

/**
 * Calculate required retirement savings
 * @param desiredMonthlyIncome Desired monthly income in retirement (EUR)
 * @param yearsInRetirement Expected years in retirement
 * @param inflationRate Annual inflation rate (decimal)
 * @param investmentReturnRate Annual investment return rate during retirement (decimal)
 * @returns Required savings at retirement start (EUR)
 */
export function calculateRequiredSavings(
  desiredMonthlyIncome: number,
  yearsInRetirement: number,
  inflationRate: number = INFLATION_RATE,
  investmentReturnRate: number = INVESTMENT_RETURNS.conservative
): number {
  const monthlyRate = investmentReturnRate / 12;
  const months = yearsInRetirement * 12;
  const inflationAdjustedReturn = (1 + investmentReturnRate) / (1 + inflationRate) - 1;
  const monthlyInflationAdjustedRate = inflationAdjustedReturn / 12;
  
  // Present value of an inflation-adjusted annuity
  return desiredMonthlyIncome * 
    (1 - Math.pow(1 + monthlyInflationAdjustedRate, -months)) / monthlyInflationAdjustedRate;
}

/**
 * Calculate retirement readiness score (0-100)
 * @param currentAge Current age
 * @param retirementAge Expected retirement age
 * @param currentSavings Current retirement savings (EUR)
 * @param monthlyContribution Monthly contribution to retirement savings (EUR)
 * @param grossMonthlyIncome Monthly gross income (EUR)
 * @param desiredReplacementRate Desired income replacement rate (decimal, e.g., 0.7 for 70%)
 * @returns Retirement readiness score (0-100)
 */
export function calculateRetirementReadinessScore(
  currentAge: number,
  retirementAge: number,
  currentSavings: number,
  monthlyContribution: number,
  grossMonthlyIncome: number,
  desiredReplacementRate: number = 0.7
): number {
  // Calculate years until retirement
  const yearsUntilRetirement = retirementAge - currentAge;
  
  // Estimate life expectancy (simplified)
  const lifeExpectancy = 85;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Calculate net income
  const netMonthlyIncome = calculateNetIncome(grossMonthlyIncome);
  
  // Calculate desired monthly income in retirement
  const desiredMonthlyIncome = netMonthlyIncome * desiredReplacementRate;
  
  // Calculate projected savings at retirement
  const projectedSavings = calculateFutureValue(
    monthlyContribution,
    yearsUntilRetirement,
    INVESTMENT_RETURNS.balanced,
    currentSavings
  );
  
  // Calculate required savings for desired income
  const requiredSavings = calculateRequiredSavings(
    desiredMonthlyIncome,
    yearsInRetirement
  );
  
  // Calculate the ratio of projected to required savings
  const savingsRatio = projectedSavings / requiredSavings;
  
  // Convert to a score from 0-100
  const rawScore = Math.min(savingsRatio * 100, 100);
  return Math.max(0, Math.round(rawScore));
}

/**
 * Calculate potential annual savings through optimization
 * @param grossMonthlyIncome Monthly gross income (EUR)
 * @param currentAge Current age
 * @param isExpat Whether the person is an expat
 * @param hasInvestmentProperty Whether the person has investment property
 * @param hasForeignIncome Whether the person has foreign income
 * @returns Potential annual savings (EUR)
 */
export function calculatePotentialSavings(
  grossMonthlyIncome: number,
  currentAge: number,
  isExpat: boolean = true,
  hasInvestmentProperty: boolean = false,
  hasForeignIncome: boolean = false
): number {
  let potentialSavings = 0;
  const annualIncome = grossMonthlyIncome * 12;
  
  // Base optimization (everyone can achieve this)
  potentialSavings += annualIncome * 0.02; // 2% of annual income
  
  // Age-based optimization
  if (currentAge > 50) {
    potentialSavings += 1200; // Additional retirement contribution benefits
  }
  
  // Expat-specific optimizations
  if (isExpat) {
    potentialSavings += annualIncome * 0.03; // 3% through expat-specific tax benefits
    
    // Foreign income optimizations
    if (hasForeignIncome) {
      potentialSavings += annualIncome * 0.02; // 2% through foreign income structuring
    }
  }
  
  // Investment property optimizations
  if (hasInvestmentProperty) {
    potentialSavings += 2500; // Depreciation and expense optimization
  }
  
  // Income-based additional optimizations
  if (annualIncome > 100000) {
    potentialSavings += annualIncome * 0.015; // 1.5% additional for high earners
  }
  
  return Math.round(potentialSavings);
}

/**
 * Generate investment allocation recommendation
 * @param age Current age
 * @param riskTolerance Risk tolerance (1-5, where 1 is lowest)
 * @returns Recommended allocation percentages
 */
export function generateInvestmentAllocation(
  age: number,
  riskTolerance: number
): { stocks: number; bonds: number; cash: number; alternatives: number } {
  // Base allocation based on age (100 - age rule, modified)
  let stocksBase = Math.max(30, 110 - age);
  
  // Adjust based on risk tolerance
  const riskAdjustment = (riskTolerance - 3) * 10; // -20 to +20
  let stocks = Math.min(90, Math.max(20, stocksBase + riskAdjustment));
  
  // Calculate bonds as the primary remainder
  let bonds = Math.min(70, Math.max(10, 100 - stocks - 10));
  
  // Allocate the rest to cash and alternatives
  let cash = Math.max(5, 100 - stocks - bonds - 5);
  let alternatives = 100 - stocks - bonds - cash;
  
  return {
    stocks: Math.round(stocks),
    bonds: Math.round(bonds),
    cash: Math.round(cash),
    alternatives: Math.round(alternatives)
  };
}

/**
 * Generate a comprehensive financial assessment
 * @param inputs User inputs
 * @returns Comprehensive financial assessment
 */
export function generateFinancialAssessment(inputs: {
  age: number;
  retirementAge: number;
  grossMonthlyIncome: number;
  currentSavings: number;
  monthlyContribution: number;
  riskTolerance: number;
  isExpat: boolean;
  hasInvestmentProperty: boolean;
  hasForeignIncome: boolean;
}) {
  const {
    age,
    retirementAge,
    grossMonthlyIncome,
    currentSavings,
    monthlyContribution,
    riskTolerance,
    isExpat,
    hasInvestmentProperty,
    hasForeignIncome
  } = inputs;
  
  // Calculate retirement readiness score
  const rrsScore = calculateRetirementReadinessScore(
    age,
    retirementAge,
    currentSavings,
    monthlyContribution,
    grossMonthlyIncome
  );
  
  // Calculate potential savings
  const potentialSavings = calculatePotentialSavings(
    grossMonthlyIncome,
    age,
    isExpat,
    hasInvestmentProperty,
    hasForeignIncome
  );
  
  // Generate investment allocation
  const investmentAllocation = generateInvestmentAllocation(age, riskTolerance);
  
  // Calculate projected retirement savings
  const yearsUntilRetirement = retirementAge - age;
  const projectedSavings = calculateFutureValue(
    monthlyContribution,
    yearsUntilRetirement,
    INVESTMENT_RETURNS.balanced,
    currentSavings
  );
  
  // Calculate monthly net income
  const netMonthlyIncome = calculateNetIncome(grossMonthlyIncome);
  
  // Calculate estimated monthly retirement income
  const estimatedMonthlyRetirementIncome = projectedSavings * 0.04 / 12; // 4% rule
  
  // Calculate income replacement rate
  const incomeReplacementRate = estimatedMonthlyRetirementIncome / netMonthlyIncome;
  
  return {
    rrsScore,
    potentialSavings,
    investmentAllocation,
    projectedSavings,
    netMonthlyIncome,
    estimatedMonthlyRetirementIncome,
    incomeReplacementRate: Math.round(incomeReplacementRate * 100)
  };
} 