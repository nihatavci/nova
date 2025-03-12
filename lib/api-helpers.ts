/**
 * API Helper Functions
 * Utilities for making API calls and handling responses
 */

/**
 * Calculate retirement readiness score
 * @param formData User input data
 * @returns Promise with the calculation results
 */
export async function calculateRetirementScore(formData: any) {
  try {
    const response = await fetch('/api/retirement-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `API error: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calculating retirement score:', error);
    throw error;
  }
}

/**
 * Format currency values
 * @param amount Number to format as currency
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
};

/**
 * Format percentage values
 * @param value Number to format as percentage
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(value / 100);
};

/**
 * Handle API errors
 * @param error Error object
 * @returns User-friendly error message
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}; 