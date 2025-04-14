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

const bankBalanceSchema = z.object({
  balance: z.coerce.number().positive("Balance must be a positive number"),
  notes: z.string().optional(),
  tags: z.string().optional(),
  category_id: z.string().optional()
});

const BankBalancePage = () => {
  const [recentBalances, setRecentBalances] = useState([]);
  const [editingBalance, setEditingBalance] = useState(null);

  const form = useForm({
    resolver: zodResolver(bankBalanceSchema),
    defaultValues: {
      balance: 0,
      notes: "",
      tags: "",
      category_id: ""
    }
  });

  useEffect(() => {
    fetchRecentBalances();
  }, []);

  const fetchRecentBalances = async () => {
    const { data, error } = await supabase
      .from('bank_balances')
      .select('*, category:category_id(category_name)')
      .order('date', { ascending: false })
      .limit(5);

    if (error) {
      toast.error("Failed to fetch recent balances");
    } else {
      setRecentBalances(data);
    }
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        date: new Date().toISOString().split('T')[0],
        ending_balance: values.balance,
        notes: values.notes || null,
        tags: values.tags || null,
        category_id: values.category_id || null
      };

      const { data, error } = editingBalance 
        ? await supabase
            .from('bank_balances')
            .update(payload)
            .eq('id', editingBalance.id)
        : await supabase.from('bank_balances').insert(payload).select();

      if (error) throw error;

      toast.success(editingBalance 
        ? "Balance updated successfully!" 
        : "Balance recorded successfully!");

      form.reset();
      setEditingBalance(null);
      fetchRecentBalances();
    } catch (error) {
      toast.error("Error saving balance: " + error.message);
    }
  };

  const handleEdit = (balance) => {
    setEditingBalance(balance);
    form.reset({
      balance: balance.ending_balance,
      notes: balance.notes || "",
      tags: balance.tags || "",
      category_id: balance.category_id || ""
    });
  };

  const handleDelete = async (balanceId) => {
    const confirmed = window.confirm("Are you sure you want to delete this balance entry?");
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('bank_balances')
          .delete()
          .eq('id', balanceId);

        if (error) throw error;

        toast.success("Balance entry deleted successfully");
        fetchRecentBalances();
      } catch (error) {
        toast.error("Error deleting balance: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bank Balance</h1>
        <p className="text-muted-foreground">Record daily bank balance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingBalance ? 'Edit Balance' : 'Record Balance'}</CardTitle>
            <CardDescription>Enter today's ending bank balance</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Balance Amount</FormLabel>
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
                
                <CategorySelect
                  type="Income"
                  name="category_id"
                  control={form.control}
                  label="Category (Optional)"
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Optional notes about this balance" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Optional tags (e.g., Personal, Business)" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {editingBalance ? 'Update Balance' : 'Save Balance'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Balances</CardTitle>
            <CardDescription>Last 5 recorded balances</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBalances.length > 0 ? (
                  recentBalances.map((balance) => (
                    <TableRow key={balance.id}>
                      <TableCell>{balance.date}</TableCell>
                      <TableCell>${balance.ending_balance.toFixed(2)}</TableCell>
                      <TableCell>{balance.category?.category_name || '-'}</TableCell>
                      <TableCell>{balance.notes || '-'}</TableCell>
                      <TableCell>{balance.tags || '-'}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEdit(balance)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDelete(balance.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>No data available</TableCell>
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

export default BankBalancePage;
