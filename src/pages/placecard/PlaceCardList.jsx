import React, { useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import { mockPlacedCardsTable } from '../../data/mockData';

export const PlaceCardList = () => {
  const [activeTab, setActiveTab] = useState('placed'); // 'placed' | 'new'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showEmptyState, setShowEmptyState] = useState(true); // Default empty state matching Screenshot 1

  // Form states for "Place A New Card"
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    cardType: 'Standard',
    deliveryAddress: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        cardType: 'Standard',
        deliveryAddress: '',
      });
    }, 3000);
  };

  const filteredCards = showEmptyState
    ? []
    : (mockPlacedCardsTable || []).filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.mobile.includes(searchTerm);

      const matchesStatus =
        statusFilter === 'All' ||
        card.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

  return (
    <div className="wetap-page-container">
      {/* Sub-Navigation Tabs */}
      <div className="wetap-request-tabs">
        <button
          className={`wetap-request-tab ${activeTab === 'placed' ? 'active' : ''}`}
          onClick={() => setActiveTab('placed')}
        >
          Placed Cards
        </button>
        <button
          className={`wetap-request-tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          Place New Card
        </button>
      </div>

      {/* TAB 1: Placed Cards */}
      {activeTab === 'placed' && (
        <div key="placed" className="wetap-page-transition">
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
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
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
                  <th>Mobile No.</th>
                  <th>Card Type</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <tr key={card.id}>
                      <td className="font-semibold">{card.name}</td>
                      <td>{card.email}</td>
                      <td>{card.mobile}</td>
                      <td>{card.cardType}</td>
                      <td>{card.address}</td>
                      <td>{card.date}</td>
                      <td>
                        <span className={`wetap-status-badge ${card.status.toLowerCase()}`}>
                          {card.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>

            {filteredCards.length === 0 && (
              <EmptyState />
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Place New Card Form */}
      {activeTab === 'new' && (
        <div key="new" className="wetap-page-transition">
          <div className="wetap-request-form-wrapper">
            <div className="wetap-request-card-box">
              <h3 className="wetap-request-box-title mb-6">Place A New Card</h3>

              {submitted && (
                <div className="wetap-alert-success text-center mb-4 w-full">
                  New card request submitted successfully!
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="wetap-request-form">
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="wetap-form-input"
                    required
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="wetap-form-input"
                    required
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Enter Mobile Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="wetap-form-input"
                    required
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Card Type</label>
                  <select
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleInputChange}
                    className="wetap-form-input wetap-form-select"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Custom Metal Card">Custom Metal Card</option>
                    <option value="Executive Matte Black">Executive Matte Black</option>
                    <option value="Eco Series Card">Eco Series Card</option>
                  </select>
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Delivery Address (Optional)</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    placeholder="Enter Delivery Address"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-form-submit-wrapper mt-6">
                  <button type="submit" className="wetap-gradient-btn px-8">
                    Request New Card
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

export default PlaceCardList;

