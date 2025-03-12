import { NextRequest, NextResponse } from 'next/server';
import { calculateRetirementReadiness, RetirementInputs, convertToRRSScore } from '@/utils/retirementCalculator';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Received retirement calculator inputs:', body);
    
    // Validate the input
    const validationResult = validateRetirementInputs(body);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.message },
        { status: 400 }
      );
    }
    
    // Cast the body to RetirementInputs
    const inputs: RetirementInputs = {
      age: Number(body.age),
      currentSalary: Number(body.currentSalary),
      currentSavings: Number(body.currentSavings),
      monthlySavings: Number(body.monthlySavings),
      riskTolerance: body.riskTolerance,
      retirementAge: Number(body.retirementAge),
      desiredRetirementIncome: Number(body.desiredRetirementIncome || body.currentSalary * 0.7),
      hasAdditionalIncome: Boolean(body.hasAdditionalIncome),
      additionalIncomeAmount: Number(body.additionalIncomeAmount || 0),
      hasPropertyInvestments: Boolean(body.hasPropertyInvestments),
      propertyValue: Number(body.propertyValue || 0),
      hasPrivatePension: Boolean(body.hasPrivatePension),
      privatePensionValue: Number(body.privatePensionValue || 0),
      employmentType: body.employmentType,
      yearsInGermany: Number(body.yearsInGermany),
      germanCitizenship: Boolean(body.germanCitizenship),
    };
    
    // Calculate retirement readiness
    const results = calculateRetirementReadiness(inputs);
    
    // Convert to RRSScore format for the frontend
    const rrsScore = convertToRRSScore(results);
    
    // Return the results
    return NextResponse.json({
      success: true,
      data: {
        results: results,
        score: rrsScore,
        rrsScore: rrsScore, // For backward compatibility
      }
    });
  } catch (error) {
    console.error('Error calculating retirement readiness:', error);
    return NextResponse.json(
      { error: 'Failed to calculate retirement readiness' },
      { status: 500 }
    );
  }
}

function validateRetirementInputs(inputs: any): { isValid: boolean; message?: string } {
  // Required fields
  const requiredFields = ['age', 'currentSalary', 'currentSavings', 'monthlySavings', 'riskTolerance', 'retirementAge'];
  
  for (const field of requiredFields) {
    if (inputs[field] === undefined || inputs[field] === null || inputs[field] === '') {
      return { isValid: false, message: `Missing required field: ${field}` };
    }
  }
  
  // Validate risk tolerance
  if (!['low', 'medium', 'high'].includes(inputs.riskTolerance)) {
    return { isValid: false, message: 'Risk tolerance must be one of: low, medium, high' };
  }
  
  // Validate employment type if provided
  if (inputs.employmentType && !['employed', 'self-employed', 'civil-servant', 'freelancer'].includes(inputs.employmentType)) {
    return { isValid: false, message: 'Employment type must be one of: employed, self-employed, civil-servant, freelancer' };
  }
  
  // Age validations
  if (Number(inputs.age) < 18 || Number(inputs.age) > 90) {
    return { isValid: false, message: 'Age must be between 18 and 90' };
  }
  
  if (Number(inputs.retirementAge) <= Number(inputs.age)) {
    return { isValid: false, message: 'Retirement age must be greater than current age' };
  }
  
  // All validations passed
  return { isValid: true };
} 