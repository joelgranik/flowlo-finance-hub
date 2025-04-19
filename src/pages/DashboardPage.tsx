import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useBankBalance } from "@/hooks/useBankBalance";
import { useInflowsTotals } from "@/hooks/useInflowsTotals";
import { useOutflowsTotals } from "@/hooks/useOutflowsTotals";
import { useActiveMembershipCount } from "@/hooks/useActiveMembershipCount";
import { useMembershipRevenueForecast } from "@/hooks/useMembershipRevenueForecast";
import { useProjectedSurplusDeficit } from "@/hooks/useProjectedSurplusDeficit";
import { useCashTrend } from "@/hooks/useCashTrend";
import { useCashFlowWaterfallData } from "@/hooks/useCashFlowWaterfallData";
import { useUpcomingFlowsTableData } from "@/hooks/useUpcomingFlowsTableData";
import { useTopUpcomingFlows } from "@/hooks/useTopUpcomingFlows";
import WaterfallChart from "@/components/dashboard/WaterfallChart";
import UpcomingFlowsTable from "@/components/dashboard/UpcomingFlowsTable";
import TopFlowsTable from "@/components/dashboard/TopFlowsTable";

const DashboardPage = () => {
  const { user } = useAuth();

  const { bankBalance, isLoading: bankLoading, error: bankError } = useBankBalance();
  const { tomorrowTotal: inflowTomorrow, next7DaysTotal: inflow7Day, isLoading: inflowsLoading, error: inflowsError } = useInflowsTotals();
  const { tomorrowTotal: outflowTomorrow, next7DaysTotal: outflow7Day, isLoading: outflowsLoading, error: outflowsError } = useOutflowsTotals();

  const { count: memberCount, isLoading: memberLoading, error: memberError } = useActiveMembershipCount();
  const { forecast: membershipForecast, isLoading: forecastLoading, error: forecastError } = useMembershipRevenueForecast();
  const { net: projectedNet, inflows: projectedInflows, outflows: projectedOutflows, isLoading: projLoading, error: projError } = useProjectedSurplusDeficit();

  const { recentNet, priorNet, percentChange, isLoading: trendLoading, error: trendError } = useCashTrend();
  const { data: waterfallData, isLoading: waterfallLoading, error: waterfallError } = useCashFlowWaterfallData();

  const { data: upcomingFlows, isLoading: upcomingLoading, error: upcomingError } = useUpcomingFlowsTableData();
  const { inflows: topInflows, isLoading: topInflowsLoading, error: topInflowsError } = useTopUpcomingFlows();
  const { outflows: topOutflows, isLoading: topOutflowsLoading, error: topOutflowsError } = useTopUpcomingFlows();

  return (
    <div className="bg-[#F9FAFB] min-h-screen w-full p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontFamily: "Inter, IBM Plex Sans, system-ui, sans-serif" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1" style={{ fontWeight: 400 }}>
            Welcome back{user?.email ? `, ${user.email}` : ""}! Here's an overview of your finances.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          {/* Date Range Picker */}
          <div
            className="bg-white border border-[#E5E7EB] rounded-md shadow-md px-4 py-2 flex items-center text-sm font-medium"
            style={{ minWidth: 180 }}
          >
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

      {/* KPI Strip */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        {/* Bank Balance */}
        <Card className="col-span-12 md:col-span-3 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-6">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="28" height="28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M8 14h12M8 18h12M8 10h12"
                  stroke="#EC4899"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">Bank Balance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {bankLoading ? (
              <div className="text-[32px] font-bold text-brand-600">Loading...</div>
            ) : bankError ? (
              <div className="text-[32px] font-bold text-danger-500">Error</div>
            ) : (
              <div className="text-[32px] font-bold text-brand-600">
                {bankBalance !== null
                  ? `$${bankBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '—'}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Latest input from Bank Balance form</p>
          </CardContent>
        </Card>

        {/* Active Membership Count */}
        <Card className="col-span-12 md:col-span-3 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-6">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="28" height="28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M10 18v-2a2 2 0 012-2h4a2 2 0 012 2v2"
                  stroke="#EC4899"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="14" cy="12" r="2" stroke="#A78BFA" strokeWidth="1.5" />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">Active Membership Count</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {memberLoading ? (
              <div className="text-[32px] font-bold text-brand-600">Loading...</div>
            ) : memberError ? (
              <div className="text-[32px] font-bold text-danger-500">Error</div>
            ) : (
              <div className="text-[32px] font-bold text-brand-600">{memberCount ?? '—'}</div>
            )}
            <p className="text-xs text-gray-400 mt-1">All active members across tiers</p>
          </CardContent>
        </Card>

        {/* 30-Day Membership Revenue Forecast */}
        <Card className="col-span-12 md:col-span-3 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-6">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="28" height="28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M8 18l6-8 6 8"
                  stroke="#EC4899"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">30-Day Membership Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {forecastLoading ? (
              <div className="text-[32px] font-bold text-brand-600">Loading...</div>
            ) : forecastError ? (
              <div className="text-[32px] font-bold text-danger-500">Error</div>
            ) : (
              <div className="text-[32px] font-bold text-brand-600">
                {membershipForecast !== null
                  ? `$${membershipForecast.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '—'}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Next 30 days, all active members</p>
          </CardContent>
        </Card>

        {/* Projected Cash Surplus/Deficit */}
        <Card className="col-span-12 md:col-span-3 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-6">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="28" height="28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M8 18l6-8 6 8"
                  stroke="#EC4899"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">Projected Cash Surplus/Deficit</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {projLoading ? (
              <div className="text-[32px] font-bold text-brand-600">Loading...</div>
            ) : projError ? (
              <div className="text-[32px] font-bold text-danger-500">Error</div>
            ) : (
              <div className={`text-[32px] font-bold ${projectedNet !== null && projectedNet >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                {projectedNet !== null
                  ? `${projectedNet >= 0 ? '+' : '-'}$${Math.abs(projectedNet).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '—'}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Next 7 days: inflows vs outflows</p>
          </CardContent>
        </Card>
      </div>

      {/* Tomorrow's Flows Sub-strip */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        <Card className="col-span-12 md:col-span-6 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-4">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="24" height="24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M8 12l4 4 4-4"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">Tomorrow's Inflows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {inflowsLoading ? (
              <div className="text-[28px] font-semibold text-success-500">Loading...</div>
            ) : inflowsError ? (
              <div className="text-[28px] font-semibold text-danger-500">Error</div>
            ) : (
              <div className="text-[28px] font-semibold text-success-500">
                {inflowTomorrow !== null
                  ? `$${inflowTomorrow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '—'}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Expected inflows for tomorrow</p>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-4">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="24" height="24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M8 12l4 4 4-4"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">Tomorrow's Outflows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {outflowsLoading ? (
              <div className="text-[28px] font-semibold text-danger-500">Loading...</div>
            ) : outflowsError ? (
              <div className="text-[28px] font-semibold text-danger-500">Error</div>
            ) : (
              <div className="text-[28px] font-semibold text-danger-500">
                {outflowTomorrow !== null
                  ? `$${outflowTomorrow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '—'}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Expected outflows for tomorrow</p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Waterfall */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        <Card className="col-span-12 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-4">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="24" height="24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M8 12l4 4 4-4"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">Cash Flow Waterfall</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {waterfallLoading ? (
              <div className="text-[28px] font-semibold text-brand-600">Loading...</div>
            ) : waterfallError ? (
              <div className="text-[28px] font-semibold text-danger-500">Error</div>
            ) : (
              <WaterfallChart data={waterfallData} />
            )}
            <p className="text-xs text-gray-400 mt-1">Cash inflows and outflows over time</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Flows */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        <Card className="col-span-12 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-4">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="24" height="24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M8 12l4 4 4-4"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">Upcoming Flows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {upcomingLoading ? (
              <div className="text-[28px] font-semibold text-brand-600">Loading...</div>
            ) : upcomingError ? (
              <div className="text-[28px] font-semibold text-danger-500">Error</div>
            ) : (
              <UpcomingFlowsTable data={upcomingFlows} />
            )}
            <p className="text-xs text-gray-400 mt-1">Scheduled inflows and outflows</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Flows */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        <Card className="col-span-12 bg-white border border-[#E5E7EB] shadow-md rounded-lg flex flex-col items-center py-4">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-1">
              <svg width="24" height="24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#A78BFA" strokeWidth="2" />
                <path
                  d="M8 12l4 4 4-4"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold text-gray-800">Top Flows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {topInflowsLoading || topOutflowsLoading ? (
              <div className="text-[28px] font-semibold text-brand-600">Loading...</div>
            ) : topInflowsError || topOutflowsError ? (
              <div className="text-[28px] font-semibold text-danger-500">Error</div>
            ) : (
              <TopFlowsTable inflows={topInflows} outflows={topOutflows} />
            )}
            <p className="text-xs text-gray-400 mt-1">Largest inflows and outflows</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
