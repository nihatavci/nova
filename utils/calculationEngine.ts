import { RRSFormData, RRSScore, CalculationFactors } from '@/types/calculator';

const DEFAULT_CALCULATION_FACTORS: CalculationFactors = {
  inflationRate: 0.02, // 2% annual inflation
  investmentReturns: {
    conservative: 0.04, // 4% annual return
    moderate: 0.06, // 6% annual return
    aggressive: 0.08, // 8% annual return
  },
  lifeExpectancy: 85,
  germanTaxRates: {
    income: 0.42, // 42% maximum income tax rate
    capital: 0.25, // 25% capital gains tax
    pension: 0.18, // 18% average pension tax
  },
  currencyRisk: 0.02, // 2% currency risk factor
};

export function calculateRRSScore(formData: RRSFormData): RRSScore {
  console.log('Calculating RRS Score with form data:', formData);

  // Validate and sanitize input values
  const sanitizeNumber = (value: number): number => {
    console.log('Sanitizing value:', value);
    const sanitized = isNaN(value) || !isFinite(value) ? 0 : Math.max(0, value);
    if (sanitized !== value) {
      console.log('Value was sanitized from', value, 'to', sanitized);
    }
    return sanitized;
  };

  // Calculate total current assets
  const totalAssets = sanitizeNumber(
    formData.financialStatus.savings.germanBankAccounts +
    formData.financialStatus.savings.foreignBankAccounts +
    formData.financialStatus.savings.emergencyFund +
    Object.values(formData.financialStatus.investments).reduce((a, b) => sanitizeNumber(a) + sanitizeNumber(b), 0)
  );
  console.log('Total assets calculated:', totalAssets);

  // Calculate total monthly pension income
  const totalMonthlyPension = sanitizeNumber(
    Object.values(formData.financialStatus.pensions).reduce((a, b) => sanitizeNumber(a) + sanitizeNumber(b), 0)
  );
  console.log('Total monthly pension calculated:', totalMonthlyPension);

  // Calculate years until retirement
  const yearsUntilRetirement = Math.max(0,
    formData.retirementExpectations.desiredRetirementAge - formData.personalInfo.age
  );
  console.log('Years until retirement:', yearsUntilRetirement);

  // Calculate required retirement savings
  const monthlyExpenses = sanitizeNumber(formData.retirementExpectations.monthlyExpenses);
  const yearsInRetirement = Math.max(0,
    DEFAULT_CALCULATION_FACTORS.lifeExpectancy -
    formData.retirementExpectations.desiredRetirementAge
  );
  console.log('Monthly expenses:', monthlyExpenses);
  console.log('Years in retirement:', yearsInRetirement);
  
  const inflationAdjustedExpenses = sanitizeNumber(
    monthlyExpenses *
    Math.pow(
      1 + DEFAULT_CALCULATION_FACTORS.inflationRate,
      yearsUntilRetirement
    )
  );
  console.log('Inflation adjusted expenses:', inflationAdjustedExpenses);

  // Calculate investment returns based on risk tolerance
  const expectedReturn =
    DEFAULT_CALCULATION_FACTORS.investmentReturns[
      formData.retirementExpectations.riskTolerance
    ];
  console.log('Expected return rate:', expectedReturn);

  // Calculate required retirement savings
  const requiredRetirementSavings = sanitizeNumber(
    (inflationAdjustedExpenses * 12 * yearsInRetirement) /
    (1 + expectedReturn - DEFAULT_CALCULATION_FACTORS.inflationRate)
  );
  console.log('Required retirement savings:', requiredRetirementSavings);

  // Calculate savings rate score (0-100)
  const monthlySavingsRate = sanitizeNumber(
    (formData.financialStatus.income.net * 0.2) / 12
  );
  const savingsRateScore = Math.min(
    sanitizeNumber(
      (monthlySavingsRate / Math.max(0.01, formData.financialStatus.income.net / 12)) * 100
    ),
    100
  );

  // Calculate investment allocation score (0-100)
  const investmentAllocationScore = sanitizeNumber(
    calculateInvestmentAllocationScore(
      formData.financialStatus.investments,
      formData.retirementExpectations.riskTolerance
    )
  );

  // Calculate pension coverage score (0-100)
  const pensionCoverageScore = Math.min(
    sanitizeNumber(
      (totalMonthlyPension / Math.max(0.01, monthlyExpenses)) * 100
    ),
    100
  );

  // Calculate retirement readiness score (0-100)
  const currentSavingsProjection = sanitizeNumber(
    totalAssets * Math.pow(1 + expectedReturn, yearsUntilRetirement) +
    sanitizeNumber(formData.retirementExpectations.inheritanceExpectations)
  );
  
  const retirementReadinessScore = Math.min(
    sanitizeNumber(
      (currentSavingsProjection / Math.max(0.01, requiredRetirementSavings)) * 100
    ),
    100
  );

  // Calculate risk management score (0-100)
  const riskManagementScore = sanitizeNumber(
    calculateRiskManagementScore(formData, DEFAULT_CALCULATION_FACTORS)
  );

  // Calculate scores
  const scores = {
    savingsRate: Math.round(savingsRateScore),
    investmentAllocation: Math.round(investmentAllocationScore),
    pensionCoverage: Math.round(pensionCoverageScore),
    retirementReadiness: Math.round(retirementReadinessScore),
    riskManagement: Math.round(riskManagementScore)
  };
  console.log('Calculated scores:', scores);

  // Calculate overall score
  const overallScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
  );
  console.log('Overall score:', overallScore);

  // Generate recommendations
  const recommendations = generateRecommendations(
    formData,
    scores,
    DEFAULT_CALCULATION_FACTORS
  );

  const result: RRSScore = {
    overall: overallScore,
    breakdown: scores,
    category: determineCategory(overallScore),
    recommendations
  };
  console.log('Final RRS Score result:', result);

  return result;
}

function calculateInvestmentAllocationScore(
  investments: RRSFormData['financialStatus']['investments'],
  riskTolerance: RRSFormData['retirementExpectations']['riskTolerance']
): number {
  const sanitizeNumber = (value: number): number => {
    return isNaN(value) || !isFinite(value) ? 0 : Math.max(0, value);
  };

  const totalInvestments = Object.values(investments).reduce(
    (a, b) => sanitizeNumber(a) + sanitizeNumber(b),
    0
  );
  
  if (totalInvestments === 0) return 0;

  const allocation = {
    stocks: sanitizeNumber(investments.stocks) / totalInvestments,
    bonds: sanitizeNumber(investments.bonds) / totalInvestments,
    funds: sanitizeNumber(investments.funds) / totalInvestments,
    realEstate: sanitizeNumber(investments.realEstate) / totalInvestments,
    other: sanitizeNumber(investments.other) / totalInvestments,
  };

  // Ideal allocations based on risk tolerance
  const idealAllocations = {
    conservative: {
      stocks: 0.3,
      bonds: 0.4,
      funds: 0.2,
      realEstate: 0.1,
      other: 0,
    },
    moderate: {
      stocks: 0.5,
      bonds: 0.2,
      funds: 0.2,
      realEstate: 0.1,
      other: 0,
    },
    aggressive: {
      stocks: 0.7,
      bonds: 0.1,
      funds: 0.1,
      realEstate: 0.1,
      other: 0,
    },
  };

  const ideal = idealAllocations[riskTolerance];
  const deviationScore = Object.keys(allocation).reduce((score, key) => {
    const currentAllocation = sanitizeNumber(allocation[key as keyof typeof allocation]);
    const idealAllocation = sanitizeNumber(ideal[key as keyof typeof ideal]);
    const deviation = Math.abs(currentAllocation - idealAllocation);
    return sanitizeNumber(score - deviation * 100);
  }, 100);

  return Math.max(0, Math.min(100, deviationScore));
}

function calculateRiskManagementScore(
  formData: RRSFormData,
  factors: CalculationFactors
): number {
  const sanitizeNumber = (value: number): number => {
    return isNaN(value) || !isFinite(value) ? 0 : Math.max(0, value);
  };

  let score = 100;

  // Check emergency fund (should cover 6 months of expenses)
  const monthlyExpenses = sanitizeNumber(formData.retirementExpectations.monthlyExpenses);
  const emergencyFund = sanitizeNumber(formData.financialStatus.savings.emergencyFund);
  const emergencyFundScore = Math.min(
    sanitizeNumber((emergencyFund / Math.max(0.01, monthlyExpenses * 6)) * 100),
    100
  );
  score = sanitizeNumber(score * (0.3 + (0.7 * emergencyFundScore) / 100));

  // Check diversification
  const totalInvestments = Object.values(formData.financialStatus.investments).reduce(
    (a, b) => sanitizeNumber(a) + sanitizeNumber(b),
    0
  );
  const diversificationScore = totalInvestments > 0
    ? Math.min(
        Object.values(formData.financialStatus.investments)
          .filter(v => sanitizeNumber(v) > 0)
          .length * 20,
        100
      )
    : 0;
  score = sanitizeNumber(score * (0.3 + (0.7 * diversificationScore) / 100));

  // Check international exposure
  const totalPensions = Object.values(formData.financialStatus.pensions).reduce(
    (a, b) => sanitizeNumber(a) + sanitizeNumber(b),
    0
  );
  const internationalExposure = sanitizeNumber(
    (sanitizeNumber(formData.financialStatus.savings.foreignBankAccounts) +
      sanitizeNumber(formData.financialStatus.pensions.foreignPensions)) /
    Math.max(0.01, totalInvestments + totalPensions)
  );
  const internationalScore = Math.min(internationalExposure * 200, 100);
  score = sanitizeNumber(score * (0.3 + (0.7 * internationalScore) / 100));

  return Math.max(0, Math.min(100, score));
}

function determineCategory(score: number): RRSScore['category'] {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
}

function generateRecommendations(
  formData: RRSFormData,
  scores: {
    savingsRate: number;
    investmentAllocation: number;
    pensionCoverage: number;
    retirementReadiness: number;
    riskManagement: number;
  },
  factors: CalculationFactors
): RRSScore['recommendations'] {
  const recommendations: RRSScore['recommendations'] = [];

  // Savings Rate Recommendations
  if (scores.savingsRate < 70) {
    recommendations.push({
      title: 'Increase Your Savings Rate',
      description:
        'Consider setting up automatic transfers to your savings account and review your monthly expenses for potential savings opportunities.',
      impact: 'High',
      priority: 'High'
    });
  }

  // Investment Allocation Recommendations
  if (scores.investmentAllocation < 70) {
    recommendations.push({
      title: 'Optimize Investment Portfolio',
      description: `Based on your ${formData.retirementExpectations.riskTolerance} risk tolerance, consider rebalancing your portfolio to achieve better diversification.`,
      impact: 'High',
      priority: 'High'
    });
  }

  // Pension Coverage Recommendations
  if (scores.pensionCoverage < 70) {
    recommendations.push({
      title: 'Enhance Pension Coverage',
      description:
        'Look into additional private pension options or increase contributions to your existing pension plans.',
      impact: 'High',
      priority: 'Medium'
    });
  }

  // Risk Management Recommendations
  if (scores.riskManagement < 70) {
    recommendations.push({
      title: 'Improve Risk Management',
      description:
        'Consider building a larger emergency fund and diversifying your investments across different asset classes.',
      impact: 'Medium',
      priority: 'Medium'
    });
  }

  // Additional Recommendations
  if (formData.personalInfo.yearsInGermany < 5) {
    recommendations.push({
      title: 'Understand German Pension System',
      description:
        'Familiarize yourself with the German pension system and consider consulting with a financial advisor who specializes in expat retirement planning.',
      impact: 'Medium',
      priority: 'Medium'
    });
  }

  return recommendations.sort((a, b) => getImpactValue(a.impact) - getImpactValue(b.impact));
}

function getImpactValue(impact: 'High' | 'Medium' | 'Low'): number {
  switch (impact) {
    case 'High':
      return 90;
    case 'Medium':
      return 60;
    case 'Low':
      return 30;
    default:
      return 0;
  }
} 