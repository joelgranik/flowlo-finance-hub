import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useProjectedSurplus() {
  return useQuery(['projectedSurplus'], async () => {
    const today = new Date().toISOString().slice(0, 10);
    const weekOut = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Fetch inflows
    const { data: inflowRows, error: inflowError } = await supabase
      .from('scheduled_items')
      .select('expected_amount')
      .eq('type', 'Inflow')
      .gte('expected_date', today)
      .lte('expected_date', weekOut);
    if (inflowError) throw inflowError;

    // Fetch outflows
    const { data: outflowRows, error: outflowError } = await supabase
      .from('scheduled_items')
      .select('expected_amount')
      .eq('type', 'Outflow')
      .gte('expected_date', today)
      .lte('expected_date', weekOut);
    if (outflowError) throw outflowError;

    const inflows = (inflowRows || []).reduce((sum, row) => sum + (row.expected_amount ?? 0), 0);
    const outflows = (outflowRows || []).reduce((sum, row) => sum + (row.expected_amount ?? 0), 0);
    return { surplus: inflows - outflows };
  });
}
