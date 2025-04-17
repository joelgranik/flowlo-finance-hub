import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WaterfallDataPoint {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
  balance: number;
}

export const useCashFlowWaterfallData = () => {
  const [data, setData] = useState<WaterfallDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 29); // 30 days including today
        const fmt = (d: Date) => d.toISOString().slice(0, 10);

        // Fetch daily inflows and outflows
        const { data: scheduled, error: scheduledError } = await supabase
          .from('scheduled_items')
          .select('expected_amount, type, expected_date')
          .gte('expected_date', fmt(startDate))
          .lte('expected_date', fmt(today));
        if (scheduledError) throw scheduledError;

        // Fetch starting balance from bank_balances (the most recent balance <= startDate)
        const { data: balances, error: balanceError } = await supabase
          .from('bank_balances')
          .select('ending_balance, date')
          .lte('date', fmt(startDate))
          .order('date', { ascending: false })
          .limit(1);
        if (balanceError) throw balanceError;
        const startingBalance = balances && balances.length > 0 ? balances[0].ending_balance : 0;

        // Group inflows/outflows by day
        const days: { [date: string]: { inflow: number; outflow: number } } = {};
        for (let i = 0; i < 30; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          days[fmt(d)] = { inflow: 0, outflow: 0 };
        }
        (scheduled || []).forEach(item => {
          if (!days[item.expected_date]) return;
          if (item.type === 'Inflow') days[item.expected_date].inflow += item.expected_amount || 0;
          if (item.type === 'Outflow') days[item.expected_date].outflow += item.expected_amount || 0;
        });

        // Build waterfall data
        let runningBalance = startingBalance;
        const points: WaterfallDataPoint[] = [];
        Object.entries(days).forEach(([date, { inflow, outflow }]) => {
          const net = inflow - outflow;
          runningBalance += net;
          points.push({ date, inflow, outflow, net, balance: runningBalance });
        });
        setData(points);
      } catch (err: any) {
        setError('Failed to fetch waterfall data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading, error };
};
