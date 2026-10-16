import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import EmptyState from '../../components/common/EmptyState';
import Pagination, { PAGE_SIZE } from '../../components/common/Pagination';
import {
  assignUserSubscription,
  cancelUserSubscription,
  getUsers,
  updateUserStatus,
} from '../../api/users';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { X } from 'lucide-react';
import editUserIcon from '../../assets/images/edit_user.svg';
import userStatusIcon from '../../assets/images/user_status.svg';
import cardIcon from '../../assets/images/card.svg';
import { updateUserDetails } from '../../api/users';
import UserDetailsEditor from './UserDetailsEditor';
import UserCardsView from './UserCardsView';
import LoadingIndicator from '../../components/common/LoadingIndicator';

export const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('All');
  const [usersResult, setUsersResult] = useState(null);
  const [page, setPage] = useState(0);
  const [usersError, setUsersError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingDetailsUser, setEditingDetailsUser] = useState(null);
  const [viewingCardsUser, setViewingCardsUser] = useState(null);
  const [subscriptionUser, setSubscriptionUser] = useState(null);
  const [subscriptionCancellationUser, setSubscriptionCancellationUser] = useState(null);
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [subscriptionStartDate, setSubscriptionStartDate] = useState('');
  const [subscriptionEndDate, setSubscriptionEndDate] = useState('');
  const [isAssigningSubscription, setIsAssigningSubscription] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const { accessToken } = useAuth();
  const showToast = useToast();
  const queryKey = `${accessToken}|${page}`;
  const users = usersResult?.queryKey === queryKey ? usersResult.data.users : [];
  const usersErrorMessage =
    usersError?.queryKey === queryKey ? usersError.message : '';
  const isLoadingUsers =
    usersResult?.queryKey !== queryKey && !usersErrorMessage;

  useEffect(() => {
    const controller = new AbortController();

    getUsers(accessToken, { limit: PAGE_SIZE, offset: page * PAGE_SIZE }, controller.signal)
      .then((data) => {
        setUsersResult({ queryKey, data });
        setUsersError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setUsersError({ queryKey, message: error.message });
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, page, queryKey, showToast]);

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.userName.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === 'All' || user.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSub =
      subFilter === 'All' || user.planType.toLowerCase() === subFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesSub;
  });

  const openStatusEditor = (user) => {
    setEditingUser(user);
    setSelectedStatus('');
    setUpdateSuccess('');
  };

  const closeStatusEditor = () => {
    if (isUpdating) return;
    setEditingUser(null);
    setSelectedStatus('');
  };

  const handleStatusSave = async (event) => {
    event.preventDefault();
    if (!editingUser || !selectedStatus) return;

    setIsUpdating(true);
    setUpdateSuccess('');
    try {
      await updateUserStatus(accessToken, editingUser.userId, selectedStatus);
      setUsersResult((current) => {
        if (current?.queryKey !== queryKey) return current;
        return {
          ...current,
          data: {
            ...current.data,
            users: current.data.users.map((user) =>
              user.userId === editingUser.userId
                ? { ...user, status: selectedStatus }
                : user
            ),
          },
        };
      });
      setUpdateSuccess('User status updated successfully.');
      setEditingUser(null);
      setSelectedStatus('');
    } catch (error) {
      showToast(error.message || 'Unable to update user status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDetailsSave = async (updatedUser) => {
    await updateUserDetails(accessToken, updatedUser);
    setUsersResult((current) => {
      if (current?.queryKey !== queryKey) return current;
      return {
        ...current,
        data: {
          ...current.data,
          users: current.data.users.map((user) =>
            user.userId === updatedUser.userId
              ? { ...user, name: updatedUser.name, email: updatedUser.email }
              : user
          ),
        },
      };
    });
    setEditingDetailsUser(null);
    setUpdateSuccess('User details updated successfully.');
  };

  const handleCardsBack = useCallback(() => {
    setViewingCardsUser(null);
  }, []);

  const openSubscriptionEditor = (user) => {
    setSubscriptionUser(user);
    setSubscriptionStartDate('');
    setSubscriptionEndDate('');
  };

  const closeSubscriptionCancellation = () => {
    if (isCancellingSubscription) return;
    setSubscriptionCancellationUser(null);
  };

  const handleSubscriptionCancellation = async () => {
    if (!subscriptionCancellationUser) return;

    setIsCancellingSubscription(true);
    try {
      await cancelUserSubscription(accessToken, subscriptionCancellationUser.userId);
      setUsersResult((current) => {
        if (current?.queryKey !== queryKey) return current;
        return {
          ...current,
          data: {
            ...current.data,
            users: current.data.users.map((user) =>
              user.userId === subscriptionCancellationUser.userId
                ? { ...user, isPremiumUser: false }
                : user
            ),
          },
        };
      });
      setSubscriptionCancellationUser(null);
      setUpdateSuccess('Subscription cancelled successfully.');
    } catch (error) {
      showToast(error.message || 'Unable to cancel subscription. Please try again.'
      );
    } finally {
      setIsCancellingSubscription(false);
    }
  };

  const closeSubscriptionEditor = () => {
    if (isAssigningSubscription) return;
    setSubscriptionUser(null);
  };

  const handleSubscriptionSave = async (event) => {
    event.preventDefault();
    if (!subscriptionUser || !subscriptionStartDate || !subscriptionEndDate) return;

    const formatDate = (date) => {
      const [year, month, day] = date.split('-');
      return `${month}/${day}/${year}`;
    };

    setIsAssigningSubscription(true);
    try {
      await assignUserSubscription(accessToken, {
        userId: subscriptionUser.userId,
        startDate: formatDate(subscriptionStartDate),
        endDate: formatDate(subscriptionEndDate),
        status: 'active',
      });
      setUsersResult((current) => {
        if (current?.queryKey !== queryKey) return current;
        return {
          ...current,
          data: {
            ...current.data,
            users: current.data.users.map((user) =>
              user.userId === subscriptionUser.userId
                ? { ...user, isPremiumUser: true }
                : user
            ),
          },
        };
      });
      setSubscriptionUser(null);
      setSubscriptionStartDate('');
      setSubscriptionEndDate('');
      setUpdateSuccess('Subscription assigned successfully.');
    } catch (error) {
      showToast(error.message || 'Unable to assign subscription. Please try again.'
      );
    } finally {
      setIsAssigningSubscription(false);
    }
  };

  if (editingDetailsUser) {
    return (
      <div className="wetap-page-container">
        <UserDetailsEditor
          user={editingDetailsUser}
          onBack={() => setEditingDetailsUser(null)}
          onSave={handleDetailsSave}
        />
      </div>
    );
  }

  if (viewingCardsUser) {
    return (
      <div className="wetap-page-container">
        <UserCardsView
          user={viewingCardsUser}
          onBack={handleCardsBack}
        />
      </div>
    );
  }

  return (
    <div className="wetap-page-container">
      {updateSuccess && (
        <div className="wetap-alert-success" role="status">
          {updateSuccess}
        </div>
      )}
      {/* Filter and Search Bar */}
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
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value)}
            className="wetap-dropdown-filter"
          >
            <option value="All">All</option>
             <option value="free">Free</option>
            <option value="trial">Trial</option>
            <option value="weTapPro">Wetap Pro</option>
          </select>
        </div>

        {/* <button className="wetap-add-btn">
          <UserPlus size={16} />
          <span>Add User</span>
        </button> */}
      </div>

      {/* Table Container */}
      <div className="wetap-table-wrapper">
        <table className="wetap-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Status</th>
              <th>Cards</th>
              <th>Subscription</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoadingUsers && !usersErrorMessage && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td className="font-semibold text-dark">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.userName}</td>
                  <td>
                    <span className={`wetap-status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="wetap-user-cards-icon-btn"
                      onClick={() => setViewingCardsUser(user)}
                      title={`View cards for ${user.name}`}
                      aria-label={`View cards for ${user.name}`}
                    >
                      <img src={cardIcon} alt="Cards" />
                    </button>
                  </td>
                  <td>{user.planType}</td>
                  <td>{user.creationDate?.slice(0, 10) || ''}</td>
                  <td>
                    <div className="wetap-action-buttons">
                      <button
                        className="wetap-action-icon-btn view"
                        title="Edit User"
                        aria-label={`Edit ${user.name}`}
                        onClick={() => setEditingDetailsUser(user)}
                      >
                        <img className="wetap-user-edit-icon" src={editUserIcon} alt="" />
                      </button>
                      <button
                        className="wetap-action-icon-btn edit"
                        title="Edit User Status"
                        aria-label={`Edit status for ${user.name}`}
                        onClick={() => openStatusEditor(user)}
                      >
                        <img className="wetap-user-status-icon" src={userStatusIcon} alt="" />
                      </button>
                      <button
                        className="wetap-nonsubscription-btn"
                        type="button"
                        onClick={() =>
                          user.isPremiumUser
                            ? setSubscriptionCancellationUser(user)
                            : openSubscriptionEditor(user)
                        }
                      >
                        {user.isPremiumUser ? 'Subscription' : 'Non-Subscription'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>

        {isLoadingUsers && <LoadingIndicator label="Loading users" />}
        {!isLoadingUsers && !usersErrorMessage && filteredUsers.length === 0 && (
          <EmptyState />
        )}
      </div>

      <Pagination
        page={page}
        totalCount={usersResult?.queryKey === queryKey ? usersResult.data.totalCount : undefined}
        itemCount={users.length}
        onPageChange={setPage}
        disabled={isLoadingUsers}
      />

      {editingUser && createPortal(
        <div
          className="wetap-user-status-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeStatusEditor();
          }}
        >
          <section
            className="wetap-user-status-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-status-title"
          >
            <header className="wetap-user-status-dialog-header">
              <h2 id="edit-user-status-title">Edit User Status</h2>
              <button
                type="button"
                className="wetap-user-status-close-icon"
                onClick={closeStatusEditor}
                aria-label="Close dialog"
                disabled={isUpdating}
              >
                <X size={20} />
              </button>
            </header>
            <form onSubmit={handleStatusSave}>
              <div className="wetap-user-status-dialog-body">
                <div className="wetap-user-existing-status">
                  <span>Existing Status</span>
                  <strong>{editingUser.status}</strong>
                </div>
                <label className="wetap-user-status-field">
                  <span>Status <b>*</b></span>
                  <select
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    required
                    disabled={isUpdating}
                  >
                    <option value="">Select</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <footer className="wetap-user-status-dialog-footer">
                <button type="submit" className="wetap-user-status-save" disabled={isUpdating || !selectedStatus}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="wetap-user-status-close" onClick={closeStatusEditor} disabled={isUpdating}>
                  Close
                </button>
              </footer>
            </form>
          </section>
        </div>,
        document.body
      )}

      {subscriptionCancellationUser && createPortal(
        <div
          className="wetap-user-status-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSubscriptionCancellation();
          }}
        >
          <section
            className="wetap-subscription-cancellation-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-subscription-title"
            aria-describedby="cancel-subscription-description"
          >
            <h2 id="cancel-subscription-title">Are you sure?</h2>
            <p id="cancel-subscription-description">
              You want to cancel the subscription
            </p>
            <div className="wetap-subscription-cancellation-actions">
              <button
                type="button"
                className="wetap-subscription-cancellation-confirm"
                onClick={handleSubscriptionCancellation}
                disabled={isCancellingSubscription}
              >
                {isCancellingSubscription ? 'Cancelling...' : 'Yes, cancelled it!'}
              </button>
              <button
                type="button"
                className="wetap-subscription-cancellation-dismiss"
                onClick={closeSubscriptionCancellation}
                disabled={isCancellingSubscription}
              >
                Cancel
              </button>
            </div>
          </section>
        </div>,
        document.body
      )}

      {subscriptionUser && createPortal(
        <div
          className="wetap-user-status-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSubscriptionEditor();
          }}
        >
          <section
            className="wetap-user-status-dialog wetap-subscription-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-subscription-title"
          >
            <header className="wetap-user-status-dialog-header">
              <h2 id="edit-user-subscription-title">Edit User Subscription</h2>
              <button
                type="button"
                className="wetap-user-status-close-icon"
                onClick={closeSubscriptionEditor}
                aria-label="Close dialog"
                disabled={isAssigningSubscription}
              >
                <X size={20} />
              </button>
            </header>
            <form onSubmit={handleSubscriptionSave}>
              <div className="wetap-subscription-dialog-body">
                <label className="wetap-subscription-date-field">
                  <span>Start Date *</span>
                  <input
                    type="date"
                    value={subscriptionStartDate}
                    onChange={(event) => setSubscriptionStartDate(event.target.value)}
                    required
                    disabled={isAssigningSubscription}
                  />
                </label>
                <label className="wetap-subscription-date-field">
                  <span>End Date *</span>
                  <input
                    type="date"
                    value={subscriptionEndDate}
                    min={subscriptionStartDate || undefined}
                    onChange={(event) => setSubscriptionEndDate(event.target.value)}
                    required
                    disabled={isAssigningSubscription}
                  />
                </label>
              </div>
              <footer className="wetap-user-status-dialog-footer">
                <button
                  type="submit"
                  className="wetap-user-status-save"
                  disabled={
                    isAssigningSubscription ||
                    !subscriptionStartDate ||
                    !subscriptionEndDate
                  }
                >
                  {isAssigningSubscription ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="wetap-user-status-close"
                  onClick={closeSubscriptionEditor}
                  disabled={isAssigningSubscription}
                >
                  Close
                </button>
              </footer>
            </form>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UsersList;
