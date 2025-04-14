
import { useState } from "react";
import { useTags } from "@/hooks/useTags";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TagForm from "@/components/admin/TagForm";
import TagList from "@/components/admin/TagList";
import { Plus } from "lucide-react";

const TagsPage = () => {
  const {
    tags,
    isLoading,
    isUpdating,
    createTag,
    updateTag,
    toggleTagActive,
  } = useTags();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateSubmit = async (values: any) => {
    const success = await createTag(values);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tags</h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Tag</DialogTitle>
            </DialogHeader>
            <TagForm
              onSubmit={handleCreateSubmit}
              isUpdating={isUpdating}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tag Management</CardTitle>
        </CardHeader>
        <CardContent>
          <TagList
            tags={tags}
            isLoading={isLoading}
            onUpdateTag={updateTag}
            onToggleActive={toggleTagActive}
            isUpdating={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TagsPage;
