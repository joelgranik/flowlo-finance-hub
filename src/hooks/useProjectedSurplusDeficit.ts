import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProjectedSurplusDeficit = () => {
  const [surplus, setSurplus] = useState<{
    inflows: number | null;
    outflows: number | null;
    net: number | null;
  }>({ inflows: null, outflows: null, net: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjection = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = new Date();
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);
        const fmt = (d: Date) => d.toISOString().slice(0, 10);

        // Fetch inflows
        const { data: inflowData, error: inflowError } = await supabase
          .from('scheduled_items')
          .select('expected_amount')
          .eq('type', 'Inflow')
          .gte('expected_date', fmt(today))
          .lte('expected_date', fmt(sevenDaysFromNow));
        if (inflowError) throw inflowError;

        // Fetch outflows
        const { data: outflowData, error: outflowError } = await supabase
          .from('scheduled_items')
          .select('expected_amount')
          .eq('type', 'Outflow')
          .gte('expected_date', fmt(today))
          .lte('expected_date', fmt(sevenDaysFromNow));
        if (outflowError) throw outflowError;

        const inflows = (inflowData || []).reduce((sum, row) => sum + (row.expected_amount || 0), 0);
        const outflows = (outflowData || []).reduce((sum, row) => sum + (row.expected_amount || 0), 0);
        const net = inflows - outflows;
        setSurplus({ inflows, outflows, net });
      } catch (err: any) {
        setError('Failed to fetch projected surplus/deficit');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjection();
  }, []);

  return { ...surplus, isLoading, error };
};
