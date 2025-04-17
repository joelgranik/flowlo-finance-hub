import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMembershipRevenueForecast = () => {
  const [forecast, setForecast] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all active membership tiers and their monthly_fee
        const { data: tiers, error: tiersError } = await supabase
          .from('membership_tiers')
          .select('id, monthly_fee, is_active')
          .eq('is_active', true);
        if (tiersError) throw tiersError;

        // Fetch active member counts per tier
        const { data: counts, error: countsError } = await supabase
          .from('current_membership_counts')
          .select('membership_tier_id, active_members');
        if (countsError) throw countsError;

        // Map counts by tier id for quick lookup
        const countMap = new Map<string, number>();
        (counts || []).forEach(c => {
          countMap.set(c.membership_tier_id, c.active_members);
        });

        // Sum up forecast: active_members * monthly_fee for each tier
        let total = 0;
        (tiers || []).forEach(tier => {
          const members = countMap.get(tier.id) || 0;
          total += members * (tier.monthly_fee || 0);
        });
        setForecast(total);
      } catch (err: any) {
        setError('Failed to fetch membership revenue forecast');
      } finally {
        setIsLoading(false);
      }
    };
    fetchForecast();
  }, []);

  return { forecast, isLoading, error };
};
