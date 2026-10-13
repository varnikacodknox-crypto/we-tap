import React, { useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import { mockCardRequests } from '../../data/mockData';

export const RequestCardList = () => {
  const [activeTab, setActiveTab] = useState('requested'); // 'requested' | 'form'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showEmptyState, setShowEmptyState] = useState(true); // Matches screenshot 1 (No Records Found default)

  // Form states for Request Card tab
  const [cardId, setCardId] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filteredRequests = showEmptyState
    ? []
    : mockCardRequests.filter((req) => {
      const matchesSearch =
        req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || req.status.toLowerCase() === statusFilter.toLowerCase();

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
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="font-semibold">{req.requestedBy}</td>
                      <td>{req.requestedBy.toLowerCase().replace(" ", ".")}@gmail.com</td>
                      <td>{req.requestDate}</td>
                      <td>
                        <span className={`wetap-status-badge ${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>

            {filteredRequests.length === 0 && (
              <EmptyState />
            )}
          </div>
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
