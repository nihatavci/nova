import { NextRequest, NextResponse } from 'next/server';
import { generateFinancialAssessment } from '@/lib/financial-calculations';
import { generateFinancialReport } from '@/lib/llm-service';
import { calculateEnhancedRRS, EnhancedRRSInput } from '@/lib/enhanced-retirement-score';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Received form data:', body);
    
    // Extract user inputs and convert string values to numbers where needed
    const {
      gender,
      age,
      retirementAge,
      grossMonthlyIncome,
      currentSavings,
      monthlyContribution,
      riskTolerance,
      isExpat,
      hasInvestmentProperty,
      hasForeignIncome,
      taxClass,
      maritalStatus,
      children,
      residenceStatus,
      investmentExperience,
      retirementGoal,
      annualSalary, // Also extract annualSalary if provided
      debtLevel
    } = body;
    
    // Validate required inputs
    if (
      !age ||
      !retirementAge ||
      (!grossMonthlyIncome && !annualSalary) ||
      currentSavings === undefined ||
      monthlyContribution === undefined ||
      !riskTolerance
    ) {
      console.error('Missing required fields:', { 
        age, retirementAge, grossMonthlyIncome, 
        annualSalary, currentSavings, monthlyContribution, riskTolerance 
      });
      
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Convert string values to numbers
    const parsedAge = Number(age);
    const parsedRetirementAge = Number(retirementAge);
    
    // Use grossMonthlyIncome if provided, otherwise calculate from annualSalary
    const parsedGrossMonthlyIncome = grossMonthlyIncome 
      ? Number(grossMonthlyIncome) 
      : (Number(annualSalary) / 12);
    
    const parsedCurrentSavings = Number(currentSavings);
    const parsedMonthlyContribution = Number(monthlyContribution);
    const parsedRiskTolerance = Number(riskTolerance);
    const parsedDebtLevel = debtLevel ? Number(debtLevel) : 0;
    
    // Prepare input for enhanced RRS calculation
    const enhancedRRSInput: EnhancedRRSInput = {
      age: parsedAge,
      gender: gender || 'other',
      retirementAge: parsedRetirementAge,
      grossMonthlyIncome: parsedGrossMonthlyIncome,
      currentSavings: parsedCurrentSavings,
      monthlyContribution: parsedMonthlyContribution,
      debtLevel: parsedDebtLevel,
      riskTolerance: parsedRiskTolerance,
      investmentExperience: investmentExperience || 'beginner',
      isExpat: isExpat === 'true' || isExpat === true,
      hasInvestmentProperty: hasInvestmentProperty === 'true' || hasInvestmentProperty === true,
      hasForeignIncome: hasForeignIncome === 'true' || hasForeignIncome === true,
      taxClass,
      maritalStatus,
      children,
      residenceStatus,
      retirementGoal
    };
    
    // Calculate enhanced retirement readiness score
    const enhancedResults = calculateEnhancedRRS(enhancedRRSInput);
    
    // For backward compatibility, also generate the old assessment results
    const legacyAssessmentResults = generateFinancialAssessment({
      age: parsedAge,
      retirementAge: parsedRetirementAge,
      grossMonthlyIncome: parsedGrossMonthlyIncome,
      currentSavings: parsedCurrentSavings,
      monthlyContribution: parsedMonthlyContribution,
      riskTolerance: parsedRiskTolerance,
      isExpat: isExpat === 'true' || isExpat === true,
      hasInvestmentProperty: hasInvestmentProperty === 'true' || hasInvestmentProperty === true,
      hasForeignIncome: hasForeignIncome === 'true' || hasForeignIncome === true
    });
    
    // Generate financial report using LLM
    const report = await generateFinancialReport(
      {
        age: parsedAge,
        retirementAge: parsedRetirementAge,
        grossMonthlyIncome: parsedGrossMonthlyIncome,
        currentSavings: parsedCurrentSavings,
        monthlyContribution: parsedMonthlyContribution,
        riskTolerance: String(parsedRiskTolerance),
        isExpat: isExpat === 'true' || isExpat === true,
        hasInvestmentProperty: hasInvestmentProperty === 'true' || hasInvestmentProperty === true,
        hasForeignIncome: hasForeignIncome === 'true' || hasForeignIncome === true,
        taxClass,
        maritalStatus,
        children,
        residenceStatus,
        investmentExperience
      },
      legacyAssessmentResults
    );
    
    // Return the enhanced assessment results and report
    return NextResponse.json({
      success: true,
      data: {
        // Legacy fields for backward compatibility
        rrsScore: enhancedResults.rrsScore,
        potentialSavings: enhancedResults.taxOptimization.potentialAnnualSavings,
        investmentAllocation: enhancedResults.investmentAllocation,
        projectedSavings: enhancedResults.financialProjections.projectedRetirementSavings,
        netMonthlyIncome: enhancedResults.financialProjections.netMonthlyIncome,
        estimatedMonthlyRetirementIncome: enhancedResults.financialProjections.estimatedMonthlyRetirementIncome,
        incomeReplacementRate: String(enhancedResults.financialProjections.incomeReplacementRate),
        
        // New enhanced fields
        rrsCategory: enhancedResults.rrsCategory,
        componentScores: enhancedResults.componentScores,
        financialProjections: enhancedResults.financialProjections,
        taxOptimization: enhancedResults.taxOptimization,
        monteCarloResults: enhancedResults.monteCarloResults,
        actionPlan: enhancedResults.actionPlan,
        
        // Report
        report
      }
    });
  } catch (error) {
    console.error('Error calculating retirement score:', error);
    return NextResponse.json(
      { error: 'Failed to calculate retirement score' },
      { status: 500 }
    );
  }
} 