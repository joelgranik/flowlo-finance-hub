
import { useState } from 'react';
import { Category } from "@/hooks/useCategories";
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
import CategoryForm from "./CategoryForm";

type CategoryListProps = {
  categories: Category[];
  isLoading: boolean;
  onUpdateCategory: (id: string, values: Partial<Category>) => Promise<boolean>;
  onToggleActive: (id: string, isActive: boolean) => Promise<boolean>;
  isUpdating: boolean;
};

const CategoryList = ({
  categories,
  isLoading,
  onUpdateCategory,
  onToggleActive,
  isUpdating,
}: CategoryListProps) => {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (category: Category) => {
    setEditCategory(category);
    setIsDialogOpen(true);
  };

  const handleUpdateSubmit = async (values: Partial<Category>) => {
    if (editCategory) {
      const success = await onUpdateCategory(editCategory.id, values);
      if (success) {
        setIsDialogOpen(false);
        setEditCategory(null);
      }
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Type</TableHead>
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
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.category_name}</TableCell>
                <TableCell className="capitalize">{category.type}</TableCell>
                <TableCell>
                  {category.active ? (
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
                      onClick={() => handleEditClick(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {category.active ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleActive(category.id, false)}
                      >
                        <XCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleActive(category.id, true)}
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
        {editCategory && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleUpdateSubmit}
              initialData={editCategory}
              isUpdating={isUpdating}
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default CategoryList;
