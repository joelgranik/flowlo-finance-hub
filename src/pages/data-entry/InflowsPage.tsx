
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InflowForm from "@/components/inflows/InflowForm";
import InflowsTable from "@/components/inflows/InflowsTable";
import { useInflows } from "@/hooks/useInflows";
import type { Inflow } from "@/hooks/useInflows";

const InflowsPage = () => {
  const { inflows, fetchInflows, createOrUpdateInflow, deleteInflow } = useInflows();
  const [editingInflow, setEditingInflow] = useState<Inflow | null>(null);

  useEffect(() => {
    fetchInflows();
  }, [fetchInflows]);

  const handleSubmit = async (values: any) => {
    const success = await createOrUpdateInflow(values, editingInflow);
    if (success) {
      setEditingInflow(null);
    }
  };

  const handleDelete = async (inflowId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this inflow entry?");
    if (confirmed) {
      await deleteInflow(inflowId);
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
          onSubmit={handleSubmit}
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
              inflows={inflows}
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
