import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useProjectedSurplus() {
const today = new Date().toISOString().slice(0,10)
const weekOut = new Date(Date.now() + 72460601000).toISOString().slice(0,10)

return useQuery({
queryKey: ['projectedSurplus', today, weekOut],
queryFn: async () => {
const { data: inRows, error: inErr } = await supabase
.from('scheduled_items')
.select('expected_amount')
.eq('type', 'Inflow')
.gte('expected_date', today)
.lte('expected_date', weekOut)
if (inErr) throw inErr
const inflows = inRows.reduce((sum, r) => sum + r.expected_amount, 0)

  const { data: outRows, error: outErr } = await supabase  
    .from('scheduled_items')  
    .select('expected_amount')  
    .eq('type', 'Outflow')  
    .gte('expected_date', today)  
    .lte('expected_date', weekOut)  
  if (outErr) throw outErr  
  const outflows = outRows.reduce((sum, r) => sum + r.expected_amount, 0)

  return { surplus: inflows - outflows }  
},  
staleTime: 5 * 60 * 1000,  
refetchOnWindowFocus: false  
})
}
