export interface PersonalInfo {
  age: number;
  nationality: string;
  yearsInGermany: number;
  intendedRetirementLocation: string;
  maritalStatus: 'single' | 'engaged' | 'married' | 'partnership' | 'history' | 'widowed';
  dependents: number;
  employmentStatus: 'employed' | 'self-employed' | 'freelance' | 'official' | 'student' | 'other';
}

export interface FinancialStatus {
  income: {
    gross: number;
    net: number;
  };
  savings: {
    germanBankAccounts: number;
    foreignBankAccounts: number;
    emergencyFund: number;
  };
  investments: {
    stocks: number;
    bonds: number;
    funds: number;
    realEstate: number;
    other: number;
  };
  pensions: {
    germanStatePension: number;
    foreignPensions: number;
    privatePensions: number;
    companyPensions: number;
  };
}

export interface RetirementExpectations {
  desiredRetirementAge: number;
  monthlyExpenses: number;
  inheritanceExpectations: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  retirementLifestyle: 'modest' | 'comfortable' | 'luxurious';
  financialPriorities?: string;
  paymentPreference?: string;
  investmentPreference?: string;
  monthlyInvestment?: number;
}

export interface RRSFormData {
  personalInfo: PersonalInfo;
  financialStatus: FinancialStatus;
  retirementExpectations: RetirementExpectations;
}

export interface RRSScore {
  overall: number;
  category: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  breakdown: {
    savingsRate: number;
    investmentAllocation: number;
    pensionCoverage: number;
    retirementReadiness: number;
    riskManagement: number;
  };
  recommendations: Array<{
    title: string;
    description: string;
    impact: 'Low' | 'Medium' | 'High';
    priority: 'Low' | 'Medium' | 'High';
  }>;
}

export interface FormOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export type CalculationFactors = {
  inflationRate: number;
  investmentReturns: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
  lifeExpectancy: number;
  germanTaxRates: {
    income: number;
    capital: number;
    pension: number;
  };
  currencyRisk: number;
}; 