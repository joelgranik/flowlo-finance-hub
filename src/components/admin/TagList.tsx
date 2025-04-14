
import { useState } from 'react';
import { Tag } from "@/hooks/useTags";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, CheckCircle, XCircle } from "lucide-react";
import TagForm from "./TagForm";

type TagListProps = {
  tags: Tag[];
  isLoading: boolean;
  onUpdateTag: (id: string, values: Partial<Tag>) => Promise<boolean>;
  onToggleActive: (id: string, isActive: boolean) => Promise<boolean>;
  isUpdating: boolean;
};

const TagList = ({
  tags,
  isLoading,
  onUpdateTag,
  onToggleActive,
  isUpdating,
}: TagListProps) => {
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (tag: Tag) => {
    setEditTag(tag);
    setIsDialogOpen(true);
  };

  const handleUpdateSubmit = async (values: Partial<Tag>) => {
    if (editTag) {
      const success = await onUpdateTag(editTag.id, values);
      if (success) {
        setIsDialogOpen(false);
        setEditTag(null);
      }
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Tag Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : tags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No tags found
              </TableCell>
            </TableRow>
          ) : (
            tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: tag.color }}
                  />
                </TableCell>
                <TableCell>{tag.tag_name}</TableCell>
                <TableCell>
                  {tag.active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(tag)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {tag.active ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleActive(tag.id, false)}
                      >
                        <XCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleActive(tag.id, true)}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {editTag && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
            </DialogHeader>
            <TagForm
              onSubmit={handleUpdateSubmit}
              initialData={editTag}
              isUpdating={isUpdating}
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default TagList;
