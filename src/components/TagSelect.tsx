
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Tags } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Tag {
  id: string;
  tag_name: string;
  color: string;
}

interface TagSelectProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

const TagSelect = ({ selectedTags, onTagsChange, className }: TagSelectProps) => {
  const [open, setOpen] = useState(false);

  const { data: tagsRaw, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('active', true)
        .order('tag_name');
      if (error) throw error;
      return data as Tag[];
    }
  });

  // Defensive: always arrays
  const tags = Array.isArray(tagsRaw) ? tagsRaw : [];
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];

  // Debug: log values
  console.log('TagSelect: selectedTags', selectedTags, 'safeSelectedTags', safeSelectedTags, 'tags', tags);

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = safeSelectedTags.includes(tagId)
      ? safeSelectedTags.filter(id => id !== tagId)
      : [...safeSelectedTags, tagId];
    onTagsChange(newSelectedTags);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex gap-2 flex-wrap">
              {safeSelectedTags.length > 0 && Array.isArray(tags) ? (
                tags
                  .filter(tag => safeSelectedTags.includes(tag.id))
                  .map(tag => (
                    <Badge key={tag.id} className={tag.color}>
                      {tag.tag_name}
                    </Badge>
                  ))
              ) : (
                <span className="text-muted-foreground">Select tags...</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {/* Defensive: tags always array */}
              {Array.isArray(tags)
                ? tags.map(tag => (
                    <CommandItem
                      key={tag.id}
                      value={tag.tag_name}
                      onSelect={() => handleTagToggle(tag.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          safeSelectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Badge className={tag.color}>{tag.tag_name}</Badge>
                    </CommandItem>
                  ))
                : <></>}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagSelect;
