/**
 * Utility functions for debugging UI issues
 */

/**
 * Checks for common issues that might prevent buttons from being clickable
 * @returns An object containing diagnostic information
 */
export function diagnoseButtonClickability() {
  if (typeof window === 'undefined') {
    return { error: 'This function can only run in the browser' };
  }

  const results = {
    buttonCount: 0,
    buttonsWithPointerEventsNone: 0,
    buttonsWithZeroSize: 0,
    buttonsWithOverlappingElements: 0,
    buttonsWithAbsolutePosition: 0,
    buttonsWithFixedPosition: 0,
    buttonsWithVisibilityHidden: 0,
    buttonsWithDisplayNone: 0,
    buttonsWithOpacityZero: 0,
    details: [] as any[]
  };

  try {
    // Get all buttons
    const buttons = document.querySelectorAll('button, a[href], [role="button"], .btn, .button');
    results.buttonCount = buttons.length;

    // Check each button for issues
    buttons.forEach((button, index) => {
      const style = window.getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      const buttonInfo: any = {
        index,
        text: button.textContent?.trim() || 'No text',
        tagName: button.tagName,
        classes: (button as HTMLElement).className,
        width: rect.width,
        height: rect.height,
        issues: []
      };

      // Check pointer-events
      if (style.pointerEvents === 'none') {
        results.buttonsWithPointerEventsNone++;
        buttonInfo.issues.push('pointer-events: none');
      }

      // Check size
      if (rect.width === 0 || rect.height === 0) {
        results.buttonsWithZeroSize++;
        buttonInfo.issues.push('zero size');
      }

      // Check position
      if (style.position === 'absolute') {
        results.buttonsWithAbsolutePosition++;
        buttonInfo.issues.push('position: absolute');
      }

      if (style.position === 'fixed') {
        results.buttonsWithFixedPosition++;
        buttonInfo.issues.push('position: fixed');
      }

      // Check visibility
      if (style.visibility === 'hidden') {
        results.buttonsWithVisibilityHidden++;
        buttonInfo.issues.push('visibility: hidden');
      }

      if (style.display === 'none') {
        results.buttonsWithDisplayNone++;
        buttonInfo.issues.push('display: none');
      }

      if (parseFloat(style.opacity) === 0) {
        results.buttonsWithOpacityZero++;
        buttonInfo.issues.push('opacity: 0');
      }

      // Check for overlapping elements
      if (rect.width > 0 && rect.height > 0) {
        const elementsAtPoint = document.elementsFromPoint(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
        
        if (elementsAtPoint[0] !== button) {
          results.buttonsWithOverlappingElements++;
          buttonInfo.issues.push('overlapped by other elements');
          buttonInfo.overlappingElement = {
            tagName: elementsAtPoint[0]?.tagName,
            classes: (elementsAtPoint[0] as HTMLElement)?.className || 'unknown'
          };
        }
      }

      // Only add buttons with issues to the details
      if (buttonInfo.issues.length > 0) {
        results.details.push(buttonInfo);
      }
    });

    return results;
  } catch (error) {
    return { error: `Error diagnosing button clickability: ${error}` };
  }
}

/**
 * Adds a visual debug overlay to all buttons on the page
 * @param options Configuration options
 */
export function addButtonDebugOverlay(options = { highlightOverlapped: true }) {
  if (typeof window === 'undefined') {
    return;
  }

  // Remove any existing debug elements
  const existingDebugElements = document.querySelectorAll('.button-debug-overlay');
  existingDebugElements.forEach(el => el.remove());

  // Get all buttons
  const buttons = document.querySelectorAll('button, a[href], [role="button"], .btn, .button');
  
  buttons.forEach((button) => {
    const rect = button.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const overlay = document.createElement('div');
    overlay.className = 'button-debug-overlay';
    overlay.style.position = 'absolute';
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.border = '2px solid red';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    
    // Check if button is overlapped
    if (options.highlightOverlapped) {
      const elementsAtPoint = document.elementsFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      
      if (elementsAtPoint[0] !== button) {
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
      }
    }
    
    document.body.appendChild(overlay);
  });
} 