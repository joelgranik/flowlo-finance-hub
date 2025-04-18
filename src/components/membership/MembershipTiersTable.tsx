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
    // Store previous state for rollback
    const prevCounts = { ...counts };
    const updates = Object.entries(counts).map(([tierId, count]) => ({
      membership_tier_id: tierId,
      active_members: count as number
    }));
    setHasChanges(false);
    // Optimistically update UI (already done by local state)
    const success = await updateMembershipCount(updates);
    if (!success) {
      setSubmitError('Failed to update membership counts. Rolling back.');
      setHasChanges(true);
      setCounts(prevCounts); // Roll back to previous state
    } else {
      // Refresh data from backend to ensure UI is in sync
      await fetchMembershipData();
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
            <TableHead>Projected Fees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membershipTiers.filter(tier => tier.is_active).map((tier) => {
            const projectedFees = (counts[tier.id] || 0) * tier.monthly_fee;
            return (
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
                <TableCell>${projectedFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <tfoot>
          <TableRow>
            <TableCell colSpan={3} className="font-bold text-right">Total Projected Fees:</TableCell>
            <TableCell className="font-bold">
              ${membershipTiers.filter(tier => tier.is_active).reduce((sum, tier) => sum + ((counts[tier.id] || 0) * tier.monthly_fee), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TableCell>
          </TableRow>
        </tfoot>
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
