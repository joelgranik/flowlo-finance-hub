
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CategorySelect from "@/components/CategorySelect";
import TagSelect from "@/components/TagSelect";

const inflowSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),

  category_id: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()).default([]),
});

export type InflowFormData = z.infer<typeof inflowSchema>;

interface InflowFormProps {
  onSubmit: (values: InflowFormData) => Promise<void>;
  initialData?: Partial<InflowFormData>;
  isEditing?: boolean;
}

const InflowForm = ({ onSubmit, initialData, isEditing }: InflowFormProps) => {
  const form = useForm<InflowFormData>({
    resolver: zodResolver(inflowSchema),
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      date: initialData?.date || "",
      notes: initialData?.notes || "",
      category_id: initialData?.category_id || "",
      tagIds: Array.isArray(initialData?.tagIds) ? initialData.tagIds : [],
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Inflow' : 'New Inflow'}</CardTitle>
        <CardDescription>Record expected income or payment</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Client Payment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500">$</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        step="0.01"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CategorySelect
              type="Income"
              name="category_id"
              control={form.control}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional notes about this inflow" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelect
                      selectedTags={Array.isArray(field.value) ? field.value : []}
                      onTagsChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isEditing ? 'Update Inflow' : 'Record Inflow'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InflowForm;
