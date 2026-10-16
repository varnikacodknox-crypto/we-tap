import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import Pagination, { PAGE_SIZE } from '../../components/common/Pagination';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { getRequestedCards } from '../../api/cards';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

// The request list shape isn't confirmed yet, so read the likely field names with fallbacks.
const getRequestName = (request) =>
  request.name || request.userName || request.userDetails?.name || '';
const getRequestEmail = (request) => request.email || request.userDetails?.email || '';
const getRequestStatus = (request) => request.status || '';
const getRequestId = (request) => request.requestId || request.cardId || request._id || '';
const getRequestDate = (request) => {
  if (request.creationDate) return request.creationDate.slice(0, 10);
  if (request.insertDate) return new Date(request.insertDate * 1000).toISOString().slice(0, 10);
  return '';
};

export const RequestCardList = () => {
  const [activeTab, setActiveTab] = useState('requested'); // 'requested' | 'form'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [requestsResult, setRequestsResult] = useState(null);
  const [page, setPage] = useState(0);
  const [requestsError, setRequestsError] = useState(null);
  const { accessToken } = useAuth();
  const showToast = useToast();
  const queryKey = `${accessToken}|${page}`;
  const requests =
    requestsResult?.queryKey === queryKey ? requestsResult.data.cardRequestList || [] : [];
  const requestsErrorMessage =
    requestsError?.queryKey === queryKey ? requestsError.message : '';
  const isLoadingRequests =
    requestsResult?.queryKey !== queryKey && !requestsErrorMessage;

  // Form states for Request Card tab
  const [cardId, setCardId] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getRequestedCards(accessToken, { limit: PAGE_SIZE, offset: page * PAGE_SIZE }, controller.signal)
      .then((data) => {
        setRequestsResult({ queryKey, data });
        setRequestsError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setRequestsError({ queryKey, message: error.message });
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, page, queryKey, showToast]);

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      getRequestName(request).toLowerCase().includes(normalizedSearch) ||
      getRequestEmail(request).toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === 'All' ||
      getRequestStatus(request).toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="wetap-page-container">
      {/* Top Sub-Navigation Tabs */}
      <div className="wetap-request-tabs">
        <button
          className={`wetap-request-tab ${activeTab === 'requested' ? 'active' : ''}`}
          onClick={() => setActiveTab('requested')}
        >
          Requested Cards
        </button>
        <button
          className={`wetap-request-tab ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Request Card
        </button>
      </div>

      {/* TAB 1: Requested Cards List */}
      {activeTab === 'requested' && (
        <div key="requested" className="wetap-page-transition">
          {/* Search and Filter Bar */}
          <div className="wetap-filter-bar">
            <div className="wetap-filter-inputs">
              <input
                type="text"
                placeholder="Email/Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="wetap-search-input"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="wetap-dropdown-filter"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="wetap-table-wrapper">
            <table className="wetap-data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!isLoadingRequests && !requestsErrorMessage && filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <tr key={getRequestId(request) || index}>
                      <td className="font-semibold">{getRequestName(request)}</td>
                      <td>{getRequestEmail(request)}</td>
                      <td>{getRequestDate(request)}</td>
                      <td>
                        <span className={`wetap-status-badge ${getRequestStatus(request).toLowerCase()}`}>
                          {getRequestStatus(request)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>

            {isLoadingRequests && <LoadingIndicator label="Loading requested cards" />}
            {!isLoadingRequests && !requestsErrorMessage && filteredRequests.length === 0 && (
              <EmptyState />
            )}
          </div>

          <Pagination
            page={page}
            totalCount={requestsResult?.queryKey === queryKey ? requestsResult.data.totalCount : undefined}
            itemCount={requests.length}
            onPageChange={setPage}
            disabled={isLoadingRequests}
          />
        </div>
      )}

      {/* TAB 2: Request Card Access Form */}
      {activeTab === 'form' && (
        <div key="form" className="wetap-page-transition">
          <div className="wetap-request-form-wrapper">
            <div className="wetap-request-card-box">
              <h3 className="wetap-request-box-title">Request Card Access</h3>
              <p className="wetap-request-box-subtitle">
                Request a card access from the Wetap Admin
              </p>

              {submitted && (
                <div className="wetap-alert-success text-center mb-4">
                  Card access request submitted successfully!
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="wetap-request-form">
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Card ID</label>
                  <input
                    type="text"
                    placeholder="Enter Card ID"
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-or-divider">or</div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Email</label>
                  <input
                    type="email"
                    placeholder="Enter Registered Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-form-submit-wrapper mt-4">
                  <button type="submit" className="wetap-gradient-btn px-8">
                    Request Card Access
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCardList;
