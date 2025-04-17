import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TopFlowItem {
  id: string;
  expected_date: string;
  item_name: string;
  expected_amount: number;
  notes?: string;
}

export const useTopUpcomingFlows = () => {
  const [outflows, setOutflows] = useState<TopFlowItem[]>([]);
  const [inflows, setInflows] = useState<TopFlowItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = new Date();
        const fmt = (d: Date) => d.toISOString().slice(0, 10);

        // Top 5 Outflows
        const { data: outData, error: outError } = await supabase
          .from('scheduled_items')
          .select('id, expected_date, item_name, expected_amount, notes')
          .eq('type', 'Outflow')
          .gte('expected_date', fmt(today))
          .order('expected_amount', { ascending: false })
          .order('expected_date', { ascending: true })
          .limit(5);
        if (outError) throw outError;
        setOutflows(outData || []);

        // Top 5 Inflows
        const { data: inData, error: inError } = await supabase
          .from('scheduled_items')
          .select('id, expected_date, item_name, expected_amount, notes')
          .eq('type', 'Inflow')
          .gte('expected_date', fmt(today))
          .order('expected_amount', { ascending: false })
          .order('expected_date', { ascending: true })
          .limit(5);
        if (inError) throw inError;
        setInflows(inData || []);
      } catch (err: any) {
        setError('Failed to fetch top flows');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { outflows, inflows, isLoading, error };
};
