import { FinancialStatus } from '@/types/calculator';
import { ChangeEvent } from 'react';

interface FinancialStatusFormProps {
  data: FinancialStatus;
  onUpdate: (data: Partial<FinancialStatus>) => void;
}

export default function FinancialStatusForm({
  data,
  onUpdate,
}: FinancialStatusFormProps) {
  const handleChange = (
    section: keyof FinancialStatus,
    subsection: string,
    value: string
  ) => {
    onUpdate({
      [section]: {
        ...data[section],
        [subsection]: Number(value),
      },
    });
  };

  const renderInput = (
    section: keyof FinancialStatus,
    subsection: string,
    label: string,
    value: number
  ) => (
    <div>
      <label
        htmlFor={`${section}-${subsection}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-2 text-gray-500">€</span>
        <input
          type="number"
          id={`${section}-${subsection}`}
          value={value || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(section, subsection, e.target.value)
          }
          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput('income', 'gross', 'Gross Annual Income', data.income.gross)}
          {renderInput('income', 'net', 'Net Annual Income', data.income.net)}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput(
            'savings',
            'germanBankAccounts',
            'German Bank Accounts',
            data.savings.germanBankAccounts
          )}
          {renderInput(
            'savings',
            'foreignBankAccounts',
            'Foreign Bank Accounts',
            data.savings.foreignBankAccounts
          )}
          {renderInput(
            'savings',
            'emergencyFund',
            'Emergency Fund',
            data.savings.emergencyFund
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput(
            'investments',
            'stocks',
            'Stocks',
            data.investments.stocks
          )}
          {renderInput(
            'investments',
            'bonds',
            'Bonds',
            data.investments.bonds
          )}
          {renderInput(
            'investments',
            'funds',
            'Investment Funds',
            data.investments.funds
          )}
          {renderInput(
            'investments',
            'realEstate',
            'Real Estate',
            data.investments.realEstate
          )}
          {renderInput(
            'investments',
            'other',
            'Other Investments',
            data.investments.other
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput(
            'pensions',
            'germanStatePension',
            'German State Pension (Monthly)',
            data.pensions.germanStatePension
          )}
          {renderInput(
            'pensions',
            'foreignPensions',
            'Foreign Pensions (Monthly)',
            data.pensions.foreignPensions
          )}
          {renderInput(
            'pensions',
            'privatePensions',
            'Private Pensions (Monthly)',
            data.pensions.privatePensions
          )}
          {renderInput(
            'pensions',
            'companyPensions',
            'Company Pensions (Monthly)',
            data.pensions.companyPensions
          )}
        </div>
      </div>
    </div>
  );
} 