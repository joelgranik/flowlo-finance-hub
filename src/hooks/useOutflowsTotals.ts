import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOutflowsTotals = () => {
  const [tomorrowTotal, setTomorrowTotal] = useState<number | null>(null);
  const [next7DaysTotal, setNext7DaysTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotals = async () => {
    setIsLoading(true);
    setError(null);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const format = (d: Date) => d.toISOString().split('T')[0];

    try {
      // Tomorrow's outflows
      const { data: tomorrowData, error: tomorrowError } = await supabase
        .from('scheduled_items')
        .select('expected_amount')
        .eq('type', 'Outflow')
        .eq('expected_date', format(tomorrow));
      if (tomorrowError) throw tomorrowError;
      setTomorrowTotal(
        tomorrowData?.reduce((sum, row) => sum + (row.expected_amount || 0), 0) || 0
      );

      // Next 7 days outflows (including tomorrow)
      const { data: next7Data, error: next7Error } = await supabase
        .from('scheduled_items')
        .select('expected_amount')
        .eq('type', 'Outflow')
        .gte('expected_date', format(tomorrow))
        .lte('expected_date', format(sevenDaysFromNow));
      if (next7Error) throw next7Error;
      setNext7DaysTotal(
        next7Data?.reduce((sum, row) => sum + (row.expected_amount || 0), 0) || 0
      );
    } catch (err: any) {
      setError('Failed to fetch outflows totals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  return { tomorrowTotal, next7DaysTotal, isLoading, error, refetch: fetchTotals };
};
