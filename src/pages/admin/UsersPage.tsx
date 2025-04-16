
import { useUsers } from "@/hooks/useUsers";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { User as AppUser } from "@/hooks/useUsers";

const UsersPage = () => {
  const {
    users,
    isLoading,
    isUpdating,
    updateUserRole,
    inviteUser,
    updateUserInfo,
    deleteUser,
    fetchUsers,
  } = useUsers();
  const { user: currentUser } = useAuth();

  // Determine if current user is Owner
  const isOwner = useMemo(() => {
    if (!currentUser) return false;
    const me = users.find((u) => u.id === currentUser.id);
    return me?.role === "Owner";
  }, [users, currentUser]);

  // Modal and edit state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Handlers
  const handleRoleChange = async (userId: string, role: "Owner" | "Staff" | "Partner") => {
    await updateUserRole(userId, role);
  };

  const handleEditUser = (user: AppUser) => setEditUser(user);
  const handleDeleteUser = (user: AppUser) => setDeleteUserId(user.id);

  // Invite logic
  const handleInviteUser = async (form: { name: string; email: string; role: "Owner" | "Staff" | "Partner" }) => {
    setModalLoading(true);
    const ok = await inviteUser(form.email, form.name, form.role);
    setModalLoading(false);
    if (ok) setInviteOpen(false);
  };

  // Delete logic
  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;
    setModalLoading(true);
    const ok = await deleteUser(deleteUserId);
    setModalLoading(false);
    if (ok) setDeleteUserId(null);
  };

  // Edit logic (simplified: only name for now)
  const handleSaveEdit = async (updates: Partial<AppUser>) => {
    if (!editUser) return;
    setModalLoading(true);
    const ok = await updateUserInfo(editUser.id, updates);
    setModalLoading(false);
    if (ok) setEditUser(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        {isOwner && (
          <Button onClick={() => setInviteOpen(true)}>
            + Add User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span>User Management</span>
            <AlertCircle className="ml-2 h-5 w-5 text-amber-500" />
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              This is a basic implementation. Full user management requires additional setup.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 && !isLoading ? (
            <div className="text-center py-4">
              <p>No users available. User management requires proper authentication setup.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Connect your Supabase authentication to manage users effectively.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name || '-'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: "Owner" | "Staff" | "Partner") => handleRoleChange(user.id, value)}
                          disabled={isUpdating || !isOwner}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Owner">Owner</SelectItem>
                            <SelectItem value="Staff">Staff</SelectItem>
                            <SelectItem value="Partner">Partner</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{user.last_login ? new Date(user.last_login).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        {isOwner ? (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user)}>
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground" title="Only Owner can edit/delete users">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
