import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DataEntryPage from "./pages/DataEntryPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Data Entry Pages
import BankBalancePage from "./pages/data-entry/BankBalancePage";
import InflowsPage from "./pages/data-entry/InflowsPage";
import OutflowsPage from "./pages/data-entry/OutflowsPage";
import MembershipPage from "./pages/data-entry/MembershipPage";
import MembershipTiersPage from "./pages/admin/MembershipTiersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<Layout />}>
              <Route
                path="/data-entry"
                element={
                  <ProtectedRoute requiredRole="Staff">
                    <DataEntryPage />
                  </ProtectedRoute>
                }
              >
                <Route path="bank-balance" element={<BankBalancePage />} />
                <Route path="inflows" element={<InflowsPage />} />
                <Route path="outflows" element={<OutflowsPage />} />
                <Route path="membership" element={<MembershipPage />} />
                <Route index element={<Navigate to="bank-balance" replace />} />
              </Route>
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="Partner">
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/admin/membership-tiers"
                element={
                  <ProtectedRoute requiredRole="Staff">
                    <MembershipTiersPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
