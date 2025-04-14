
import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMembership } from "@/hooks/useMembership";
import type { MembershipTier } from "@/hooks/useMembership";

interface MembershipTierFormProps {
  tier?: MembershipTier;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormValues {
  tier_name: string;
  monthly_fee: number;
  description: string;
  is_active: boolean;
}

const MembershipTierForm = ({
  tier,
  onCancel,
  onSuccess
}: MembershipTierFormProps) => {
  const { createTier, updateTier } = useMembership();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: tier ? {
      tier_name: tier.tier_name,
      monthly_fee: tier.monthly_fee,
      description: tier.description || '',
      is_active: tier.is_active
    } : {
      tier_name: '',
      monthly_fee: 0,
      description: '',
      is_active: true
    }
  });

  const onSubmit = async (data: FormValues) => {
    const success = tier
      ? await updateTier(tier.id, data)
      : await createTier(data);
    
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tier Name
          </label>
          <Input
            {...register("tier_name", { required: "Tier name is required" })}
            className={errors.tier_name ? "border-red-500" : ""}
          />
          {errors.tier_name && (
            <p className="text-red-500 text-sm mt-1">{errors.tier_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Monthly Fee
          </label>
          <Input
            type="number"
            step="0.01"
            {...register("monthly_fee", {
              required: "Monthly fee is required",
              min: { value: 0, message: "Fee cannot be negative" }
            })}
            className={errors.monthly_fee ? "border-red-500" : ""}
          />
          {errors.monthly_fee && (
            <p className="text-red-500 text-sm mt-1">{errors.monthly_fee.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            {...register("is_active")}
          />
          <label className="text-sm font-medium">
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {tier ? 'Update' : 'Create'} Tier
        </Button>
      </div>
    </form>
  );
};

export default MembershipTierForm;
