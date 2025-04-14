
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryList from "@/components/admin/CategoryList";
import { Plus } from "lucide-react";

const CategoriesPage = () => {
  const {
    categories,
    isLoading,
    isUpdating,
    createCategory,
    updateCategory,
    toggleCategoryActive,
  } = useCategories();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateSubmit = async (values: any) => {
    const success = await createCategory(values);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleCreateSubmit}
              isUpdating={isUpdating}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryList
            categories={categories}
            isLoading={isLoading}
            onUpdateCategory={updateCategory}
            onToggleActive={toggleCategoryActive}
            isUpdating={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
