
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MembershipPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership</h1>
        <p className="text-muted-foreground">Membership tracking coming soon</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Detailed membership tracking features will be implemented in future updates.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipPage;
