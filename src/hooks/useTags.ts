
import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Tag = {
  id: string;
  tag_name: string;
  color: string;
  active: boolean;
  created_at: string;
  created_by: string | null;
};

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('tag_name');

      if (error) throw error;

      setTags(data);
    } catch (error) {
      toast.error("Failed to fetch tags");
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTag = async (values: Omit<Tag, 'id' | 'created_at' | 'created_by'>) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('tags')
        .insert([values]);

      if (error) throw error;

      toast.success("Tag created successfully");
      await fetchTags();
      return true;
    } catch (error) {
      toast.error("Failed to create tag");
      console.error('Error creating tag:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateTag = async (id: string, values: Partial<Tag>) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('tags')
        .update(values)
        .eq('id', id);

      if (error) throw error;

      toast.success("Tag updated successfully");
      await fetchTags();
      return true;
    } catch (error) {
      toast.error("Failed to update tag");
      console.error('Error updating tag:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleTagActive = async (id: string, isActive: boolean) => {
    return updateTag(id, { active: isActive });
  };

  // Initial fetch
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    isLoading,
    isUpdating,
    fetchTags,
    createTag,
    updateTag,
    toggleTagActive
  };
};

export default useTags;
