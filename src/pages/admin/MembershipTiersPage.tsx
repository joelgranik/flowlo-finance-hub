
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MembershipTiersList from "@/components/membership/MembershipTiersList";
import MembershipTierForm from "@/components/membership/MembershipTierForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MembershipTiersPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTier, setEditingTier] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Tiers</h1>
          <p className="text-muted-foreground">Manage membership tiers and pricing</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          New Tier
        </Button>
      </div>

      <div className="space-y-6">
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Tier</CardTitle>
              <CardDescription>Add a new membership tier to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <MembershipTierForm
                onCancel={() => setShowCreateForm(false)}
                onSuccess={() => setShowCreateForm(false)}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Current Tiers</CardTitle>
            <CardDescription>View and manage existing membership tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <MembershipTiersList
              onEdit={setEditingTier}
              editingTierId={editingTier}
              onEditComplete={() => setEditingTier(null)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipTiersPage;
