import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UpcomingFlowDay {
  date: string;
  inflow: number;
  outflow: number;
  inflowItems: { item_name: string; amount: number }[];
  outflowItems: { item_name: string; amount: number }[];
}

export const useUpcomingFlowsTableData = () => {
  const [data, setData] = useState<UpcomingFlowDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 13); // 14 days including today
        const fmt = (d: Date) => d.toISOString().slice(0, 10);

        const { data: scheduled, error: scheduledError } = await supabase
          .from('scheduled_items')
          .select('expected_amount, type, expected_date, item_name')
          .gte('expected_date', fmt(today))
          .lte('expected_date', fmt(endDate));
        if (scheduledError) throw scheduledError;

        // Group by date
        const days: { [date: string]: UpcomingFlowDay } = {};
        for (let i = 0; i < 14; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          const dateStr = fmt(d);
          days[dateStr] = { date: dateStr, inflow: 0, outflow: 0, inflowItems: [], outflowItems: [] };
        }
        (scheduled || []).forEach(item => {
          const d = item.expected_date;
          if (!days[d]) return;
          if (item.type === 'Inflow') {
            days[d].inflow += item.expected_amount || 0;
            days[d].inflowItems.push({ item_name: item.item_name, amount: item.expected_amount || 0 });
          } else if (item.type === 'Outflow') {
            days[d].outflow += item.expected_amount || 0;
            days[d].outflowItems.push({ item_name: item.item_name, amount: item.expected_amount || 0 });
          }
        });
        setData(Object.values(days));
      } catch (err: any) {
        setError('Failed to fetch upcoming flows');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading, error };
};
