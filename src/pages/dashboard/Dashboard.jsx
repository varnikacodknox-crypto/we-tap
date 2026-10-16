import { useEffect, useState } from 'react';
import StatCard from '../../components/common/StatCard';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import BreakdownPieChart from '../../components/common/BreakdownPieChart';
import LineChart from '../../components/common/LineChart';
import userIcon from '../../assets/images/user-black.svg';
import cardIcon from '../../assets/images/cards_dahsboard.svg';
import tapIcon from '../../assets/images/taps.svg';
import {
  getDashboard,
  getDashboardCards,
  getDashboardChart,
  getDashboardUsers,
} from '../../api/dashboard';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Users'); // 'Users' | 'Cards' | 'Taps'
  const [period, setPeriod] = useState('Daily');
  const [limit, setLimit] = useState('10');
  const [statsResult, setStatsResult] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [chartResult, setChartResult] = useState(null);
  const [chartError, setChartError] = useState(null);
  const [breakdownResult, setBreakdownResult] = useState(null);
  const { accessToken } = useAuth();
  const showToast = useToast();
  const chartQueryKey = JSON.stringify([accessToken, activeTab, period, limit]);
  const stats = statsResult?.token === accessToken ? statsResult.data : null;
  const statsErrorMessage =
    statsError?.token === accessToken ? statsError.message : '';
  const chartPoints =
    chartResult?.queryKey === chartQueryKey ? chartResult.points : [];
  const breakdownItems =
    breakdownResult?.queryKey === chartQueryKey ? breakdownResult.items : null;
  const hasBreakdown = activeTab === 'Users' || activeTab === 'Cards';
  const isLoadingStats = stats === null && !statsErrorMessage;
  const isLoadingChart =
    chartResult?.queryKey !== chartQueryKey && chartError?.queryKey !== chartQueryKey;

  useEffect(() => {
    const controller = new AbortController();

    getDashboard(accessToken, controller.signal)
      .then((data) => {
        setStatsResult({ token: accessToken, data });
        setStatsError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setStatsError({ token: accessToken, message: error.message });
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, showToast]);

  useEffect(() => {
    const controller = new AbortController();

    getDashboardChart(
      accessToken,
      activeTab,
      { type: period.toLowerCase(), limit, text: 'all' },
      controller.signal
    )
      .then((data) => {
        setChartResult({
          queryKey: chartQueryKey,
          points: data[0]?.series || [],
        });
        setChartError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setChartError({ queryKey: chartQueryKey, message: error.message });
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, activeTab, chartQueryKey, limit, period, showToast]);

  useEffect(() => {
    if (activeTab !== 'Users' && activeTab !== 'Cards') return undefined;

    const controller = new AbortController();
    const query = { type: period.toLowerCase(), limit, text: 'all' };
    const fetchBreakdown = activeTab === 'Users' ? getDashboardUsers : getDashboardCards;

    fetchBreakdown(accessToken, query, controller.signal)
      .then((data) => {
        setBreakdownResult({
          queryKey: chartQueryKey,
          items: (activeTab === 'Users' ? data.users : data.cards) || [],
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setBreakdownResult({ queryKey: chartQueryKey, items: [] });
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, activeTab, chartQueryKey, limit, period, showToast]);

  return (
    <div className="wetap-dashboard-page">
      {/* Stat Cards Row */}
      <div className="wetap-stats-grid">
        <StatCard
          title="Total Users"
          value={isLoadingStats ? '—' : stats?.totalActiveUsers ?? '—'}
          icon={userIcon}
          colorVariant="pink"
        />
        <StatCard
          title="Total Cards"
          value={isLoadingStats ? '—' : stats?.totalCards ?? '—'}
          icon={cardIcon}
          colorVariant="blue"
        />
        <StatCard
          title="Total Taps"
          value={isLoadingStats ? '—' : stats?.totalTaps ?? '—'}
          icon={tapIcon}
          colorVariant="peach"
        />
      </div>
      {/* Analytics Chart Container */}
      <div className="wetap-chart-card">
        <div className="wetap-chart-header">
          {/* Tabs */}
          <div className="wetap-tabs-group">
            {['Users', 'Cards', 'Taps'].map((tab) => (
              <button
                key={tab}
                className={`wetap-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="wetap-chart-filters">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="wetap-select-filter"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>

            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="wetap-select-filter"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
        </div>

        {/* SVG Interactive Dynamic Chart */}
        <div className="wetap-chart-body">
          {isLoadingChart && <LoadingIndicator label="Loading chart" />}
          <div className="wetap-chart-panels">
            <div className="wetap-svg-chart-container">
              {!isLoadingChart && chartPoints.length === 0 ? (
                <p className="wetap-pie-empty">No data</p>
              ) : (
                <LineChart points={chartPoints} axisLabel={period.toLowerCase()} />
              )}
            </div>
            {hasBreakdown && (
              <div className="wetap-pie-chart-container">
                {breakdownItems ? (
                  <BreakdownPieChart items={breakdownItems} />
                ) : (
                  <LoadingIndicator label={`Loading ${activeTab.toLowerCase()} breakdown`} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
