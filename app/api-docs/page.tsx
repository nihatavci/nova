export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="mt-4 text-lg text-gray-600">
            Integrate retirement calculation capabilities into your application.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Retirement Calculator API</h2>
          <p className="text-gray-600 mb-6">
            Our Retirement Calculator API allows you to calculate retirement readiness scores and projections based on user inputs.
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Endpoint</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <code className="text-blue-600">POST /api/retirement-calculator</code>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Format</h3>
            <p className="text-gray-600 mb-4">Send a JSON object with the following properties:</p>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto">
              <pre className="text-sm">
{`{
  "age": number,                           // Required: Current age
  "currentSalary": number,                 // Required: Annual salary in EUR
  "currentSavings": number,                // Required: Current retirement savings in EUR
  "monthlySavings": number,                // Required: Monthly retirement contributions in EUR
  "riskTolerance": "low" | "medium" | "high", // Required: Investment risk tolerance
  "retirementAge": number,                 // Required: Expected retirement age
  "desiredRetirementIncome": number,       // Optional: Monthly income desired in retirement (default: 70% of current salary)
  "hasAdditionalIncome": boolean,          // Optional: Whether user has additional income sources (default: false)
  "additionalIncomeAmount": number,        // Optional: Amount of additional income in EUR (default: 0)
  "hasPropertyInvestments": boolean,       // Optional: Whether user has property investments (default: false)
  "propertyValue": number,                 // Optional: Value of property investments in EUR (default: 0)
  "hasPrivatePension": boolean,            // Optional: Whether user has private pension plan (default: false)
  "privatePensionValue": number,           // Optional: Value of private pension in EUR (default: 0)
  "employmentType": "employed" | "self-employed" | "civil-servant" | "freelancer", // Optional: Type of employment (default: "employed")
  "yearsInGermany": number,                // Optional: Years lived in Germany (default: 0)
  "germanCitizenship": boolean             // Optional: Whether user has German citizenship (default: false)
}`}
              </pre>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Response Format</h3>
            <p className="text-gray-600 mb-4">The API returns a JSON object with the following structure:</p>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto">
              <pre className="text-sm">
{`{
  "success": boolean,                     // Whether the request was successful
  "data": {
    "results": {                         // Original calculation results
      "score": number,                   // Retirement readiness score (0-100)
      "scoreCategory": string,           // Category based on score (excellent, good, fair, poor)
      "retirementIncome": number,        // Projected annual retirement income
      "projectedSavings": number,        // Projected savings at retirement
      "savingsGap": number,              // Gap between projected and required savings
      "germanRetirementBenefit": number, // Estimated German pension benefit
      "totalRequiredSavings": number,    // Total savings required for desired income
      "recommendations": string[],       // List of recommendations as strings
      "radarScores": {                   // Component scores for visualization
        "savingsRate": number,
        "investmentStrategy": number,
        "riskManagement": number,
        "timeHorizon": number,
        "incomeSecurity": number
      }
    },
    "score": {                          // Standardized score data for display
      "overall": number,                // Overall score (0-100)
      "category": string,               // Category (Excellent, Good, Fair, Poor)
      "breakdown": {                    // Breakdown of component scores
        "savingsRate": number,
        "investmentAllocation": number,
        "pensionCoverage": number,
        "retirementReadiness": number,
        "riskManagement": number
      },
      "recommendations": [              // Structured recommendations
        {
          "title": string,
          "description": string,
          "impact": string,
          "priority": string
        }
      ]
    }
  }
}`}
              </pre>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Example Request</h3>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto">
              <pre className="text-sm">
{`fetch('/api/retirement-calculator', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    age: 35,
    currentSalary: 60000,
    currentSavings: 50000,
    monthlySavings: 500,
    riskTolerance: 'medium',
    retirementAge: 67,
    employmentType: 'employed',
    yearsInGermany: 10,
    germanCitizenship: true
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Rate Limits</h3>
            <p className="text-gray-600">
              To ensure service availability for all users, the API is rate-limited to 100 requests per hour per IP address.
            </p>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>For additional support or questions about our API, please contact our developer team.</p>
        </div>
      </div>
    </div>
  );
} 