
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MembershipTiersTable from "@/components/membership/MembershipTiersTable";

const MembershipPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership</h1>
        <p className="text-muted-foreground">Update current membership counts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Membership Counts</CardTitle>
          <CardDescription>
            Enter the current number of active members for each tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembershipTiersTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipPage;
