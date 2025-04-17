
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, FileText, BarChart3, Settings, Menu } from "lucide-react";
import React from "react";

const Navbar = () => {
  const { logout, user, userRole, profile } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Determine the display name (first name, email username, or fallback)
  const displayName = profile?.first_name || 
    (user?.email ? user.email.split('@')[0] : 'User');

  // Nav links for reuse
  const navLinks = (
    <>
      <Link
        to="/dashboard"
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
        onClick={() => setMobileMenuOpen(false)}
      >
        <BarChart3 className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      <Link
        to="/data-entry"
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FileText className="h-4 w-4" />
        <span>Data Entry</span>
      </Link>
      {userRole === "Staff" && (
        <Link
          to="/admin"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Settings className="h-4 w-4" />
          <span>Admin</span>
        </Link>
      )}
    </>
  );

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-600">FloLo</span>
            <span className="text-xl font-medium text-gray-600">Cash Flow</span>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6">
            {navLinks}
          </nav>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-600"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Menu className="h-6 w-6 text-brand-600" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden md:inline text-sm font-medium text-gray-600">
              Welcome, {displayName}!
            </span>
          )}
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 text-gray-600 hover:text-brand-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md border-b z-50 md:hidden animate-fade-in">
            <nav className="flex flex-col gap-4 px-6 py-4">
              {navLinks}
              {user && (
                <span className="text-sm font-medium text-gray-600 mb-2">
                  Welcome, {displayName}!
                </span>
              )}
              <Button
                variant="ghost"
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-2 text-gray-600 hover:text-brand-600 w-fit"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
