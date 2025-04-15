import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBankBalance = () => {
  const [bankBalance, setBankBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestBankBalance = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('bank_balances')
      .select('ending_balance')
      .order('date', { ascending: false })
      .limit(1);
    if (error) {
      setError('Failed to fetch bank balance');
      setIsLoading(false);
      return;
    }
    setBankBalance(data && data.length > 0 ? data[0].ending_balance : null);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLatestBankBalance();
  }, []);

  return { bankBalance, isLoading, error, refetch: fetchLatestBankBalance };
};
