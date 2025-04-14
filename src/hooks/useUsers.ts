
import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

export type User = {
  id: string;
  email: string;
  role: "Staff" | "Partner";
  created_at: string;
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Query user_roles table for role information
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (userRolesError) throw userRolesError;

      // Get auth users (via edge function or view if available)
      // For this simplified version, we'll create a basic structure
      const mockUsers = [
        { id: '1', email: 'admin@example.com', created_at: new Date().toISOString() },
        { id: '2', email: 'staff@example.com', created_at: new Date().toISOString() },
      ];

      // Combine the data
      const combinedUsers = mockUsers.map(user => {
        const userRole = userRoles?.find(role => role.user_id === user.id);
        return {
          ...user,
          // Ensure role is either "Staff" or "Partner", defaulting to "Staff" if unknown
          role: (userRole?.role === "Staff" || userRole?.role === "Partner") 
            ? userRole.role 
            : "Staff" as const
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserRole = async (userId: string, role: "Staff" | "Partner") => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);

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

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    isUpdating,
    fetchUsers,
    updateUserRole
  };
};

export default useUsers;
