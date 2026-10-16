import { useState } from 'react';
import { BadgeCheck, CreditCard, MousePointerClick, UserCheck, Users, UserX } from 'lucide-react';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import BarChart from '../../components/v2/BarChart';
import DonutChart from '../../components/v2/DonutChart';
import TablePagination from '../../components/v2/TablePagination';
import useApiData from '../../components/v2/useApiData';
import { getDashboard, getDashboardChart, getDashboardUsers } from '../../api/dashboard';
import { getUsers } from '../../api/users';
import { getPhysicalCards } from '../../api/cards';
import { useAuth } from '../../context/useAuth';
import '../../styles/v2.css';

const CHART_POINTS = 10;
const DEFAULT_PAGE_SIZE = 10;
const PERIODS = ['Daily', 'Weekly', 'Monthly'];

const TABS = [
  { key: 'users', label: 'Users', chartMetric: 'Users', chartTitle: 'User Growth', xAxis: 'Users joined per period' },
  { key: 'subscriptions', label: 'Subscriptions', chartTitle: 'Subscription Status', xAxis: 'Status' },
  { key: 'cards', label: 'Cards', chartMetric: 'Taps', chartTitle: 'Card Taps', xAxis: 'Taps per period' },
];

const COLORS = { active: '#d946ef', inactive: '#f43f5e', subscription: '#8b5cf6' };

const findCount = (items, name) =>
  items?.find((item) => item.name.toLowerCase() === name)?.value;

const formatCount = (value) => (Number.isFinite(value) ? value.toLocaleString() : '—');

const formatDate = (item) => {
  if (item.creationDate) return item.creationDate.slice(0, 10);
  if (item.insertDate) return new Date(item.insertDate * 1000).toISOString().slice(0, 10);
  return '';
};

// The card list shape isn't confirmed yet, so read the likely field names with fallbacks (same as CardsList).
const getCardName = (card) => card.name || card.userName || card.userDetails?.name || '';
const getCardEmail = (card) => card.email || card.userDetails?.email || '';
const getCardId = (card) => card.cardId || card.cardNumber || card._id || '';

const StatusBadge = ({ status = '' }) => (
  <span className={`wtv2-badge ${status.toLowerCase() === 'active' ? 'green' : 'red'}`}>{status}</span>
);

const KpiCard = ({ icon: Icon, label, value, tone }) => (
  <div className={`wtv2-kpi ${tone}`}>
    <div className="wtv2-kpi-icon"><Icon size={18} /></div>
    <p className="wtv2-kpi-label">{label}</p>
    <p className="wtv2-kpi-value">{value}</p>
  </div>
);

export const OrgDashboard = () => {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [period, setPeriod] = useState('Daily');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState('');
  const tab = TABS.find((item) => item.key === activeTab);
  const type = period.toLowerCase();

  const stats = useApiData(`stats|${accessToken}`, (signal) => getDashboard(accessToken, signal));
  const breakdown = useApiData(`breakdown|${accessToken}|${type}`, (signal) =>
    getDashboardUsers(accessToken, { type, limit: CHART_POINTS, text: 'all' }, signal)
  );
  const chart = useApiData(
    tab.chartMetric ? `chart|${accessToken}|${tab.chartMetric}|${type}` : null,
    (signal) =>
      getDashboardChart(accessToken, tab.chartMetric, { type, limit: CHART_POINTS, text: 'all' }, signal)
  );
  const listsCards = activeTab === 'cards';
  const table = useApiData(
    `table|${accessToken}|${listsCards ? 'cards' : 'users'}|${page}|${pageSize}`,
    (signal) => {
      const fetchList = listsCards ? getPhysicalCards : getUsers;
      return fetchList(accessToken, { limit: pageSize, offset: page * pageSize }, signal);
    }
  );

  const userItems = breakdown.data?.users;
  const activeUsers = findCount(userItems, 'active');
  const inactiveUsers = findCount(userItems, 'inactive');
  const subscribedUsers = findCount(userItems, 'subscription');

  const chartItems = tab.chartMetric
    ? (chart.data?.[0]?.series || []).map((point) => ({
        label: String(point.name),
        value: Number(point.value) || 0,
      }))
    : [
        { label: 'Active', value: activeUsers ?? 0 },
        { label: 'Inactive', value: inactiveUsers ?? 0 },
        { label: 'Subscribed', value: subscribedUsers ?? 0 },
      ];
  const chartTotal = chartItems.reduce((sum, item) => sum + item.value, 0);
  const chartBadge = {
    users: `New Users: ${chartTotal.toLocaleString()}`,
    subscriptions: `${formatCount(subscribedUsers)} Active Subscriptions`,
    cards: `Total Taps: ${chartTotal.toLocaleString()}`,
  }[activeTab];

  const rows = (listsCards ? table.data?.cardList : table.data?.users) || [];
  const search = searchTerm.trim().toLowerCase();
  const filteredRows = rows.filter((row) =>
    (listsCards
      ? [getCardName(row), getCardEmail(row), getCardId(row)]
      : [row.name, row.email, row.userName]
    ).some((value) => String(value || '').toLowerCase().includes(search))
  );

  const switchTab = (key) => {
    setActiveTab(key);
    setPage(0);
    setSearchTerm('');
  };

  const changePageSize = (size) => {
    setPageSize(size);
    setPage(0);
  };

  const isLoading = stats.isLoading || breakdown.isLoading || chart.isLoading || table.isLoading;

  return (
    <div className="wtv2-page">
      {isLoading && <LoadingIndicator label="Loading dashboard" />}

      {/* KPI row */}
      <section className="wtv2-kpi-grid">
        <KpiCard icon={Users} label="Total Users" value={formatCount(stats.data?.totalActiveUsers)} tone="pink" />
        <KpiCard icon={UserCheck} label="Active Users" value={formatCount(activeUsers)} tone="green" />
        <KpiCard icon={UserX} label="Non-Active Users" value={formatCount(inactiveUsers)} tone="rose" />
        <KpiCard icon={BadgeCheck} label="Active Subscriptions" value={formatCount(subscribedUsers)} tone="violet" />
        <KpiCard icon={CreditCard} label="Total Cards" value={formatCount(stats.data?.totalCards)} tone="amber" />
        <KpiCard icon={MousePointerClick} label="Total Card Taps" value={formatCount(stats.data?.totalTaps)} tone="sky" />
      </section>

      {/* Tabs */}
      <section>
        <div className="wtv2-tabs" role="tablist">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={item.key === activeTab}
              className={`wtv2-tab ${item.key === activeTab ? 'active' : ''}`}
              onClick={() => switchTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="wtv2-panel">
          {/* Chart + donut */}
          <div className="wtv2-charts-row">
            <div className="wtv2-chart">
              <div className="wtv2-chart-head">
                <h3>{tab.chartTitle}</h3>
                <div className="wtv2-chart-tools">
                  <span className="wtv2-chart-badge">{chartBadge}</span>
                  <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    className="wtv2-select"
                    aria-label="Time period"
                  >
                    {PERIODS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <BarChart
                items={chartItems}
                variant={activeTab === 'subscriptions' ? 'green' : 'purple'}
                emptyText={chart.isLoading ? '' : 'No data'}
              />
              <p className="wtv2-chart-axis">{tab.xAxis}</p>
            </div>

            <DonutChart
              title="User Status"
              centerValue={formatCount((activeUsers ?? 0) + (inactiveUsers ?? 0))}
              centerLabel="Total Users"
              segments={[
                { label: 'Active', value: activeUsers ?? 0, color: COLORS.active },
                { label: 'Inactive', value: inactiveUsers ?? 0, color: COLORS.inactive },
              ]}
              legend={[
                { label: 'Active Users', value: formatCount(activeUsers), color: COLORS.active },
                { label: 'Non-Active Users', value: formatCount(inactiveUsers), color: COLORS.inactive },
                { label: 'Active Subscriptions', value: formatCount(subscribedUsers), color: COLORS.subscription },
              ]}
            />
          </div>

          {/* Table */}
          <div className="wtv2-table-section">
            <div className="wtv2-table-head">
              <h3>{{ users: 'Organization Users', subscriptions: 'Subscriptions', cards: 'Physical Cards' }[activeTab]}</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={listsCards ? 'Search name, email, card ID...' : 'Search name, email, username...'}
                className="wtv2-search"
              />
            </div>

            <div className="wtv2-table-wrap">
              <table className="wtv2-table">
                <thead>
                  {activeTab === 'users' && (
                    <tr><th>#</th><th>Name</th><th>Username</th><th>Email</th><th>Joined</th><th className="right">Status</th></tr>
                  )}
                  {activeTab === 'subscriptions' && (
                    <tr><th>Name</th><th>Email</th><th>Plan</th><th>Joined</th><th className="right">Subscription</th></tr>
                  )}
                  {activeTab === 'cards' && (
                    <tr><th>Card ID</th><th>Name</th><th>Email</th><th>Created</th><th className="right">Status</th></tr>
                  )}
                </thead>
                <tbody>
                  {activeTab === 'users' &&
                    filteredRows.map((user, index) => (
                      <tr key={user.userId || index}>
                        <td className="muted mono">{page * pageSize + rows.indexOf(user) + 1}</td>
                        <td className="strong">{user.name}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{formatDate(user)}</td>
                        <td className="right"><StatusBadge status={user.status} /></td>
                      </tr>
                    ))}
                  {activeTab === 'subscriptions' &&
                    filteredRows.map((user, index) => (
                      <tr key={user.userId || index}>
                        <td className="strong">{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.planType}</td>
                        <td>{formatDate(user)}</td>
                        <td className="right">
                          <span className={`wtv2-badge ${user.isPremiumUser ? 'green' : 'gray'}`}>
                            {user.isPremiumUser ? 'Subscription' : 'Non-Subscription'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {activeTab === 'cards' &&
                    filteredRows.map((card, index) => (
                      <tr key={getCardId(card) || index}>
                        <td className="mono strong">{getCardId(card)}</td>
                        <td className="strong">{getCardName(card)}</td>
                        <td>{getCardEmail(card)}</td>
                        <td>{formatDate(card)}</td>
                        <td className="right"><StatusBadge status={card.status} /></td>
                      </tr>
                    ))}
                  {!table.isLoading && filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="wtv2-table-empty">
                        {table.error || (search ? 'No matches on this page.' : 'No records found.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              page={page}
              pageSize={pageSize}
              totalCount={table.data?.totalCount}
              itemCount={rows.length}
              onPageChange={setPage}
              onPageSizeChange={changePageSize}
              disabled={table.isLoading}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrgDashboard;
