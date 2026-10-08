import React, { useState } from 'react';
import StatCard from '../../components/common/StatCard';
import userIcon from '../../assets/images/user-black.svg';
import cardIcon from '../../assets/images/cards_dahsboard.svg';
import tapIcon from '../../assets/images/taps.svg';
import { mockStats, mockChartData } from '../../data/mockData';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Cards'); // 'Users' | 'Cards' | 'Taps'
  const [period, setPeriod] = useState('Daily');
  const [limit, setLimit] = useState('10');
  const [showZeroData, setShowZeroData] = useState(true); // Default to match screenshot 3 (0 count)

  const stats = showZeroData
    ? { totalUsers: 0, totalCards: 0, totalTaps: 0 }
    : mockStats;

  const currentChartPoints = showZeroData
    ? mockChartData.daily.map(d => ({ ...d, users: 0, cards: 0, taps: 0 }))
    : mockChartData[period.toLowerCase()] || mockChartData.daily;

  const dates = currentChartPoints.map(d => d.date);
  const dataValues = currentChartPoints.map(d => {
    if (activeTab === 'Users') return d.users;
    if (activeTab === 'Cards') return d.cards;
    return d.taps;
  });

  const maxValue = Math.max(...dataValues, 10);

  return (
    <div className="wetap-dashboard-page">
      {/* Demo State Switcher Toggle */}
      {/* <div className="wetap-demo-toggle-bar">
        <label className="wetap-toggle-label">
          <input
            type="checkbox"
            checked={!showZeroData}
            onChange={(e) => setShowZeroData(!e.target.checked)}
          />
          <span>Show Live Demo Data (Toggle between 0 state & populated analytics)</span>
        </label>
      </div> */}

      {/* Stat Cards Row */}
      <div className="wetap-stats-grid">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={userIcon}
          colorVariant="pink"
        />
        <StatCard
          title="Total Cards"
          value={stats.totalCards}
          icon={cardIcon}
          colorVariant="blue"
        />
        <StatCard
          title="Total Taps"
          value={stats.totalTaps}
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
              {(() => {
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
    </div>
  );
};

export default Dashboard;
