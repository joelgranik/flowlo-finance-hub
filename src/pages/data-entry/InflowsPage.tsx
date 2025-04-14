import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit2, Trash2 } from "lucide-react";
import CategorySelect from "@/components/CategorySelect";
import TagSelect from "@/components/TagSelect";

const inflowSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  tags: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()).optional(),
});

const InflowsPage = () => {
  const [upcomingInflows, setUpcomingInflows] = useState([]);
  const [editingInflow, setEditingInflow] = useState(null);

  const form = useForm({
    resolver: zodResolver(inflowSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: "",
      notes: "",
      tags: "",
      category_id: "",
      tagIds: [],
    }
  });

  useEffect(() => {
    fetchUpcomingInflows();
  }, []);

  const onSubmit = async (values) => {
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

      // Handle tags
      if (values.tagIds?.length > 0) {
        if (editingInflow) {
          // Delete existing tags
          await supabase
            .from('scheduled_item_tags')
            .delete()
            .eq('scheduled_item_id', editingInflow.id);
        }

        // Insert new tags
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

      form.reset();
      setEditingInflow(null);
      fetchUpcomingInflows();
    } catch (error) {
      toast.error("Error saving inflow: " + error.message);
    }
  };

  const fetchUpcomingInflows = async () => {
    const { data: inflows, error } = await supabase
      .from('scheduled_items')
      .select(`
        *,
        category:category_id(category_name),
        scheduled_item_tags(tag_id, tags:tag_id(id, tag_name, color))
      `)
      .eq('type', 'Inflow')
      .order('expected_date', { ascending: true });

    if (error) {
      toast.error("Failed to fetch upcoming inflows");
    } else {
      setUpcomingInflows(inflows);
    }
  };

  const handleEdit = (inflow) => {
    setEditingInflow(inflow);
    const tagIds = inflow.scheduled_item_tags?.map(t => t.tag_id) || [];
    form.reset({
      description: inflow.item_name,
      amount: inflow.expected_amount,
      date: inflow.expected_date,
      notes: inflow.notes || "",
      category_id: inflow.category_id,
      tagIds: tagIds
    });
  };

  const handleDelete = async (inflowId) => {
    const confirmed = window.confirm("Are you sure you want to delete this inflow entry?");
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('scheduled_items')
          .delete()
          .eq('id', inflowId);

        if (error) throw error;

        toast.success("Inflow entry deleted successfully");
        fetchUpcomingInflows();
      } catch (error) {
        toast.error("Error deleting inflow: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inflows</h1>
        <p className="text-muted-foreground">Record expected income</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingInflow ? 'Edit Inflow' : 'New Inflow'}</CardTitle>
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
                          selectedTags={field.value || []}
                          onTagsChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {editingInflow ? 'Update Inflow' : 'Record Inflow'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Inflows</CardTitle>
            <CardDescription>Expected incoming payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingInflows.length > 0 ? (
                  upcomingInflows.map((inflow) => (
                    <TableRow key={inflow.id}>
                      <TableCell>{inflow.expected_date}</TableCell>
                      <TableCell>{inflow.item_name}</TableCell>
                      <TableCell>${inflow.expected_amount.toFixed(2)}</TableCell>
                      <TableCell>{inflow.category?.category_name || '-'}</TableCell>
                      <TableCell>{inflow.notes || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {inflow.scheduled_item_tags?.map(({ tags: tag }) => (
                            <Badge key={tag.id} className={tag.color}>
                              {tag.tag_name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEdit(inflow)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDelete(inflow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>No upcoming inflows</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InflowsPage;
