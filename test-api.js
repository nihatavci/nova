/**
 * Test API for Enhanced Retirement Readiness Score
 * 
 * This script tests the API endpoint for the enhanced retirement readiness score
 * with sample inputs and logs the results.
 */

// Sample input data
const sampleInput = {
  // Core demographics
  age: "35",
  gender: "male",
  retirementAge: "67",
  
  // Financial status
  grossMonthlyIncome: "5000",
  currentSavings: "50000",
  monthlyContribution: "500",
  debtLevel: "100000", // e.g., mortgage
  
  // Risk profile
  riskTolerance: "7", // 1-10 scale
  investmentExperience: "intermediate",
  
  // Special circumstances
  isExpat: "true",
  hasInvestmentProperty: "false",
  hasForeignIncome: "true",
  
  // Tax situation
  taxClass: "1",
  maritalStatus: "single",
  children: "0",
  residenceStatus: "permanent",
  
  // Retirement expectations
  retirementGoal: "comfortable"
};

// Function to test the API
async function testRetirementScoreAPI() {
  try {
    console.log('Testing Retirement Score API...');
    console.log('Sending request with sample data:', JSON.stringify(sampleInput, null, 2));
    
    const response = await fetch('http://localhost:3000/api/retirement-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleInput),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    console.log('\n=== API RESPONSE ===');
    console.log('Success:', result.success);
    
    if (result.success) {
      console.log('\n--- Basic Results ---');
      console.log(`RRS Score: ${result.data.rrsScore}`);
      console.log(`RRS Category: ${result.data.rrsCategory}`);
      console.log(`Potential Savings: €${result.data.potentialSavings.toLocaleString('de-DE')}`);
      
      console.log('\n--- Investment Allocation ---');
      Object.entries(result.data.investmentAllocation).forEach(([asset, percentage]) => {
        console.log(`${asset}: ${percentage}%`);
      });
      
      console.log('\n--- Financial Projections ---');
      console.log(`Projected Savings: €${result.data.projectedSavings.toLocaleString('de-DE')}`);
      console.log(`Net Monthly Income: €${result.data.netMonthlyIncome.toLocaleString('de-DE')}`);
      console.log(`Estimated Monthly Retirement Income: €${result.data.estimatedMonthlyRetirementIncome.toLocaleString('de-DE')}`);
      console.log(`Income Replacement Rate: ${result.data.incomeReplacementRate}%`);
      
      console.log('\n--- Enhanced Results ---');
      
      console.log('\n--- Component Scores ---');
      Object.entries(result.data.componentScores).forEach(([component, score]) => {
        console.log(`${component}: ${score}`);
      });
      
      console.log('\n--- Tax Optimization ---');
      console.log(`Potential Annual Savings: €${result.data.taxOptimization.potentialAnnualSavings.toLocaleString('de-DE')}`);
      console.log('Recommended Vehicles:');
      result.data.taxOptimization.recommendedVehicles.forEach(vehicle => {
        console.log(`- ${vehicle}`);
      });
      
      console.log('\n--- Monte Carlo Results ---');
      console.log(`Success Probability: ${result.data.monteCarloResults.successProbability}%`);
      console.log(`Median Outcome: €${result.data.monteCarloResults.medianOutcome.toLocaleString('de-DE')}`);
      
      console.log('\n--- Action Plan ---');
      console.log('Prioritized Actions:');
      result.data.actionPlan.prioritizedActions.forEach(action => {
        console.log(`- ${action}`);
      });
      
      console.log('\n--- Report Excerpt ---');
      console.log(result.data.report.substring(0, 200) + '...');
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testRetirementScoreAPI(); 