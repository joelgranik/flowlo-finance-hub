
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, FileText, BarChart3, Settings, Menu } from "lucide-react";
import React from "react";

const LOGO_SRC = "/flolo-logo.png";

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
        <>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Settings className="h-4 w-4" />
            <span>Admin</span>
          </Link>
          <Link
            to="/admin/membership-tiers"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="h-4 w-4 inline-block">🏷️</span>
            <span>Membership Tiers</span>
          </Link>
        </>
      )
    </>
  );

  return (
    <header className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-500 shadow-lg w-full border-b border-purple-900">
      <div className="relative flex items-center justify-between h-16 max-w-7xl mx-auto px-4 md:px-8">
        {/* Hamburger (left) */}
        {/* Hamburger (left, mobile only) */}
        <button
          className="flex items-center justify-center md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white hover:bg-purple-600 transition mr-2"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Menu className="h-8 w-8 text-white drop-shadow-md" />
        </button>

        {/* Logo (left) */}
        <Link to="/dashboard" className="flex items-center z-10 mr-6">
          <img
            src={LOGO_SRC}
            alt="FloLo Logo"
            className="h-12 md:h-14 w-auto drop-shadow-xl transition-transform hover:scale-105"
            style={{ maxWidth: 160 }}
          />
        </Link>

        {/* Desktop nav (center/right) */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          <nav className="flex gap-7 flex-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-purple-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/data-entry"
              className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-purple-200"
            >
              <FileText className="h-4 w-4" />
              <span>Data Entry</span>
            </Link>
            {userRole === "Staff" && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-purple-200"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
                <Link
                  to="/admin/membership-tiers"
                  className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-purple-200"
                >
                  <span className="h-4 w-4 inline-block">🏷️</span>
                  <span>Membership Tiers</span>
                </Link>
              </>
            )
          </nav>
          {user && (
            <span className="text-sm font-semibold text-white/90 ml-4">
              Welcome, {displayName}!
            </span>
          )}
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:text-purple-200 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              tabIndex={0}
            />
            {/* Drawer */}
            <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-b from-purple-700 to-purple-500 shadow-xl flex flex-col p-6 animate-slide-in">
              <div className="flex items-center mb-8">
                <img src={LOGO_SRC} alt="FloLo Holistic Logo" className="h-10 w-auto mx-auto" style={{ maxWidth: 140 }} />
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks}
              </nav>
              <div className="mt-8">
                {user && (
                  <span className="block text-sm font-medium text-white/90 mb-2">
                    Welcome, {displayName}!
                  </span>
                )}
                <Button
                  variant="ghost"
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 text-white hover:text-brand-200 w-fit"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}
    </header>
  );
};

export default Navbar;
