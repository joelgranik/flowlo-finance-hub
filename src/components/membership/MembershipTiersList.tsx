
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useMembership } from "@/hooks/useMembership";
import MembershipTierForm from "./MembershipTierForm";
import { Switch } from "@/components/ui/switch";

interface MembershipTiersListProps {
  onEdit: (tierId: string) => void;
  editingTierId: string | null;
  onEditComplete: () => void;
}

const MembershipTiersList = ({
  onEdit,
  editingTierId,
  onEditComplete
}: MembershipTiersListProps) => {
  const { membershipTiers, toggleTierActive } = useMembership();

  const handleToggleActive = async (tierId: string, currentValue: boolean) => {
    await toggleTierActive(tierId, !currentValue);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Monthly Fee</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {membershipTiers.map((tier) => (
          <TableRow key={tier.id}>
            {editingTierId === tier.id ? (
              <TableCell colSpan={5}>
                <MembershipTierForm
                  tier={tier}
                  onCancel={onEditComplete}
                  onSuccess={onEditComplete}
                />
              </TableCell>
            ) : (
              <>
                <TableCell>{tier.tier_name}</TableCell>
                <TableCell>${tier.monthly_fee}</TableCell>
                <TableCell>{tier.description}</TableCell>
                <TableCell>
                  <Switch
                    checked={tier.is_active}
                    onCheckedChange={() => handleToggleActive(tier.id, tier.is_active)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(tier.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MembershipTiersList;
