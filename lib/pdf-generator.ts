import { jsPDF } from 'jspdf';
import { RetirementResults } from '@/utils/retirementCalculator';

// Add this to make TypeScript recognize the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Define our own form data interface to use with the PDF generator
export interface PDFFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  residencyStatus?: string;
  familyStatus?: string;
  employmentIncome?: number;
  businessIncome?: number;
  investmentIncome?: number;
  otherIncome?: number;
  realEstate?: any[];
  investments?: any[];
  cash?: number;
  taxResidency?: string;
  taxObligations?: string[];
  retirementPlanning?: boolean;
  wealthAccumulation?: boolean;
  taxOptimization?: boolean;
  otherGoals?: string;
  // Add any other fields as needed
}

/**
 * Generate a financial advisory PDF report based on user form data
 * 
 * This uses jsPDF to create a professional PDF document
 */
export const generateFinancialReport = async (results: RetirementResults): Promise<Blob> => {
  const doc = new jsPDF();
  let yPos = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(10, 30, 60);
  doc.text('Financial Analysis Report', 20, yPos);
  yPos += 20;

  // Overview Section
  doc.setFontSize(16);
  doc.setTextColor(0, 48, 120);
  doc.text('OVERVIEW', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Retirement Readiness Score: ${results.score}/100`, 20, yPos);
  yPos += 8;
  doc.text(`Category: ${results.scoreCategory}`, 20, yPos);
  yPos += 15;

  // Financial Metrics
  doc.setFontSize(16);
  doc.setTextColor(0, 48, 120);
  doc.text('FINANCIAL METRICS', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Monthly Retirement Income: €${Math.round(results.retirementIncome / 12).toLocaleString()}`, 20, yPos);
  yPos += 8;
  doc.text(`Projected Total Savings: €${results.projectedSavings.toLocaleString()}`, 20, yPos);
  yPos += 8;
  doc.text(`Savings Gap: €${results.savingsGap.toLocaleString()}`, 20, yPos);
  yPos += 15;

  // Radar Scores
  doc.setFontSize(16);
  doc.setTextColor(0, 48, 120);
  doc.text('DETAILED SCORES', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  Object.entries(results.radarScores).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    doc.text(`${label}: ${value}/100`, 20, yPos);
    yPos += 8;
  });
  yPos += 15;

  // Recommendations
  doc.setFontSize(16);
  doc.setTextColor(0, 48, 120);
  doc.text('RECOMMENDATIONS', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  results.recommendations.forEach((recommendation, index) => {
    if (yPos > 270) { // Check if we need a new page
      doc.addPage();
      yPos = 20;
    }
    doc.text(`${index + 1}. ${recommendation}`, 20, yPos);
    yPos += 8;
  });

  // Investment Strategy
  doc.addPage();
  yPos = 20;
  doc.setFontSize(16);
  doc.setTextColor(0, 48, 120);
  doc.text('INVESTMENT STRATEGY', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  // Add investment strategy content based on risk profile
  const riskStrategies = {
    poor: 'Conservative approach focused on capital preservation',
    fair: 'Balanced approach with moderate growth potential',
    good: 'Growth-oriented strategy with managed risk',
    excellent: 'Aggressive growth strategy with higher risk tolerance'
  };
  doc.text(`Recommended Strategy: ${riskStrategies[results.scoreCategory]}`, 20, yPos);
  yPos += 15;

  // Pension Planning
  doc.setFontSize(16);
  doc.setTextColor(0, 48, 120);
  doc.text('PENSION PLANNING', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`German Retirement Benefit: €${results.germanRetirementBenefit.toLocaleString()}`, 20, yPos);
  yPos += 8;
  doc.text(`Required Additional Savings: €${results.totalRequiredSavings.toLocaleString()}`, 20, yPos);

  return doc.output('blob');
};

/**
 * Download the generated report
 */
export const downloadReport = (blob: Blob, fileName: string = 'nova-financial-report.pdf'): void => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the URL object
  URL.revokeObjectURL(url);
}; 