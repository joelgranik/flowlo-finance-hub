import React, { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from '@/integrations/supabase/types';

export type MembershipTier = {
  id: string;
  tier_name: string;
  monthly_fee: number;
  description: string | null;
  is_active: boolean;
};

export type MembershipCount = {
  id: string;
  membership_tier_id: string;
  active_members: number;
};

export const useMembership = () => {
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [membershipCounts, setMembershipCounts] = useState<MembershipCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMembershipData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tiersResult, countsResult] = await Promise.all([
        supabase
          .from('membership_tiers')
          .select('*')
          .order('tier_name'),
        supabase
          .from('current_membership_counts')
          .select('*')
      ]);

      if (tiersResult.error) throw tiersResult.error;
      if (countsResult.error) throw countsResult.error;

      setMembershipTiers(tiersResult.data);
      setMembershipCounts(countsResult.data);
    } catch (error) {
      toast.error("Failed to fetch membership data");
      console.error('Error fetching membership data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMembershipCount = async (updates: { membership_tier_id: string; active_members: number }[]) => {
    setIsUpdating(true);
    
    try {
      // First, get existing counts to determine if we need to insert or update
      const { data: existingCounts, error: fetchError } = await supabase
        .from('current_membership_counts')
        .select('membership_tier_id')
        .in('membership_tier_id', updates.map(u => u.membership_tier_id));

      if (fetchError) throw fetchError;

      const existingTierIds = new Set(existingCounts?.map(c => c.membership_tier_id));
      
      // Separate updates into inserts and updates
      const insertsAndUpdates = updates.map(update => ({
        ...update,
        created_at: new Date().toISOString(),
        // If the tier_id exists, we want to update, otherwise insert
        id: existingTierIds.has(update.membership_tier_id) ? undefined : crypto.randomUUID()
      }));

      // Perform the upsert with the correct configuration
      const { error } = await supabase
        .from('current_membership_counts')
        .upsert(insertsAndUpdates, {
          onConflict: 'membership_tier_id',
          ignoreDuplicates: false
        });
        
      if (error) {
        console.error('Error in upsert operation:', error);
        throw error;
      }
      
      // Fetch the latest data to ensure UI is in sync
      await fetchMembershipData();
      
      toast.success("Membership counts updated successfully");
      return true;
    } catch (error) {
      console.error('Error updating membership counts:', error);
      toast.error("Failed to update membership counts");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Initial fetch
  React.useEffect(() => {
    fetchMembershipData();
  }, [fetchMembershipData]);

  const createTier = async (values: Omit<MembershipTier, 'id'>) => {
    try {
      const { error } = await supabase
        .from('membership_tiers')
        .insert([values]);

      if (error) throw error;

      toast.success("Membership tier created successfully");
      await fetchMembershipData();
      return true;
    } catch (error) {
      toast.error("Failed to create membership tier");
      console.error('Error creating membership tier:', error);
      return false;
    }
  };

  const updateTier = async (tierId: string, values: Partial<MembershipTier>) => {
    try {
      const { error } = await supabase
        .from('membership_tiers')
        .update(values)
        .eq('id', tierId);

      if (error) throw error;

      toast.success("Membership tier updated successfully");
      await fetchMembershipData();
      return true;
    } catch (error) {
      toast.error("Failed to update membership tier");
      console.error('Error updating membership tier:', error);
      return false;
    }
  };

  const toggleTierActive = async (tierId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('membership_tiers')
        .update({ is_active: isActive })
        .eq('id', tierId);

      if (error) throw error;

      toast.success(`Membership tier ${isActive ? 'activated' : 'deactivated'} successfully`);
      await fetchMembershipData();
      return true;
    } catch (error) {
      toast.error(`Failed to ${isActive ? 'activate' : 'deactivate'} membership tier`);
      console.error('Error toggling membership tier:', error);
      return false;
    }
  };

  return {
    membershipTiers,
    membershipCounts,
    isLoading,
    isUpdating,
    updateMembershipCount,
    fetchMembershipData,
    createTier,
    updateTier,
    toggleTierActive
  };
};

export default useMembership;
