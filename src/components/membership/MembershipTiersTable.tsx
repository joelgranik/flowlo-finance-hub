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
  const [inputErrors, setInputErrors] = React.useState<Record<string, string>>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);

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
    let error = '';
    let numValue = parseInt(value, 10);
    if (value === '' || isNaN(numValue)) {
      error = 'Required';
      numValue = 0;
    } else if (numValue < 0) {
      error = 'Must be non-negative';
    } else if (!Number.isInteger(numValue)) {
      error = 'Must be an integer';
    }
    setInputErrors(prev => ({ ...prev, [tierId]: error }));
    setCounts(prev => ({
      ...prev,
      [tierId]: numValue
    }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    // Prevent submit if any errors
    const hasAnyError = Object.values(inputErrors).some(e => e);
    if (hasAnyError) {
      setSubmitError('Please fix validation errors before submitting.');
      return;
    }
    const updates = Object.entries(counts).map(([tierId, count]) => ({
      membership_tier_id: tierId,
      active_members: count as number // We know this is a number from handleCountChange
    }));
    // Disable the button during update
    setHasChanges(false);
    // Wait for the update to complete
    const success = await updateMembershipCount(updates);
    if (!success) {
      setSubmitError('Failed to update membership counts. Please try again.');
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
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          🔄 Updated Membership Form (v2) - Changes will persist correctly
        </p>
      </div>
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
                  aria-invalid={!!inputErrors[tier.id]}
                />
                {inputErrors[tier.id] && (
                  <div className="text-xs text-red-600 mt-1">{inputErrors[tier.id]}</div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {submitError && (
        <div className="text-sm text-red-600 mb-2">{submitError}</div>
      )}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isUpdating || !hasChanges || Object.values(inputErrors).some(e => e)}
        >
          {isUpdating ? "Updating..." : hasChanges ? "Update Counts" : "Updated"}
        </Button>
      </div>
    </div>
  );
};

export default MembershipTiersTable;
