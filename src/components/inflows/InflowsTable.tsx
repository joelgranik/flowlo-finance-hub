
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";

interface Inflow {
  id: string;
  expected_date: string;
  item_name: string;
  expected_amount: number;
  category?: { category_name: string };
  notes?: string;
  scheduled_item_tags?: Array<{
    tags: {
      id: string;
      tag_name: string;
      color: string;
    };
  }>;
}

interface InflowsTableProps {
  inflows: Inflow[];
  onEdit: (inflow: Inflow) => void;
  onDelete: (inflowId: string) => void;
}

const InflowsTable = ({ inflows, onEdit, onDelete }: InflowsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Notes</TableHead>

          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inflows.length > 0 ? (
          inflows.map((inflow) => (
            <TableRow key={inflow.id}>
              <TableCell>{inflow.expected_date}</TableCell>
              <TableCell>{inflow.item_name}</TableCell>
              <TableCell>${inflow.expected_amount.toFixed(2)}</TableCell>
              <TableCell>{inflow.category?.category_name || '-'}</TableCell>
              <TableCell>{inflow.notes || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {inflow.scheduled_item_tags?.map(({ tags: tag }) => (
                    <Badge key={tag.id} className={tag.color}>
                      {tag.tag_name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onEdit(inflow)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => onDelete(inflow.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7}>No upcoming inflows</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default InflowsTable;
