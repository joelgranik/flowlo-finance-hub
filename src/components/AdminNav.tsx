
import { Link, useLocation } from "react-router-dom";

const AdminNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: "/admin/categories", label: "🗂️ Categories" },
    { path: "/admin/users", label: "👤 Users" },
    { path: "/admin/membership-tiers", label: "🏷️ Membership Tiers" }
  ];
  
  return (
    <div className="flex space-x-1 mb-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-4 py-2 rounded-md transition-colors ${
            isActive(item.path)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default AdminNav;
