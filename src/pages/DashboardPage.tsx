
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useBankBalance } from "@/hooks/useBankBalance";

const DashboardPage = () => {
  const { user } = useAuth();
  const { bankBalance, isLoading, error } = useBankBalance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.email ? `, ${user.email}` : ""}! Here's an overview of your finances.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bank Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-2xl font-bold text-brand-600">Loading...</div>
            ) : error ? (
              <div className="text-2xl font-bold text-danger-500">Error</div>
            ) : (
              <div className="text-2xl font-bold text-brand-600">
                {bankBalance !== null ? `$${bankBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Latest input from Bank Balance form</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-500">$8,350.00</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger-500">$5,240.00</div>
            <p className="text-xs text-muted-foreground">-1.4% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Placeholder Transaction {i + 1}</p>
                    <p className="text-xs text-muted-foreground">April {14 - i}, 2025</p>
                  </div>
                  <div className={`text-sm font-medium ${i % 2 === 0 ? 'text-danger-500' : 'text-success-500'}`}>
                    {i % 2 === 0 ? '-' : '+'}${(Math.random() * 1000).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Monthly income vs. expenses</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[240px] flex items-center justify-center p-4 text-muted-foreground">
              Chart placeholder - Cash flow visualization
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
