import { PersonalInfo } from '@/types/calculator';
import { ChangeEvent } from 'react';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (data: Partial<PersonalInfo>) => void;
}

export default function PersonalInfoForm({ data, onUpdate }: PersonalInfoFormProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ['age', 'yearsInGermany', 'dependents'];
    
    onUpdate({
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={data.age || ''}
            onChange={handleChange}
            min="18"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="nationality"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={data.nationality}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="yearsInGermany"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Years in Germany
          </label>
          <input
            type="number"
            id="yearsInGermany"
            name="yearsInGermany"
            value={data.yearsInGermany || ''}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="intendedRetirementLocation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Intended Retirement Location
          </label>
          <input
            type="text"
            id="intendedRetirementLocation"
            name="intendedRetirementLocation"
            value={data.intendedRetirementLocation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="maritalStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Marital Status
          </label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={data.maritalStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="dependents"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Number of Dependents
          </label>
          <input
            type="number"
            id="dependents"
            name="dependents"
            value={data.dependents || ''}
            onChange={handleChange}
            min="0"
            max="20"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
} 