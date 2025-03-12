export interface RetirementScoreResponse {
  success: boolean;
  error?: string;
  data: {
    score: number;
    scoreCategory: 'excellent' | 'good' | 'fair' | 'concerning' | 'critical';
    potentialSavings: number;
    netMonthlyIncome: number;
    projectedSavings: number;
    incomeReplacementRate: number;
    savingsGap: number;
    radarScores: {
      savingsRate: number;
      investmentStrategy: number;
      riskManagement: number;
      timeHorizon: number;
      incomeSecurity: number;
    };
    recommendations: Array<{
      title: string;
      description: string;
      actionItems: string[];
    }>;
  };
} 