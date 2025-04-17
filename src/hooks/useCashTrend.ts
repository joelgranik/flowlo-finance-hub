import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCashTrend = () => {
  const [trend, setTrend] = useState<{
    recentNet: number | null;
    priorNet: number | null;
    percentChange: number | null;
  }>({ recentNet: null, priorNet: null, percentChange: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrend = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = new Date();
        const startRecent = new Date(today);
        startRecent.setDate(today.getDate() - 6); // 7 days incl. today
        const endPrior = new Date(startRecent);
        endPrior.setDate(startRecent.getDate() - 1);
        const startPrior = new Date(endPrior);
        startPrior.setDate(endPrior.getDate() - 6);

        // Format YYYY-MM-DD
        const fmt = (d: Date) => d.toISOString().slice(0, 10);

        // Recent 7d
        const { data: inflowRecent, error: errInflowRecent } = await supabase
          .from('scheduled_items')
          .select('expected_amount, type')
          .gte('expected_date', fmt(startRecent))
          .lte('expected_date', fmt(today));
        if (errInflowRecent) throw errInflowRecent;

        // Prior 7d
        const { data: inflowPrior, error: errInflowPrior } = await supabase
          .from('scheduled_items')
          .select('expected_amount, type')
          .gte('expected_date', fmt(startPrior))
          .lte('expected_date', fmt(endPrior));
        if (errInflowPrior) throw errInflowPrior;

        const sumNet = (arr: any[]) => {
          let inflow = 0, outflow = 0;
          arr.forEach((item) => {
            if (item.type === 'Inflow') inflow += item.expected_amount || 0;
            else if (item.type === 'Outflow') outflow += item.expected_amount || 0;
          });
          return inflow - outflow;
        };

        const recentNet = sumNet(inflowRecent || []);
        const priorNet = sumNet(inflowPrior || []);
        let percentChange = null;
        if (priorNet !== 0 && priorNet !== null) {
          percentChange = ((recentNet - priorNet) / Math.abs(priorNet)) * 100;
        } else if (recentNet !== 0) {
          percentChange = 100;
        }

        setTrend({ recentNet, priorNet, percentChange });
      } catch (err: any) {
        setError('Failed to fetch cash trend');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrend();
  }, []);

  return { ...trend, isLoading, error };
};
