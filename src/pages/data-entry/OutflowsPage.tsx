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


const outflowSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),

});

const OutflowsPage = () => {
  const [upcomingOutflows, setUpcomingOutflows] = useState([]);
  const [editingOutflow, setEditingOutflow] = useState(null);

  const form = useForm({
    resolver: zodResolver(outflowSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: "",
      notes: "",
      category_id: "",

    }
  });

  useEffect(() => {
    fetchUpcomingOutflows();
  }, []);

  const fetchUpcomingOutflows = async () => {
    const { data, error } = await supabase
      .from('scheduled_items')
      .select(`
        *,
        category:category_id(category_name),


        )
      `)
      .eq('type', 'Outflow')
      .order('expected_date', { ascending: true });

    if (error) {
      toast.error("Failed to fetch upcoming outflows");
    } else {
      setUpcomingOutflows(data);
    }
  };

  const onSubmit = async (values) => {
    try {
      // Debug: log raw form values
      console.log('Outflow form values:', values);
      const payload: any = {
        item_name: values.description,
        expected_amount: Number(values.amount),
        expected_date: values.date,
        type: 'Outflow',
        notes: values.notes || null,
        category_id: values.category_id
      };
      if (!payload.notes) delete payload.notes;
      // Debug: log outgoing payload
      console.log('Outflow payload to Supabase:', payload);
      // Validation: check required fields
      if (!payload.item_name || !payload.expected_date || !payload.expected_amount || !payload.type || !payload.category_id) {
        toast.error('Please fill out all required fields.');
        return;
      }
      if (isNaN(payload.expected_amount) || payload.expected_amount <= 0) {
        toast.error('Amount must be a positive number.');
        return;
      }
      // Basic UUID format check for category_id
      if (!/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(payload.category_id)) {
        toast.error('Please select a valid category.');
        return;
      }

      let result;
      if (editingOutflow) {
        const { data, error } = await supabase
          .from('scheduled_items')
          .update(payload)
          .eq('id', editingOutflow.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('scheduled_items')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }


      if (editingOutflow) {

        await supabase

          .delete()
          .eq('scheduled_item_id', editingOutflow.id);
      }


      // Removed stray tag-related code block here.

      toast.success(editingOutflow 
        ? "Outflow updated successfully!" 
        : "Outflow recorded successfully!");

      form.reset();
      setEditingOutflow(null);
      fetchUpcomingOutflows();
    } catch (error: any) {
      console.error('Supabase error:', error);
      toast.error("Error saving outflow: " + (error.message || JSON.stringify(error)));
    }
  };

  const handleEdit = (outflow) => {
    setEditingOutflow(outflow);
    form.reset({
      description: outflow.item_name,
      amount: outflow.expected_amount,
      date: outflow.expected_date,
      notes: outflow.notes || "",
      category_id: outflow.category_id,

    });
  };

  const handleDelete = async (outflowId) => {
    const confirmed = window.confirm("Are you sure you want to delete this outflow entry?");
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('scheduled_items')
          .delete()
          .eq('id', outflowId);

        if (error) throw error;

        toast.success("Outflow entry deleted successfully");
        fetchUpcomingOutflows();
      } catch (error) {
        toast.error("Error deleting outflow: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Outflows</h1>
        <p className="text-muted-foreground">Record expected expenses</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingOutflow ? 'Edit Outflow' : 'New Outflow'}</CardTitle>
            <CardDescription>Record expected expense or payment</CardDescription>
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
                        <Input placeholder="e.g., Rent Payment" {...field} />
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
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CategorySelect
                  type="Expense"
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
                          placeholder="Optional notes about this outflow" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  {editingOutflow ? 'Update Outflow' : 'Record Outflow'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Outflows</CardTitle>
            <CardDescription>Expected expenses</CardDescription>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingOutflows.length > 0 ? (
                  upcomingOutflows.map((outflow) => (
                    <TableRow key={outflow.id}>
                      <TableCell>{outflow.expected_date}</TableCell>
                      <TableCell>{outflow.item_name}</TableCell>
                      <TableCell>${outflow.expected_amount.toFixed(2)}</TableCell>
                      <TableCell>{outflow.category?.category_name || '-'}</TableCell>
                      <TableCell>{outflow.notes || '-'}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEdit(outflow)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDelete(outflow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>No upcoming outflows</TableCell>
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

export default OutflowsPage;
