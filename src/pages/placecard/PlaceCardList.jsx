import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { createOrder, getOrders } from '../../api/orders';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

export const PlaceCardList = () => {
  const [activeTab, setActiveTab] = useState('placed'); // 'placed' | 'new'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ordersResult, setOrdersResult] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [ordersRefreshKey, setOrdersRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const { accessToken } = useAuth();
  const showToast = useToast();
  const orders = ordersResult?.token === accessToken ? ordersResult.data : null;
  const ordersErrorMessage =
    ordersError?.token === accessToken ? ordersError.message : '';
  const isLoadingOrders = activeTab === 'placed' && !orders && !ordersErrorMessage;

  // Form states for "Place A New Card"
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    cardType: 'Standard',
    deliveryAddress: '',
  });
  useEffect(() => {
    const controller = new AbortController();

    getOrders(accessToken, { limit: 5, offset: 0 }, controller.signal)
      .then((data) => {
        setOrdersResult({ token: accessToken, data });
        setOrdersError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setOrdersError({ token: accessToken, message: error.message });
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, ordersRefreshKey, showToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess('');
    setIsSubmitting(true);

    try {
      await createOrder(accessToken, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        cardType: formData.cardType,
        address: formData.deliveryAddress,
      });
      setFormSuccess('Card order placed successfully!');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        cardType: 'Standard',
        deliveryAddress: '',
      });
      setOrdersError(null);
      setActiveTab('placed');
      setOrdersRefreshKey((key) => key + 1);
    } catch (error) {
      showToast(error.message || 'Unable to place the card order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCards = (orders?.orderList || []).filter((card) => {
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
          onClick={() => {
            setFormSuccess('');
            setActiveTab('new');
          }}
        >
          Place New Card
        </button>
      </div>

      {/* TAB 1: Placed Cards */}
      {activeTab === 'placed' && (
        <div key="placed" className="wetap-page-transition">
          {formSuccess && (
            <div className="wetap-alert-success text-center mb-4 w-full">
              {formSuccess}
            </div>
          )}
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
                  <th>Mobile No.</th>
                  <th>Card Type</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!isLoadingOrders && !ordersErrorMessage && filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <tr key={card.orderId}>
                      <td className="font-semibold">{card.name}</td>
                      <td>{card.email}</td>
                      <td>{card.mobile}</td>
                      <td>{card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}</td>
                      <td>{card.address}</td>
                      <td>{card.creationDate?.slice(0, 10) || ''}</td>
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

            {isLoadingOrders && (
              <LoadingIndicator label="Loading placed cards" />
            )}
            {!isLoadingOrders && !ordersErrorMessage && filteredCards.length === 0 && (
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

              <form onSubmit={handleFormSubmit} className="wetap-request-form">
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
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
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
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
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="wetap-form-input"
                    required
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Card Type</label>
                  <select
                    name="cardType"
                    value={formData.cardType}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="wetap-form-input wetap-form-select"
                  >
                    <option value="Standard">Standard</option>
                    <option value="pvcCustom">Pvc Custom</option>
                    <option value="metalCustom">Metal Custom</option>
                  </select>
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Delivery Address (Optional)</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    placeholder="Enter Delivery Address"
                    value={formData.deliveryAddress}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-form-submit-wrapper mt-6">
                  <button type="submit" className="wetap-gradient-btn px-8" disabled={isSubmitting}>
                    {isSubmitting ? 'PLACING ORDER...' : 'Request New Card'}
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
