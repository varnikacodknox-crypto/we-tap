import React, { useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import { mockUsers } from '../../data/mockData';
import { Eye, Edit2, Trash2, UserPlus } from 'lucide-react';

export const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('All');
  const [showEmptyStateToggle, setShowEmptyStateToggle] = useState(true); // Matches screenshot 4/5 zero records default

  const filteredUsers = showEmptyStateToggle
    ? []
    : mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || user.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSub =
        subFilter === 'All' || user.subscription.toLowerCase().includes(subFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesSub;
    });

  return (
    <div className="wetap-page-container">
      {/* Demo State Switcher */}
      {/* <div className="wetap-demo-toggle-bar">
        <label className="wetap-toggle-label">
          <input
            type="checkbox"
            checked={!showEmptyStateToggle}
            onChange={(e) => setShowEmptyStateToggle(!e.target.checked)}
          />
          <span>Show Populated Table Data (Toggle between empty state & user records)</span>
        </label>
      </div> */}

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
            <option value="Pending">Pending</option>
          </select>

          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value)}
            className="wetap-dropdown-filter"
          >
            <option value="All">All Subscriptions</option>
            <option value="Enterprise Pro">Enterprise Pro</option>
            <option value="Standard">Standard</option>
            <option value="Basic">Basic</option>
          </select>
        </div>

        <button className="wetap-add-btn">
          <UserPlus size={16} />
          <span>Add User</span>
        </button>
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-semibold text-dark">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>
                    <span className={`wetap-status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.cards}</td>
                  <td>{user.subscription}</td>
                  <td>{user.createDate}</td>
                  <td>
                    <div className="wetap-action-buttons">
                      <button className="wetap-action-icon-btn view" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="wetap-action-icon-btn edit" title="Edit User">
                        <Edit2 size={16} />
                      </button>
                      <button className="wetap-action-icon-btn delete" title="Delete User">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <EmptyState message="No Records Found" />
        )}
      </div>
    </div>
  );
};

export default UsersList;
