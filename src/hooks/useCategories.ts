
import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Category = {
  id: string;
  category_name: string;
  type: string;
  active: boolean;
  created_at: string;
  created_by: string | null;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('category_name');

      if (error) throw error;

      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = async (values: Omit<Category, 'id' | 'created_at' | 'created_by'>) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert([values]);

      if (error) throw error;

      toast.success("Category created successfully");
      await fetchCategories();
      return true;
    } catch (error: any) {
      // Check for unique constraint violation
      if (error?.code === '23505' || (typeof error?.message === 'string' && error.message.includes('unique constraint'))) {
        toast.error("A category with this name and type already exists.");
      } else {
        toast.error("Failed to create category");
      }
      console.error('Error creating category:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateCategory = async (id: string, values: Partial<Category>) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('categories')
        .update(values)
        .eq('id', id);

      if (error) throw error;

      toast.success("Category updated successfully");
      await fetchCategories();
      return true;
    } catch (error) {
      toast.error("Failed to update category");
      console.error('Error updating category:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleCategoryActive = async (id: string, isActive: boolean) => {
    return updateCategory(id, { active: isActive });
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    isUpdating,
    fetchCategories,
    createCategory,
    updateCategory,
    toggleCategoryActive
  };
};

export default useCategories;
