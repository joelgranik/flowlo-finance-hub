
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

const UsersPage = () => {
  const {
    users,
    isLoading,
    isUpdating,
    updateUserRole,
  } = useUsers();

  const handleRoleChange = async (userId: string, role: "Staff" | "Partner") => {
    await updateUserRole(userId, role);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: "Staff" | "Partner") => handleRoleChange(user.id, value)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Staff">Staff</SelectItem>
                            <SelectItem value="Partner">Partner</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
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
