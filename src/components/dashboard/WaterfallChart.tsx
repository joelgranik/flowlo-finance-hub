import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';
import React from 'react';
import type { WaterfallDataPoint } from '@/hooks/useCashFlowWaterfallData';

interface Props {
  data: WaterfallDataPoint[];
}

export const WaterfallChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={d => d.slice(5)} interval={4} />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          <Bar dataKey="inflow" stackId="a" fill="#22c55e">
            <LabelList dataKey="inflow" position="top" formatter={v => v > 0 ? `+$${v}` : ''} />
          </Bar>
          <Bar dataKey="outflow" stackId="a" fill="#ef4444">
            <LabelList dataKey="outflow" position="bottom" formatter={v => v > 0 ? `-$${v}` : ''} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default WaterfallChart;
