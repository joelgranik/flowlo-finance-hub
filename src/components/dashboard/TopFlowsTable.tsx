import React from 'react';
import type { TopFlowItem } from '@/hooks/useTopUpcomingFlows';

interface Props {
  data: TopFlowItem[];
  type: 'inflow' | 'outflow';
}

export const TopFlowsTable: React.FC<Props> = ({ data, type }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1 text-left">Date</th>
            <th className="px-2 py-1 text-left">Item</th>
            <th className={`px-2 py-1 text-right ${type === 'inflow' ? 'text-success-600' : 'text-danger-600'}`}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className="border-b hover:bg-muted-100">
              <td className="px-2 py-1 whitespace-nowrap">{item.expected_date}</td>
              <td className="px-2 py-1">{item.item_name}</td>
              <td className={`px-2 py-1 text-right ${type === 'inflow' ? 'text-success-600' : 'text-danger-600'}`}>
                {item.expected_amount !== null ? `$${item.expected_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TopFlowsTable;
