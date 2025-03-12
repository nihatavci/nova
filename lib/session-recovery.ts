/**
 * Session Recovery Utility
 * Helps recover data from previous sessions that might have been lost due to page refreshes or navigation
 */

// Types for the data we want to recover
export interface RetirementCalculatorData {
  formData?: any;
  results?: any;
  step?: number;
  timestamp?: number;
}

/**
 * Save retirement calculator data to localStorage
 * @param data The data to save
 */
export function saveRetirementData(data: Partial<RetirementCalculatorData>): void {
  try {
    // Get existing data
    const existingDataStr = localStorage.getItem('nova_retirement_data');
    const existingData: RetirementCalculatorData = existingDataStr 
      ? JSON.parse(existingDataStr) 
      : {};
    
    // Merge with new data
    const newData = {
      ...existingData,
      ...data,
      timestamp: Date.now() // Always update timestamp
    };
    
    // Save to localStorage
    localStorage.setItem('nova_retirement_data', JSON.stringify(newData));
    
    // Also save to sessionStorage as a backup
    sessionStorage.setItem('nova_retirement_data', JSON.stringify(newData));
    
    console.log('Saved retirement data:', newData);
  } catch (error) {
    console.error('Error saving retirement data:', error);
  }
}

/**
 * Get retirement calculator data from localStorage
 * @returns The saved data or null if no data exists
 */
export function getRetirementData(): RetirementCalculatorData | null {
  try {
    // Try localStorage first
    let dataStr = localStorage.getItem('nova_retirement_data');
    
    // If not in localStorage, try sessionStorage
    if (!dataStr) {
      dataStr = sessionStorage.getItem('nova_retirement_data');
    }
    
    // If no data found, return null
    if (!dataStr) {
      return null;
    }
    
    // Parse and return the data
    const data = JSON.parse(dataStr);
    
    // Check if data is recent (within the last 24 hours)
    const isRecent = data.timestamp && (Date.now() - data.timestamp < 24 * 60 * 60 * 1000);
    
    return isRecent ? data : null;
  } catch (error) {
    console.error('Error getting retirement data:', error);
    return null;
  }
}

/**
 * Clear all saved retirement calculator data
 */
export function clearRetirementData(): void {
  try {
    localStorage.removeItem('nova_retirement_data');
    sessionStorage.removeItem('nova_retirement_data');
    console.log('Cleared retirement data');
  } catch (error) {
    console.error('Error clearing retirement data:', error);
  }
}

/**
 * Check if there is recent retirement calculator data available
 * @returns True if recent data exists, false otherwise
 */
export function hasRecentRetirementData(): boolean {
  const data = getRetirementData();
  return data !== null;
} 