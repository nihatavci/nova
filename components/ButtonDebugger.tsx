'use client';

import { useState, useEffect } from 'react';
import { diagnoseButtonClickability, addButtonDebugOverlay } from '@/lib/debug-utils';

export default function ButtonDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Add keyboard shortcut to toggle debugger (Ctrl+Shift+B)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showOverlay) {
      addButtonDebugOverlay();
      
      // Update overlay on scroll or resize
      const handleUpdate = () => {
        addButtonDebugOverlay();
      };
      
      window.addEventListener('scroll', handleUpdate);
      window.addEventListener('resize', handleUpdate);
      
      return () => {
        window.removeEventListener('scroll', handleUpdate);
        window.removeEventListener('resize', handleUpdate);
        
        // Remove overlays when component unmounts or when showOverlay is toggled off
        const overlays = document.querySelectorAll('.button-debug-overlay');
        overlays.forEach(el => el.remove());
      };
    }
  }, [showOverlay]);

  const runDiagnostics = () => {
    const results = diagnoseButtonClickability();
    setDiagnosticResults(results);
    console.log('Button Diagnostics:', results);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsVisible(true)}
          className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
          style={{ pointerEvents: 'auto' }} // Ensure this button is always clickable
        >
          🔍
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Button Clickability Debugger</h2>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
            style={{ pointerEvents: 'auto' }}
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={runDiagnostics}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              style={{ pointerEvents: 'auto' }}
            >
              Run Diagnostics
            </button>
            
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className={`${showOverlay ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded transition-colors`}
              style={{ pointerEvents: 'auto' }}
            >
              {showOverlay ? 'Hide Overlays' : 'Show Overlays'}
            </button>
          </div>
          
          {diagnosticResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-semibold">Total Buttons:</p>
                  <p className="text-xl">{diagnosticResults.buttonCount}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-semibold">Buttons with Issues:</p>
                  <p className="text-xl">{diagnosticResults.details?.length || 0}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold">Issues Found:</h3>
                <ul className="space-y-1">
                  {diagnosticResults.buttonsWithPointerEventsNone > 0 && (
                    <li>• {diagnosticResults.buttonsWithPointerEventsNone} buttons with pointer-events: none</li>
                  )}
                  {diagnosticResults.buttonsWithZeroSize > 0 && (
                    <li>• {diagnosticResults.buttonsWithZeroSize} buttons with zero width or height</li>
                  )}
                  {diagnosticResults.buttonsWithOverlappingElements > 0 && (
                    <li>• {diagnosticResults.buttonsWithOverlappingElements} buttons overlapped by other elements</li>
                  )}
                  {diagnosticResults.buttonsWithOpacityZero > 0 && (
                    <li>• {diagnosticResults.buttonsWithOpacityZero} buttons with opacity: 0</li>
                  )}
                </ul>
              </div>
              
              {diagnosticResults.details?.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Problem Buttons:</h3>
                  <div className="max-h-60 overflow-y-auto border rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Element</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {diagnosticResults.details.map((button: any, index: number) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{button.text}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{button.tagName}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{button.issues.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <h3 className="font-semibold text-yellow-800">Tips:</h3>
            <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1 mt-2">
              <li>Check for elements with <code>pointer-events: none</code> that might be blocking clicks</li>
              <li>Look for invisible overlays that might be capturing clicks</li>
              <li>Verify z-index values to ensure buttons are on top</li>
              <li>Check for event handlers that might be stopping propagation</li>
              <li>Inspect animations that might be affecting button positioning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 