
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { logout, user, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-600">FloLo</span>
            <span className="text-xl font-medium text-gray-600">Cash Flow</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
            >
              Dashboard
            </Link>
            <Link
              to="/data-entry"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
            >
              Data Entry
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && userRole && (
            <span className="hidden md:inline text-sm font-medium text-gray-600">
              Welcome, {userRole}!
            </span>
          )}
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
