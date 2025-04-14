
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tag } from "@/hooks/useTags";

const formSchema = z.object({
  tag_name: z.string().min(1, "Tag name is required"),
  color: z.string().min(1, "Color is required"),
  active: z.boolean().default(true),
});

const COLORS = [
  { value: "#EF4444", label: "Red" },
  { value: "#F97316", label: "Orange" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#10B981", label: "Emerald" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#6366F1", label: "Indigo" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#EC4899", label: "Pink" },
];

type TagFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  initialData?: Partial<Tag>;
  isUpdating: boolean;
};

const TagForm = ({ onSubmit, initialData, isUpdating }: TagFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag_name: initialData?.tag_name || "",
      color: initialData?.color || COLORS[0].value,
      active: initialData?.active !== undefined ? initialData.active : true,
    },
  });

  const isEditing = !!initialData?.id;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tag_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter tag name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-2">
                  {COLORS.map(color => (
                    <div
                      key={color.value}
                      className={`w-full h-10 rounded cursor-pointer flex justify-center items-center ${
                        field.value === color.value ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => form.setValue('color', color.value)}
                    >
                      {field.value === color.value && (
                        <span className="text-white">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <FormLabel className="font-normal">Active</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUpdating}>
          {isEditing ? 'Update Tag' : 'Create Tag'}
        </Button>
      </form>
    </Form>
  );
};

export default TagForm;
