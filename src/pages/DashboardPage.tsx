
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useBankBalance } from "@/hooks/useBankBalance";
import { useInflowsTotals } from "@/hooks/useInflowsTotals";
import { useOutflowsTotals } from "@/hooks/useOutflowsTotals";
import { useCashTrend } from "@/hooks/useCashTrend";
import { useMembershipRevenueForecast } from "@/hooks/useMembershipRevenueForecast";
import { useProjectedSurplusDeficit } from "@/hooks/useProjectedSurplusDeficit";
import { useActiveMembershipCount } from "@/hooks/useActiveMembershipCount";
import { useCashFlowWaterfallData } from "@/hooks/useCashFlowWaterfallData";
import WaterfallChart from "@/components/dashboard/WaterfallChart";
import { useUpcomingFlowsTableData } from "@/hooks/useUpcomingFlowsTableData";
import UpcomingFlowsTable from "@/components/dashboard/UpcomingFlowsTable";
import { useTopUpcomingFlows } from "@/hooks/useTopUpcomingFlows";
import TopFlowsTable from "@/components/dashboard/TopFlowsTable";

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
      
      <div className="grid gap-4 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-[auto-fit,minmax(320px,1fr)]">
        <Card className="min-w-[220px] w-full h-full flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bank Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 w-full h-full flex-1">
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
        <Card className="min-w-[220px] w-full h-full flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">7-Day Cash Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 w-full h-full flex-1">
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
        <Card className="min-w-[220px] w-full h-full flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">30-Day Membership Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 w-full h-full flex-1">
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
        <Card className="min-w-[220px] w-full h-full flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projected Cash Surplus/Deficit</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 w-full h-full flex-1">
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
        {/* Active Membership Count Card */}
        <Card className="min-w-[220px] w-full h-full flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Membership Count</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 w-full h-full flex-1">
            {(() => {
              const { count, isLoading: countLoading, error: countError } = useActiveMembershipCount();
              if (countLoading) {
                return <div className="text-2xl font-bold text-brand-600">Loading...</div>;
              } else if (countError) {
                return <div className="text-2xl font-bold text-danger-500">Error</div>;
              } else {
                return (
                  <div>
                    <div className="text-2xl font-bold text-brand-600">
                      {count !== null ? count.toLocaleString() : '—'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All active members across tiers
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        <Card className="min-w-[220px] w-full h-full flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tomorrow's Inflows</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 w-full h-full flex-1">
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
        <Card className="min-w-[220px] w-full h-full flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tomorrow's Outflows</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 w-full h-full flex-1">
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
        <Card className="min-w-[220px] w-full h-full flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outflows Over Next 7 Days</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 w-full h-full flex-1">
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
      
      <div className="grid gap-4 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-[auto-fit,minmax(320px,1fr)]">
        <Card className="col-span-1 min-w-[220px]">
          <CardHeader>
            <CardTitle>Upcoming Flows</CardTitle>
            <CardDescription>Next 14 days: inflows & outflows</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 md:p-4 overflow-x-auto w-full h-full flex-1">
            {(() => {
              const { data, isLoading, error } = useUpcomingFlowsTableData();
              if (isLoading) {
                return <div className="h-[240px] flex items-center justify-center text-brand-600">Loading...</div>;
              } else if (error) {
                return <div className="h-[240px] flex items-center justify-center text-danger-500">Error</div>;
              } else if (!data || data.length === 0) {
                return <div className="h-[240px] flex items-center justify-center text-muted-foreground">No data</div>;
              } else {
                return <UpcomingFlowsTable data={data} />;
              }
            })()}
          </CardContent>
        </Card>

        <Card className="col-span-1 min-w-[220px]">
          <CardHeader>
            <CardTitle>Cash Flow Waterfall</CardTitle>
            <CardDescription>Last 30 days: inflows, outflows, balances</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 md:p-4 overflow-x-auto w-full h-full flex-1">
            {(() => {
              const { data, isLoading, error } = useCashFlowWaterfallData();
              if (isLoading) {
                return <div className="h-[240px] flex items-center justify-center text-brand-600">Loading...</div>;
              } else if (error) {
                return <div className="h-[240px] flex items-center justify-center text-danger-500">Error</div>;
              } else if (!data || data.length === 0) {
                return <div className="h-[240px] flex items-center justify-center text-muted-foreground">No data</div>;
              } else {
                return <WaterfallChart data={data} />;
              }
            })()}
          </CardContent>
        </Card>

        {/* Top 5 Upcoming Outflows */}
        <Card className="col-span-1 min-w-[220px]">
          <CardHeader>
            <CardTitle>Top 5 Upcoming Outflows</CardTitle>
            <CardDescription>Sorted by amount (desc)</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 md:p-4 overflow-x-auto w-full h-full flex-1">
            {(() => {
              const { outflows, isLoading, error } = useTopUpcomingFlows();
              if (isLoading) {
                return <div className="h-[240px] flex items-center justify-center text-brand-600">Loading...</div>;
              } else if (error) {
                return <div className="h-[240px] flex items-center justify-center text-danger-500">Error</div>;
              } else if (!outflows || outflows.length === 0) {
                return <div className="h-[240px] flex items-center justify-center text-muted-foreground">No data</div>;
              } else {
                return <TopFlowsTable data={outflows} type="outflow" />;
              }
            })()}
          </CardContent>
        </Card>

        {/* Top 5 Expected Inflows */}
        <Card className="col-span-1 min-w-[220px]">
          <CardHeader>
            <CardTitle>Top 5 Expected Inflows</CardTitle>
            <CardDescription>Sorted by amount (desc)</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 md:p-4 overflow-x-auto w-full h-full flex-1">
            {(() => {
              const { inflows, isLoading, error } = useTopUpcomingFlows();
              if (isLoading) {
                return <div className="h-[240px] flex items-center justify-center text-brand-600">Loading...</div>;
              } else if (error) {
                return <div className="h-[240px] flex items-center justify-center text-danger-500">Error</div>;
              } else if (!inflows || inflows.length === 0) {
                return <div className="h-[240px] flex items-center justify-center text-muted-foreground">No data</div>;
              } else {
                return <TopFlowsTable data={inflows} type="inflow" />;
              }
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
