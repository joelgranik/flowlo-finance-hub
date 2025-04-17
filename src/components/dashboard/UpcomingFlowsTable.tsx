import React from 'react';
import type { UpcomingFlowDay } from '@/hooks/useUpcomingFlowsTableData';

interface Props {
  data: UpcomingFlowDay[];
}

export const UpcomingFlowsTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1 text-left">Date</th>
            <th className="px-2 py-1 text-right text-success-600">Inflows</th>
            <th className="px-2 py-1 text-right text-danger-600">Outflows</th>
          </tr>
        </thead>
        <tbody>
          {data.map(day => (
            <tr key={day.date} className="border-b hover:bg-muted-100">
              <td className="px-2 py-1 whitespace-nowrap">{day.date}</td>
              <td className="px-2 py-1 text-right">
                {day.inflow > 0 ? `$${day.inflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                {day.inflowItems.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {day.inflowItems.map((item, i) => (
                      <div key={i}>+{item.item_name}: ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-2 py-1 text-right">
                {day.outflow > 0 ? `$${day.outflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                {day.outflowItems.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {day.outflowItems.map((item, i) => (
                      <div key={i}>-{item.item_name}: ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UpcomingFlowsTable;
