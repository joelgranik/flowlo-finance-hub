
import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

export type User = {
  id: string;
  email: string;
  name?: string | null;
  role: "Owner" | "Staff" | "Partner";
  created_at: string;
  last_login?: string | null;
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, role, created_at, last_login');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserRole = async (userId: string, role: "Owner" | "Staff" | "Partner") => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      toast.success("User role updated successfully");
      await fetchUsers();
      return true;
    } catch (error) {
      toast.error("Failed to update user role");
      console.error('Error updating user role:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Invite a new user (Owner only)
  const inviteUser = async (email: string, name: string, role: "Owner" | "Staff" | "Partner") => {
    setIsUpdating(true);
    try {
      // Invite user via Supabase Auth (send invite email)
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        emailRedirectTo: window.location.origin + "/login",
        data: { name, role },
      });
      if (inviteError) throw inviteError;
      // Insert into profiles table
      if (inviteData?.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: inviteData.user.id, email, name, role });
        if (profileError) throw profileError;
      }
      toast.success(`Invite sent to ${email}. The email will mention FloLo Cash Flow.`);
      await fetchUsers();
      return true;
    } catch (error) {
      toast.error("Failed to invite user");
      console.error('Error inviting user:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Update user info (Owner only)
  const updateUserInfo = async (userId: string, updates: Partial<Omit<User, "id" | "role">>) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
      toast.success("User info updated successfully");
      await fetchUsers();
      return true;
    } catch (error) {
      toast.error("Failed to update user info");
      console.error('Error updating user info:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete user (Owner only)
  const deleteUser = async (userId: string) => {
    setIsUpdating(true);
    try {
      // Remove from profiles
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      toast.success("User deleted successfully");
      await fetchUsers();
      return true;
    } catch (error) {
      toast.error("Failed to delete user");
      console.error('Error deleting user:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };


  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    isUpdating,
    fetchUsers,
    updateUserRole,
    inviteUser,
    updateUserInfo,
    deleteUser,
  };
};

export default useUsers;
