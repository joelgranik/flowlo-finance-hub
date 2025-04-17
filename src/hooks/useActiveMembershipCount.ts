import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useActiveMembershipCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('current_membership_counts')
          .select('active_members');
        if (fetchError) throw fetchError;
        const total = (data || []).reduce((sum, row) => sum + (row.active_members || 0), 0);
        setCount(total);
      } catch (err: any) {
        setError('Failed to fetch active membership count');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCount();
  }, []);

  return { count, isLoading, error };
};
