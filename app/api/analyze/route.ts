import { NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { answers, calculatorType } = await req.json();

    // Prepare the prompt based on calculator type
    const prompts = {
      tax: `Analyze this German tax data and provide detailed recommendations:
        - Annual Income: ${answers.income}€
        - Tax Class: ${answers.taxClass}
        - Dependents: ${answers.children}
        - Health Insurance: ${answers.insurance}€/month
        - Other Deductions: ${answers.deductions}€
        Focus on tax optimization strategies and potential savings.`,
      
      investment: `Analyze this investment profile and provide recommendations:
        - Initial Investment: ${answers.initial}€
        - Monthly Contribution: ${answers.monthly}€
        - Time Horizon: ${answers.duration} years
        - Risk Tolerance: ${answers.risk}
        - Investment Goal: ${answers.goal}
        Provide specific ETF allocation suggestions and expected returns.`,
      
      pension: `Analyze this pension planning scenario:
        - Current Age: ${answers.age}
        - Retirement Age: ${answers.retirement}
        - Current Salary: ${answers.currentSalary}€
        - Monthly Contribution: ${answers.contribution}€
        - Employer Match: ${answers.employerMatch}%
        Provide detailed retirement planning advice.`,
      
      mortgage: `Analyze this mortgage scenario:
        - Property Value: ${answers.propertyValue}€
        - Down Payment: ${answers.downPayment}€
        - Loan Duration: ${answers.duration} years
        - Annual Income: ${answers.income}€
        - Location Type: ${answers.location}
        Provide mortgage affordability analysis and recommendations.`
    };

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a German financial advisor expert. Provide detailed, practical advice based on German financial regulations and market conditions."
          },
          {
            role: "user",
            content: prompts[calculatorType as keyof typeof prompts]
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    // Process and structure the AI response
    const analysis = {
      summary: data.choices[0].message.content,
      recommendations: extractRecommendations(data.choices[0].message.content),
      charts: generateChartData(answers, calculatorType),
      nextSteps: extractNextSteps(data.choices[0].message.content)
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze financial data' },
      { status: 500 }
    );
  }
}

function extractRecommendations(content: string): string[] {
  // Extract bullet points or numbered lists from the content
  const recommendations = content
    .split('\n')
    .filter(line => line.match(/^[-•*]|\d+\./))
    .map(line => line.replace(/^[-•*]\s*|\d+\.\s*/, ''));
  
  return recommendations;
}

function extractNextSteps(content: string): string[] {
  // Extract action items or next steps from the content
  const nextSteps = content
    .toLowerCase()
    .split('\n')
    .filter(line => 
      line.includes('recommend') || 
      line.includes('should') || 
      line.includes('consider')
    )
    .map(line => line.trim());

  return nextSteps;
}

function generateChartData(answers: any, type: string) {
  // Generate relevant chart data based on calculator type
  switch (type) {
    case 'investment':
      return {
        projectedGrowth: calculateInvestmentGrowth(answers),
        assetAllocation: suggestAssetAllocation(answers.risk)
      };
    case 'pension':
      return {
        retirementProjection: calculatePensionGrowth(answers),
        contributionBreakdown: calculateContributions(answers)
      };
    // Add other calculator types...
    default:
      return {};
  }
}

// Function to calculate investment growth over time
function calculateInvestmentGrowth(answers: any) {
  const { initial = 0, monthly = 0, duration = 10, risk = 'medium' } = answers;
  
  // Define annual return rates based on risk
  const returnRates = {
    low: 0.04,     // 4% for low risk
    medium: 0.07,  // 7% for medium risk
    high: 0.10     // 10% for high risk
  };
  
  const rateOfReturn = returnRates[risk as keyof typeof returnRates] || 0.07;
  const monthlyRate = rateOfReturn / 12;
  const totalMonths = duration * 12;
  
  // Generate data points for the chart
  const dataPoints = [];
  let currentValue = Number(initial);
  
  for (let month = 0; month <= totalMonths; month += 12) { // Yearly data points
    const year = month / 12;
    
    dataPoints.push({
      year,
      value: Math.round(currentValue)
    });
    
    // Calculate next year's value
    for (let m = 0; m < 12; m++) {
      currentValue = currentValue * (1 + monthlyRate) + Number(monthly);
    }
  }
  
  return dataPoints;
}

// Function to suggest asset allocation based on risk profile
function suggestAssetAllocation(riskProfile: string) {
  switch (riskProfile) {
    case 'low':
      return [
        { name: 'Government Bonds', percentage: 40 },
        { name: 'Corporate Bonds', percentage: 30 },
        { name: 'Large Cap Stocks', percentage: 20 },
        { name: 'Cash', percentage: 10 }
      ];
    case 'medium':
      return [
        { name: 'Government Bonds', percentage: 20 },
        { name: 'Corporate Bonds', percentage: 20 },
        { name: 'Large Cap Stocks', percentage: 30 },
        { name: 'Small/Mid Cap Stocks', percentage: 20 },
        { name: 'International Stocks', percentage: 10 }
      ];
    case 'high':
      return [
        { name: 'Corporate Bonds', percentage: 10 },
        { name: 'Large Cap Stocks', percentage: 30 },
        { name: 'Small/Mid Cap Stocks', percentage: 30 },
        { name: 'International Stocks', percentage: 20 },
        { name: 'Alternative Investments', percentage: 10 }
      ];
    default:
      return [
        { name: 'Government Bonds', percentage: 20 },
        { name: 'Corporate Bonds', percentage: 20 },
        { name: 'Large Cap Stocks', percentage: 30 },
        { name: 'Small/Mid Cap Stocks', percentage: 20 },
        { name: 'International Stocks', percentage: 10 }
      ];
  }
}

// Function to calculate pension growth over time
function calculatePensionGrowth(answers: any) {
  const { age = 30, retirement = 67, currentSalary = 50000, contribution = 500, employerMatch = 3 } = answers;
  
  const yearsTillRetirement = retirement - age;
  const annualContribution = contribution * 12;
  const employerContribution = (currentSalary * (employerMatch / 100)) / 12;
  const monthlyTotal = contribution + employerContribution;
  
  // Assume 5% annual return for pension investments
  const annualReturn = 0.05;
  const monthlyReturn = annualReturn / 12;
  
  // Generate data points for the chart
  const dataPoints = [];
  let currentValue = 0;
  
  for (let year = 0; year <= yearsTillRetirement; year++) {
    dataPoints.push({
      age: age + year,
      value: Math.round(currentValue)
    });
    
    // Calculate next year's value
    for (let month = 0; month < 12; month++) {
      currentValue = currentValue * (1 + monthlyReturn) + monthlyTotal;
    }
  }
  
  return dataPoints;
}

// Function to calculate contribution breakdown
function calculateContributions(answers: any) {
  const { age = 30, retirement = 67, contribution = 500, employerMatch = 3, currentSalary = 50000 } = answers;
  
  const yearsTillRetirement = retirement - age;
  const totalMonths = yearsTillRetirement * 12;
  
  const monthlyEmployeeContribution = contribution;
  const monthlyEmployerContribution = (currentSalary * (employerMatch / 100)) / 12;
  
  const totalEmployeeContribution = monthlyEmployeeContribution * totalMonths;
  const totalEmployerContribution = monthlyEmployerContribution * totalMonths;
  
  return [
    { name: 'Your Contributions', value: totalEmployeeContribution },
    { name: 'Employer Contributions', value: totalEmployerContribution }
  ];
} 