
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
    <div className="bg-[#F9FAFB] min-h-screen w-full p-4 md:p-8">
      {/* Header with Date Range Picker */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'Inter, IBM Plex Sans, system-ui, sans-serif' }}>Dashboard</h1>
          <p className="text-gray-500 mt-1" style={{ fontWeight: 400 }}>
            Welcome back{user?.email ? `, ${user.email}` : ""}! Here's an overview of your finances.
          </p>
        </div>
        {/* Date Range Picker */}
        <div className="mt-4 md:mt-0">
          {/* Replace with your actual DateRangePicker component */}
          <div className="bg-white border border-[#E5E7EB] rounded-md shadow-md px-4 py-2 flex items-center text-sm font-medium" style={{ minWidth: 180 }}>
            <span className="mr-2 text-gray-700">Date range:</span>
            <select className="bg-transparent outline-none" defaultValue="30d">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="ytd">Year to date</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Strip (Row 1) */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        {/* Bank Balance */}
        <Card className="col-span-12 md:col-span-3 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-6">
          <CardHeader className="flex flex-col items-center pb-2">
            {/* SVG icon placeholder */}
            <div className="mb-1"><svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#A78BFA" strokeWidth="2"/><path d="M8 14h12M8 18h12M8 10h12" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
            <CardTitle className="text-base font-semibold text-gray-800">Bank Balance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {isLoading ? (
              <div className="text-[32px] font-bold text-brand-600">Loading...</div>
            ) : error ? (
              <div className="text-[32px] font-bold text-danger-500">Error</div>
            ) : (
              <div className="text-[32px] font-bold text-brand-600">
                {bankBalance !== null ? `$${bankBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Latest input from Bank Balance form</p>
          </CardContent>
        </Card>
        {/* Active Membership Count */}
        <Card className="col-span-12 md:col-span-3 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-6">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1"><svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#A78BFA" strokeWidth="2"/><path d="M10 18v-2a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="12" r="2" stroke="#A78BFA" strokeWidth="1.5"/></svg></div>
            <CardTitle className="text-base font-semibold text-gray-800">Active Membership Count</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {(() => {
              const { count, isLoading: countLoading, error: countError } = useActiveMembershipCount();
              if (countLoading) {
                return <div className="text-[32px] font-bold text-brand-600">Loading...</div>;
              } else if (countError) {
                return <div className="text-[32px] font-bold text-danger-500">Error</div>;
              } else {
                return (
                  <div className="text-[32px] font-bold text-brand-600">
                    {count !== null ? count.toLocaleString() : '—'}
                  </div>
                );
              }
            })()}
            <p className="text-xs text-gray-400 mt-1">All active members across tiers</p>
          </CardContent>
        </Card>
        {/* 30-Day Membership Revenue Forecast */}
        <Card className="col-span-12 md:col-span-3 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-6">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1"><svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#A78BFA" strokeWidth="2"/><path d="M8 18l6-8 6 8" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
            <CardTitle className="text-base font-semibold text-gray-800">30-Day Membership Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {(() => {
              const { forecast, isLoading: forecastLoading, error: forecastError } = useMembershipRevenueForecast();
              if (forecastLoading) {
                return <div className="text-[32px] font-bold text-brand-600">Loading...</div>;
              } else if (forecastError) {
                return <div className="text-[32px] font-bold text-danger-500">Error</div>;
              } else {
                return (
                  <div className="text-[32px] font-bold text-brand-600">
                    {forecast !== null ? `$${forecast.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                  </div>
                );
              }
            })()}
            <p className="text-xs text-gray-400 mt-1">Next 30 days, all active members</p>
          </CardContent>
        </Card>
        {/* Projected Cash Surplus/Deficit */}
        <Card className="col-span-12 md:col-span-3 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-6">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1"><svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#A78BFA" strokeWidth="2"/><path d="M8 18l6-8 6 8" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
            <CardTitle className="text-base font-semibold text-gray-800">Projected Cash Surplus/Deficit</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {(() => {
              const { net, inflows, outflows, isLoading: projLoading, error: projError } = useProjectedSurplusDeficit();
              if (projLoading) {
                return <div className="text-[32px] font-bold text-brand-600">Loading...</div>;
              } else if (projError) {
                return <div className="text-[32px] font-bold text-danger-500">Error</div>;
              } else {
                const isSurplus = net !== null && net >= 0;
                return (
                  <div className={`text-[32px] font-bold ${isSurplus ? 'text-success-500' : 'text-danger-500'}`}>{net !== null ? `${isSurplus ? '+' : '-'}$${Math.abs(net).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}</div>
                );
              }
            })()}
            <p className="text-xs text-gray-400 mt-1">Next 7 days: inflows vs outflows</p>
          </CardContent>
        </Card>
      </div>

      {/* Tomorrow's Flows Sub-strip */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        {/* Tomorrow's Inflows */}
        <Card className="col-span-12 md:col-span-6 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-4">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1"><svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="11" stroke="#A78BFA" strokeWidth="2"/><path d="M8 12l4 4 4-4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
            <CardTitle className="text-base font-semibold text-gray-800">Tomorrow's Inflows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {inflowsLoading ? (
              <div className="text-[28px] font-semibold text-success-500">Loading...</div>
            ) : inflowsError ? (
              <div className="text-[28px] font-semibold text-danger-500">Error</div>
            ) : (
              <div className="text-[28px] font-semibold text-success-500">
                {tomorrowTotal !== null ? `$${tomorrowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Expected inflows for tomorrow</p>
          </CardContent>
        </Card>
        {/* Tomorrow's Outflows */}
        <Card className="col-span-12 md:col-span-6 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-4">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1"><svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="11" stroke="#A78BFA" strokeWidth="2"/><path d="M8 12l4 4 4-4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" transform="rotate(180 12 12)"/></svg></div>
            <CardTitle className="text-base font-semibold text-gray-800">Tomorrow's Outflows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {outflowsLoading ? (
              <div className="text-[28px] font-semibold text-danger-500">Loading...</div>
            ) : outflowsError ? (
              <div className="text-[28px] font-semibold text-danger-500">Error</div>
            ) : (
              <div className="text-[28px] font-semibold text-danger-500">
                {outTomorrow !== null ? `$${outTomorrow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Expected outflows for tomorrow</p>
          </CardContent>
        </Card>
      </div>

      {/* Trends Row */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        {/* 7-Day Cash Trend Chart */}
        <Card className="col-span-12 md:col-span-6 bg-white border border-[#E5E7EB] shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] rounded-t-lg">
            <CardTitle className="text-base font-semibold text-white">7-Day Cash Trend</CardTitle>
            {/* Chart controls placeholder */}
            <div className="text-xs text-white font-medium">Inflows vs Outflows</div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Chart with hover-to-drill */}
            {/* Replace with your actual chart component and tooltip logic */}
            {(() => {
              const { recentNet, priorNet, percentChange, isLoading: trendLoading, error: trendError } = useCashTrend();
              if (trendLoading) {
                return <div className="text-2xl font-bold text-brand-600">Loading...</div>;
              } else if (trendError) {
                return <div className="text-2xl font-bold text-danger-500">Error</div>;
              } else {
                // Chart logic goes here
                return <div className="h-[200px] flex items-center justify-center text-gray-400">[Chart Placeholder]</div>;
              }
            })()}
          </CardContent>
        </Card>
        {/* Cash Flow Waterfall Chart */}
        <Card className="col-span-12 md:col-span-6 bg-white border border-[#E5E7EB] shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] rounded-t-lg">
            <CardTitle className="text-base font-semibold text-white">Cash Flow Waterfall</CardTitle>
            {/* Chart controls placeholder */}
            <div className="text-xs text-white font-medium">Toggle</div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Chart with hover-to-drill */}
            {/* Replace with your actual WaterfallChart component and tooltip logic */}
            {(() => {
              const { data, isLoading, error } = useCashFlowWaterfallData();
              if (isLoading) {
                return <div className="text-2xl font-bold text-brand-600">Loading...</div>;
              } else if (error) {
                return <div className="text-2xl font-bold text-danger-500">Error</div>;
              } else {
                return <div className="h-[200px] flex items-center justify-center text-gray-400">[Waterfall Chart Placeholder]</div>;
              }
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Drill-down Tables Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Upcoming Flows Table */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-white border border-[#E5E7EB] shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#EC4899]">
              <span className="text-base font-semibold text-white">Upcoming Flows</span>
              {/* Collapse/expand icon placeholder */}
              <span className="text-white">▼</span>
            </div>
            <div className="p-4">
              {/* Collapsible panel, default expanded on desktop */}
              {(() => {
                const { data, isLoading, error } = useUpcomingFlowsTableData();
                if (isLoading) {
                  return <div className="h-[180px] flex items-center justify-center text-brand-600">Loading...</div>;
                } else if (error) {
                  return <div className="h-[180px] flex items-center justify-center text-danger-500">Error</div>;
                } else if (!data || data.length === 0) {
                  return <div className="h-[180px] flex items-center justify-center text-gray-400">No data</div>;
                } else {
                  return <UpcomingFlowsTable data={data} />;
                }
              })()}
            </div>
          </div>
        </div>
        {/* Top 5 Expected Inflows Table */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white border border-[#E5E7EB] shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#EC4899]">
              <span className="text-base font-semibold text-white">Top 5 Expected Inflows</span>
              <span className="text-white">▼</span>
            </div>
            <div className="p-4">
              {(() => {
                const { inflows, isLoading, error } = useTopUpcomingFlows();
                if (isLoading) {
                  return <div className="h-[180px] flex items-center justify-center text-brand-600">Loading...</div>;
                } else if (error) {
                  return <div className="h-[180px] flex items-center justify-center text-danger-500">Error</div>;
                } else if (!inflows || inflows.length === 0) {
                  return <div className="h-[180px] flex items-center justify-center text-gray-400">No data</div>;
                } else {
                  return <TopFlowsTable data={inflows} type="inflow" />;
                }
              })()}
            </div>
          </div>
        </div>
        {/* Top 5 Upcoming Outflows Table */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white border border-[#E5E7EB] shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#EC4899]">
              <span className="text-base font-semibold text-white">Top 5 Upcoming Outflows</span>
              <span className="text-white">▼</span>
            </div>
            <div className="p-4">
              {(() => {
                const { outflows, isLoading, error } = useTopUpcomingFlows();
                if (isLoading) {
                  return <div className="h-[180px] flex items-center justify-center text-brand-600">Loading...</div>;
                } else if (error) {
                  return <div className="h-[180px] flex items-center justify-center text-danger-500">Error</div>;
                } else if (!outflows || outflows.length === 0) {
                  return <div className="h-[180px] flex items-center justify-center text-gray-400">No data</div>;
                } else {
                  return <TopFlowsTable data={outflows} type="outflow" />;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
