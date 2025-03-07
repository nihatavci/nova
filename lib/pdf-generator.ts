import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
export const generateFinancialReport = async (formData: PDFFormData): Promise<Blob> => {
  try {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Add a title
    doc.setFontSize(22);
    doc.setTextColor(0, 48, 120); // Dark blue color
    doc.text('NOVA FINANCIAL ADVISORY REPORT', 105, 20, { align: 'center' });
    
    // Add a horizontal line
    doc.setDrawColor(0, 114, 206); // Blue color
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Add creation date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 190, 35, { align: 'right' });
    
    // Personal Information section
    doc.setFontSize(16);
    doc.setTextColor(0, 48, 120); // Dark blue color
    doc.text('PERSONAL INFORMATION', 20, 45);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black color
    let yPos = 55;
    doc.text(`Name: ${formData.firstName || ''} ${formData.lastName || ''}`, 20, yPos); yPos += 8;
    doc.text(`Email: ${formData.email || ''}`, 20, yPos); yPos += 8;
    doc.text(`Residency Status: ${formData.residencyStatus || ''}`, 20, yPos); yPos += 8;
    doc.text(`Family Status: ${formData.familyStatus || ''}`, 20, yPos); yPos += 8;
    
    // Financial Information section
    yPos += 5;
    doc.setFontSize(16);
    doc.setTextColor(0, 48, 120); // Dark blue color
    doc.text('INCOME SUMMARY', 20, yPos); yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black color
    const totalIncome = (formData.employmentIncome || 0) + 
                       (formData.businessIncome || 0) + 
                       (formData.investmentIncome || 0) + 
                       (formData.otherIncome || 0);
    
    doc.text(`Employment Income: €${(formData.employmentIncome || 0).toLocaleString()}`, 20, yPos); yPos += 8;
    doc.text(`Business Income: €${(formData.businessIncome || 0).toLocaleString()}`, 20, yPos); yPos += 8;
    doc.text(`Investment Income: €${(formData.investmentIncome || 0).toLocaleString()}`, 20, yPos); yPos += 8;
    doc.text(`Other Income: €${(formData.otherIncome || 0).toLocaleString()}`, 20, yPos); yPos += 8;
    doc.text(`Total Income: €${totalIncome.toLocaleString()}`, 20, yPos); yPos += 15;
    
    // Assets Summary
    doc.setFontSize(16);
    doc.setTextColor(0, 48, 120); // Dark blue color
    doc.text('ASSETS SUMMARY', 20, yPos); yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Real Estate: ${formData.realEstate?.length || 0} properties`, 20, yPos); yPos += 8;
    doc.text(`Investments: ${formData.investments?.length || 0} accounts`, 20, yPos); yPos += 8;
    doc.text(`Cash: €${(formData.cash || 0).toLocaleString()}`, 20, yPos); yPos += 15;
    
    // Tax Situation
    doc.setFontSize(16);
    doc.setTextColor(0, 48, 120); // Dark blue color
    doc.text('TAX SITUATION', 20, yPos); yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Tax Residency: ${formData.taxResidency || ''}`, 20, yPos); yPos += 8;
    doc.text(`Tax Obligations: ${formData.taxObligations?.join(', ') || ''}`, 20, yPos); yPos += 15;
    
    // Financial Goals
    doc.setFontSize(16);
    doc.setTextColor(0, 48, 120); // Dark blue color
    doc.text('FINANCIAL GOALS', 20, yPos); yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Retirement Planning: ${formData.retirementPlanning ? 'Yes' : 'No'}`, 20, yPos); yPos += 8;
    doc.text(`Wealth Accumulation: ${formData.wealthAccumulation ? 'Yes' : 'No'}`, 20, yPos); yPos += 8;
    doc.text(`Tax Optimization: ${formData.taxOptimization ? 'Yes' : 'No'}`, 20, yPos); yPos += 8;
    doc.text(`Other Goals: ${formData.otherGoals || 'None specified'}`, 20, yPos); yPos += 15;
    
    // Recommendations (static for now)
    doc.setFontSize(16);
    doc.setTextColor(0, 48, 120); // Dark blue color
    doc.text('RECOMMENDATIONS', 20, yPos); yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black color
    const recommendations = [
      'Consider optimizing your tax structure based on your residency status.',
      'Review your investment portfolio for potential diversification.',
      'Establish an emergency fund of 3-6 months of expenses.',
      'Consult with a tax specialist regarding cross-border obligations.'
    ];
    
    recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, 20, yPos);
      yPos += 8;
    });
    
    yPos += 7;
    
    // Potential Savings
    doc.setFontSize(16);
    doc.setTextColor(0, 48, 120); // Dark blue color
    doc.text('POTENTIAL SAVINGS', 20, yPos); yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text('Based on our initial analysis, we estimate potential annual savings of:', 20, yPos); yPos += 8;
    doc.text('€5,000 - €10,000 through proper tax planning and optimization.', 20, yPos); yPos += 20;
    
    // Final note
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text('This report is a preliminary assessment. For a detailed analysis and', 20, yPos); yPos += 5;
    doc.text('personalized recommendations, please schedule a consultation with one', 20, yPos); yPos += 5;
    doc.text('of our financial advisors.', 20, yPos); yPos += 15;
    
    // Footer with company info
    doc.setDrawColor(0, 114, 206); // Blue color
    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text('NOVA Financial Advisory', 105, 280, { align: 'center' });
    doc.text('www.nova-advisory.com | contact@nova-advisory.com | +49 30 123 456 789', 105, 285, { align: 'center' });
    
    // Convert the PDF to a Blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Error generating financial report:', error);
    throw new Error('Failed to generate financial report');
  }
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