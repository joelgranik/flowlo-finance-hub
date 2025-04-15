
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InflowFormData } from "@/components/inflows/InflowForm";

export type Inflow = {
  id: string;
  expected_date: string;
  item_name: string;
  expected_amount: number;
  category?: { category_name: string };
  notes?: string;
  scheduled_item_tags?: Array<{
    tags: {
      id: string;
      tag_name: string;
      color: string;
    };
  }>;
}

export const useInflows = () => {
  const [inflows, setInflows] = useState<Inflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInflows = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_items')
        .select(`
          *,
          category:category_id(category_name),
          scheduled_item_tags(tag_id, tags:tag_id(id, tag_name, color))
        `)
        .eq('type', 'Inflow')
        .order('expected_date', { ascending: true });

      if (error) throw error;
      setInflows(data || []);
    } catch (error) {
      toast.error("Failed to fetch upcoming inflows");
      console.error('Error fetching inflows:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrUpdateInflow = async (values: InflowFormData, editingInflow: Inflow | null = null) => {
    try {
      const payload = {
        item_name: values.description,
        expected_amount: values.amount,
        expected_date: values.date,
        type: 'Inflow',
        notes: values.notes || null,
        category_id: values.category_id
      };

      let result;
      if (editingInflow) {
        const { data, error } = await supabase
          .from('scheduled_items')
          .update(payload)
          .eq('id', editingInflow.id)
          .select();
        if (error) throw error;
        result = data[0];
      } else {
        const { data, error } = await supabase
          .from('scheduled_items')
          .insert(payload)
          .select();
        if (error) throw error;
        result = data[0];
      }

      // Always update tags: delete old ones for editing, insert new ones for both create and edit
      if (editingInflow) {
        const { error: delError } = await supabase
          .from('scheduled_item_tags')
          .delete()
          .eq('scheduled_item_id', editingInflow.id);
        if (delError) throw delError;
      }
      if (values.tagIds?.length > 0) {
        const tagInserts = values.tagIds.map(tagId => ({
          scheduled_item_id: result.id,
          tag_id: tagId
        }));
        const { error: tagError } = await supabase
          .from('scheduled_item_tags')
          .insert(tagInserts);
        if (tagError) throw tagError;
      }

      toast.success(editingInflow 
        ? "Inflow updated successfully!" 
        : "Inflow recorded successfully!");

      await fetchInflows();
      return true;
    } catch (error) {
      toast.error("Error saving inflow: " + (error as Error).message);
      return false;
    }
  };

  const deleteInflow = async (inflowId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_items')
        .delete()
        .eq('id', inflowId);

      if (error) throw error;

      toast.success("Inflow entry deleted successfully");
      await fetchInflows();
      return true;
    } catch (error) {
      toast.error("Error deleting inflow: " + (error as Error).message);
      return false;
    }
  };

  return {
    inflows,
    isLoading,
    fetchInflows,
    createOrUpdateInflow,
    deleteInflow
  };
};
