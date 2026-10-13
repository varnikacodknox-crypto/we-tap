import { useEffect, useState } from 'react';
import StatCard from '../../components/common/StatCard';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import userIcon from '../../assets/images/user-black.svg';
import cardIcon from '../../assets/images/cards_dahsboard.svg';
import tapIcon from '../../assets/images/taps.svg';
import { getDashboard, getDashboardChart } from '../../api/dashboard';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Cards'); // 'Users' | 'Cards' | 'Taps'
  const [period, setPeriod] = useState('Daily');
  const [limit, setLimit] = useState('10');
  const [statsResult, setStatsResult] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [chartResult, setChartResult] = useState(null);
  const [chartError, setChartError] = useState(null);
  const { accessToken } = useAuth();
  const showToast = useToast();
  const chartQueryKey = JSON.stringify([accessToken, activeTab, period, limit]);
  const stats = statsResult?.token === accessToken ? statsResult.data : null;
  const statsErrorMessage =
    statsError?.token === accessToken ? statsError.message : '';
  const chartPoints =
    chartResult?.queryKey === chartQueryKey ? chartResult.points : [];
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

  const dates = chartPoints.map((point) => point.name);
  const dataValues = chartPoints.map((point) => point.value);

  const maxValue = Math.max(...dataValues, 10);

  // Show at most ~10 x-axis labels so dates don't overlap at higher limits.
  const MAX_X_LABELS = 10;
  const labelStep = Math.max(1, Math.ceil(dates.length / MAX_X_LABELS));

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
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* SVG Interactive Dynamic Chart */}
        <div className="wetap-chart-body">
          {isLoadingChart && <LoadingIndicator label="Loading chart" />}
          <div className="wetap-svg-chart-container">
            <svg viewBox="0 0 900 320" className="wetap-analytics-svg">
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d946ef" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid vertical guide lines */}
              {dates.map((date, idx) => {
                const x = 70 + (idx * (780 / (dates.length - 1 || 1)));
                return (
                  <line
                    key={idx}
                    x1={x}
                    y1={40}
                    x2={x}
                    y2={240}
                    stroke="#eee"
                    strokeDasharray="2,2"
                  />
                );
              })}

              {/* Horizontal baseline line & 0 marker */}
              <line x1="50" y1="240" x2="860" y2="240" stroke="#ddd" strokeWidth="1" />
              <text x="35" y="244" fontSize="12" fill="#777" textAnchor="end">0</text>

              {/* Data Trend Line */}
              {!isLoadingChart && chartPoints.length > 0 && (() => {
                const points = dataValues.map((val, idx) => {
                  const x = 70 + (idx * (780 / (dates.length - 1 || 1)));
                  const y = 240 - (val / maxValue) * 180;
                  return `${x},${y}`;
                });
                const pathD = `M ${points.join(' L ')}`;
                const areaD = `M 70,240 L ${points.join(' L ')} L ${70 + (dates.length - 1) * (780 / (dates.length - 1 || 1))},240 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#purpleGradient)" />
                    <path d={pathD} fill="none" stroke="#cf62eb" strokeWidth="2.5" />
                    {points.map((pt, idx) => {
                      const [px, py] = pt.split(',');
                      return (
                        <g key={idx} className="chart-point-group">
                          <title>{`${dates[idx]}: ${dataValues[idx]}`}</title>
                          <circle cx={px} cy={py} r="4" fill="#d946ef" stroke="#fff" strokeWidth="2" />
                          {dataValues[idx] > 0 && (
                            <text x={px} y={parseFloat(py) - 10} fontSize="11" fill="#444" textAnchor="middle" fontWeight="bold">
                              {dataValues[idx]}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </>
                );
              })()}

              {/* X Axis Labels */}
              {dates.map((date, idx) => {
                if (idx % labelStep !== 0) return null;
                const x = 70 + (idx * (780 / (dates.length - 1 || 1)));
                return (
                  <text
                    key={idx}
                    x={x}
                    y={270}
                    fontSize="11"
                    fill="#333"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {date}
                  </text>
                );
              })}

              {/* Axis Label */}
              <text x="450" y="295" fontSize="12" fill="#666" textAnchor="middle">
                {period.toLowerCase()}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
