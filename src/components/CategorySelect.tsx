
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategorySelectProps {
  type: 'Income' | 'Expense';
  name: string;
  control: any;
  label?: string;
}

const CategorySelect = ({ type, name, control, label = "Category" }: CategorySelectProps) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', type)
        .eq('active', true)
        .order('category_name');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <FormField
      control={control}
      name={name}
      rules={{ required: "Category is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorySelect;
