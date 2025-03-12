/**
 * Test Enhanced Retirement Readiness Score Calculation
 * 
 * This script tests the enhanced retirement readiness score calculation
 * with sample inputs and logs the results.
 */

// Import the enhanced RRS calculation function
import { calculateEnhancedRRS } from './lib/enhanced-retirement-score';

// Sample input data
const sampleInput = {
  // Core demographics
  age: 35,
  gender: 'male',
  retirementAge: 67,
  
  // Financial status
  grossMonthlyIncome: 5000,
  currentSavings: 50000,
  monthlyContribution: 500,
  debtLevel: 100000, // e.g., mortgage
  
  // Risk profile
  riskTolerance: 7, // 1-10 scale
  investmentExperience: 'intermediate',
  
  // Special circumstances
  isExpat: true,
  hasInvestmentProperty: false,
  hasForeignIncome: true,
  
  // Tax situation
  taxClass: '1',
  maritalStatus: 'single',
  children: '0',
  residenceStatus: 'permanent',
  
  // Retirement expectations
  retirementGoal: 'comfortable'
};

// Calculate the enhanced RRS
try {
  console.log('Calculating Enhanced Retirement Readiness Score...');
  const result = calculateEnhancedRRS(sampleInput);
  
  // Log the results
  console.log('\n=== ENHANCED RRS RESULTS ===');
  console.log(`Overall Score: ${result.rrsScore} (${result.rrsCategory})`);
  
  console.log('\n--- Component Scores ---');
  Object.entries(result.componentScores).forEach(([component, score]) => {
    console.log(`${component}: ${score}`);
  });
  
  console.log('\n--- Financial Projections ---');
  console.log(`Current Net Worth: €${result.financialProjections.currentNetWorth.toLocaleString('de-DE')}`);
  console.log(`Projected Retirement Savings: €${result.financialProjections.projectedRetirementSavings.toLocaleString('de-DE')}`);
  console.log(`Required Retirement Savings: €${result.financialProjections.requiredRetirementSavings.toLocaleString('de-DE')}`);
  console.log(`Savings Gap: €${result.financialProjections.savingsGap.toLocaleString('de-DE')}`);
  console.log(`Net Monthly Income: €${result.financialProjections.netMonthlyIncome.toLocaleString('de-DE')}`);
  console.log(`Estimated Monthly Retirement Income: €${result.financialProjections.estimatedMonthlyRetirementIncome.toLocaleString('de-DE')}`);
  console.log(`Income Replacement Rate: ${result.financialProjections.incomeReplacementRate}%`);
  console.log(`Safe Withdrawal Amount: €${result.financialProjections.safeWithdrawalAmount.toLocaleString('de-DE')}/month`);
  
  console.log('\n--- Investment Allocation ---');
  Object.entries(result.investmentAllocation).forEach(([asset, percentage]) => {
    console.log(`${asset}: ${percentage}%`);
  });
  
  console.log('\n--- Tax Optimization ---');
  console.log(`Potential Annual Savings: €${result.taxOptimization.potentialAnnualSavings.toLocaleString('de-DE')}`);
  console.log('Recommended Vehicles:');
  result.taxOptimization.recommendedVehicles.forEach(vehicle => {
    console.log(`- ${vehicle}`);
  });
  console.log('Expat-Specific Opportunities:');
  result.taxOptimization.expatSpecificOpportunities.forEach(opportunity => {
    console.log(`- ${opportunity}`);
  });
  
  console.log('\n--- Monte Carlo Results ---');
  console.log(`Success Probability: ${result.monteCarloResults.successProbability}%`);
  console.log(`Median Outcome: €${result.monteCarloResults.medianOutcome.toLocaleString('de-DE')}`);
  console.log(`Worst Case Outcome: €${result.monteCarloResults.worstCaseOutcome.toLocaleString('de-DE')}`);
  console.log(`Best Case Outcome: €${result.monteCarloResults.bestCaseOutcome.toLocaleString('de-DE')}`);
  
  console.log('\n--- Action Plan ---');
  console.log('Prioritized Actions:');
  result.actionPlan.prioritizedActions.forEach(action => {
    console.log(`- ${action}`);
  });
  console.log(`Recommended Monthly Savings Increase: €${result.actionPlan.savingsAdjustment.toLocaleString('de-DE')}`);
  console.log(`Recommended Retirement Age Adjustment: +${result.actionPlan.retirementAgeAdjustment} years`);
  console.log('Investment Strategy Changes:');
  result.actionPlan.investmentStrategyChanges.forEach(change => {
    console.log(`- ${change}`);
  });
  
} catch (error) {
  console.error('Error calculating enhanced RRS:', error);
} 