
import { Outlet } from "react-router-dom";
import AdminNav from "@/components/AdminNav";

const AdminPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <p className="text-muted-foreground">Manage categories, tags, and users</p>
      </div>
      
      <AdminNav />
      
      <div className="border rounded-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
