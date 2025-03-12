import { RetirementExpectations } from '@/types/calculator';
import { ChangeEvent } from 'react';

interface RetirementExpectationsFormProps {
  data: RetirementExpectations;
  onUpdate: (data: Partial<RetirementExpectations>) => void;
}

export default function RetirementExpectationsForm({
  data,
  onUpdate,
}: RetirementExpectationsFormProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      'desiredRetirementAge',
      'monthlyExpenses',
      'inheritanceExpectations',
    ];

    onUpdate({
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="desiredRetirementAge"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Desired Retirement Age
          </label>
          <input
            type="number"
            id="desiredRetirementAge"
            name="desiredRetirementAge"
            value={data.desiredRetirementAge || ''}
            onChange={handleChange}
            min="45"
            max="85"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="monthlyExpenses"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Expected Monthly Expenses in Retirement (€)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">€</span>
            <input
              type="number"
              id="monthlyExpenses"
              name="monthlyExpenses"
              value={data.monthlyExpenses || ''}
              onChange={handleChange}
              min="0"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="inheritanceExpectations"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Expected Inheritance (€)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">€</span>
            <input
              type="number"
              id="inheritanceExpectations"
              name="inheritanceExpectations"
              value={data.inheritanceExpectations || ''}
              onChange={handleChange}
              min="0"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="riskTolerance"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Investment Risk Tolerance
          </label>
          <select
            id="riskTolerance"
            name="riskTolerance"
            value={data.riskTolerance}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            This affects how your investments will be allocated
          </p>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="retirementLifestyle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Desired Retirement Lifestyle
          </label>
          <select
            id="retirementLifestyle"
            name="retirementLifestyle"
            value={data.retirementLifestyle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="modest">Modest - Basic needs and some leisure</option>
            <option value="comfortable">
              Comfortable - Regular travel and hobbies
            </option>
            <option value="luxurious">
              Luxurious - High-end lifestyle and frequent travel
            </option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            This helps us estimate your required retirement income
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          Understanding Risk Tolerance
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>
            <strong>Conservative:</strong> Focus on preserving capital with lower
            but stable returns
          </li>
          <li>
            <strong>Moderate:</strong> Balance between growth and stability
          </li>
          <li>
            <strong>Aggressive:</strong> Focus on maximum growth with higher
            volatility
          </li>
        </ul>
      </div>
    </div>
  );
} 