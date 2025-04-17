
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useBankBalance } from "@/hooks/useBankBalance";
import { useInflowsTotals } from "@/hooks/useInflowsTotals";
import { useOutflowsTotals } from "@/hooks/useOutflowsTotals";
import { useCashTrend } from "@/hooks/useCashTrend";
import { useMembershipRevenueForecast } from "@/hooks/useMembershipRevenueForecast";
import { useProjectedSurplusDeficit } from "@/hooks/useProjectedSurplusDeficit";

const DashboardPage = () => {
  const { user } = useAuth();
  const { bankBalance, isLoading, error } = useBankBalance();
  const { tomorrowTotal, next7DaysTotal, isLoading: inflowsLoading, error: inflowsError } = useInflowsTotals();
  const { tomorrowTotal: outTomorrow, next7DaysTotal: outNext7, isLoading: outflowsLoading, error: outflowsError } = useOutflowsTotals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.email ? `, ${user.email}` : ""}! Here's an overview of your finances.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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

        {/* 7-Day Cash Trend Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">7-Day Cash Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const { recentNet, priorNet, percentChange, isLoading: trendLoading, error: trendError } = useCashTrend();
              if (trendLoading) {
                return <div className="text-2xl font-bold text-brand-600">Loading...</div>;
              } else if (trendError) {
                return <div className="text-2xl font-bold text-danger-500">Error</div>;
              } else {
                const trendUp = percentChange !== null && percentChange >= 0;
                return (
                  <div>
                    <div className={`text-2xl font-bold ${trendUp ? 'text-success-500' : 'text-danger-500'} flex items-center gap-2`}>
                      {recentNet !== null ? `$${recentNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                      {percentChange !== null && (
                        <span className={`flex items-center ml-2 text-base ${trendUp ? 'text-success-600' : 'text-danger-600'}`}>
                          {trendUp ? '▲' : '▼'}
                          {Math.abs(percentChange).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      vs. prior 7 days
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* 30-Day Membership Revenue Forecast Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">30-Day Membership Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const { forecast, isLoading: forecastLoading, error: forecastError } = useMembershipRevenueForecast();
              if (forecastLoading) {
                return <div className="text-2xl font-bold text-brand-600">Loading...</div>;
              } else if (forecastError) {
                return <div className="text-2xl font-bold text-danger-500">Error</div>;
              } else {
                return (
                  <div>
                    <div className="text-2xl font-bold text-brand-600">
                      {forecast !== null ? `$${forecast.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Next 30 days, all active members
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Projected Cash Surplus/Deficit Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projected Cash Surplus/Deficit</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const { net, inflows, outflows, isLoading: projLoading, error: projError } = useProjectedSurplusDeficit();
              if (projLoading) {
                return <div className="text-2xl font-bold text-brand-600">Loading...</div>;
              } else if (projError) {
                return <div className="text-2xl font-bold text-danger-500">Error</div>;
              } else {
                const isSurplus = net !== null && net >= 0;
                return (
                  <div>
                    <div className={`text-2xl font-bold ${isSurplus ? 'text-success-500' : 'text-danger-500'}`}>
                      {net !== null ? `${isSurplus ? '+' : '-'}$${Math.abs(net).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Next 7 days: inflows <span className="text-success-600">${inflows !== null ? inflows.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}</span>, outflows <span className="text-danger-600">${outflows !== null ? outflows.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}</span>
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tomorrow's Inflows</CardTitle>
          </CardHeader>
          <CardContent>
            {inflowsLoading ? (
              <div className="text-2xl font-bold text-success-500">Loading...</div>
            ) : inflowsError ? (
              <div className="text-2xl font-bold text-danger-500">Error</div>
            ) : (
              <div className="text-2xl font-bold text-success-500">
                {tomorrowTotal !== null ? `$${tomorrowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Expected inflows for tomorrow</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tomorrow's Outflows</CardTitle>
          </CardHeader>
          <CardContent>
            {outflowsLoading ? (
              <div className="text-2xl font-bold text-danger-500">Loading...</div>
            ) : outflowsError ? (
              <div className="text-2xl font-bold text-danger-500">Error</div>
            ) : (
              <div className="text-2xl font-bold text-danger-500">
                {outTomorrow !== null ? `$${outTomorrow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Expected outflows for tomorrow</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outflows Over Next 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {outflowsLoading ? (
              <div className="text-2xl font-bold text-danger-500">Loading...</div>
            ) : outflowsError ? (
              <div className="text-2xl font-bold text-danger-500">Error</div>
            ) : (
              <div className="text-2xl font-bold text-danger-500">
                {outNext7 !== null ? `$${outNext7.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Expected outflows for the next 7 days</p>
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
