import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMembership } from "@/hooks/useMembership";
import type { MembershipTier } from "@/hooks/useMembership";

const MembershipTiersTable = () => {
  const { 
    membershipTiers, 
    membershipCounts,
    updateMembershipCount,
    isUpdating,
    fetchMembershipData,
  } = useMembership();

  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    // Initialize counts from current membership counts
    const initialCounts: Record<string, number> = {};
    membershipTiers.forEach((tier) => {
      const count = membershipCounts.find(c => c.membership_tier_id === tier.id);
      initialCounts[tier.id] = count?.active_members || 0;
    });
    setCounts(initialCounts);
    setHasChanges(false); // Reset change detection on new data
  }, [membershipTiers, membershipCounts]);

  const handleCountChange = (tierId: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setCounts(prev => ({
      ...prev,
      [tierId]: numValue
    }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    const updates = Object.entries(counts).map(([tierId, count]) => ({
      membership_tier_id: tierId,
      active_members: count as number // We know this is a number from handleCountChange
    }));
    
    // Disable the button during update
    setHasChanges(false);
    
    // Wait for the update to complete
    const success = await updateMembershipCount(updates);
    
    if (!success) {
      // If update failed, revert hasChanges to allow retrying
      setHasChanges(true);
      // Reset counts to last known good state
      const initialCounts: Record<string, number> = {};
      membershipTiers.forEach((tier) => {
        const count = membershipCounts.find(c => c.membership_tier_id === tier.id);
        initialCounts[tier.id] = count?.active_members || 0;
      });
      setCounts(initialCounts);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tier Name</TableHead>
            <TableHead>Monthly Fee</TableHead>
            <TableHead>Active Members</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membershipTiers.filter(tier => tier.is_active).map((tier) => (
            <TableRow key={tier.id}>
              <TableCell>{tier.tier_name}</TableCell>
              <TableCell>${tier.monthly_fee}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={counts[tier.id] || 0}
                  onChange={(e) => handleCountChange(tier.id, e.target.value)}
                  min={0}
                  className="w-32"
                  disabled={isUpdating}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isUpdating || !hasChanges}
        >
          {isUpdating ? "Updating..." : hasChanges ? "Update Counts" : "Updated"}
        </Button>
      </div>
    </div>
  );
};

export default MembershipTiersTable;
