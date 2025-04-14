
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import InflowForm from "@/components/inflows/InflowForm";
import InflowsTable from "@/components/inflows/InflowsTable";
import type { InflowFormData } from "@/components/inflows/InflowForm";

const InflowsPage = () => {
  const [upcomingInflows, setUpcomingInflows] = useState([]);
  const [editingInflow, setEditingInflow] = useState(null);

  useEffect(() => {
    fetchUpcomingInflows();
  }, []);

  const onSubmit = async (values: InflowFormData) => {
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

      if (values.tagIds?.length > 0) {
        if (editingInflow) {
          await supabase
            .from('scheduled_item_tags')
            .delete()
            .eq('scheduled_item_id', editingInflow.id);
        }

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

  const handleDelete = async (inflowId: string) => {
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
        <InflowForm
          onSubmit={onSubmit}
          initialData={editingInflow}
          isEditing={!!editingInflow}
        />

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Inflows</CardTitle>
            <CardDescription>Expected incoming payments</CardDescription>
          </CardHeader>
          <CardContent>
            <InflowsTable
              inflows={upcomingInflows}
              onEdit={setEditingInflow}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InflowsPage;
