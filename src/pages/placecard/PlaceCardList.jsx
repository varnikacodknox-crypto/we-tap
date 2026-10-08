import React, { useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import { mockPlaceCards } from '../../data/mockData';
import { MapPin, Settings, Eye, Plus } from 'lucide-react';

export const PlaceCardList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showEmptyStateToggle, setShowEmptyStateToggle] = useState(false);

  const filteredPlaceCards = showEmptyStateToggle
    ? []
    : mockPlaceCards.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || card.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

  return (
    <div className="wetap-page-container">
      {/* Demo State Switcher */}
      {/* <div className="wetap-demo-toggle-bar">
        <label className="wetap-toggle-label">
          <input
            type="checkbox"
            checked={showEmptyStateToggle}
            onChange={(e) => setShowEmptyStateToggle(e.target.checked)}
          />
          <span>Show Empty State ("No Records Found")</span>
        </label>
      </div> */}

      {/* Search and Filter Bar */}
      <div className="wetap-filter-bar">
        <div className="wetap-filter-inputs">
          <input
            type="text"
            placeholder="Search Place Card / Location"
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
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <button className="wetap-add-btn">
          <Plus size={16} />
          <span>Add Place Card</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="wetap-table-wrapper">
        <table className="wetap-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Device / Stand Title</th>
              <th>Location</th>
              <th>Assigned Desk / User</th>
              <th>Device Type</th>
              <th>Total Taps</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaceCards.length > 0 ? (
              filteredPlaceCards.map((plc) => (
                <tr key={plc.id}>
                  <td className="font-mono text-sm">{plc.id}</td>
                  <td className="font-semibold">{plc.title}</td>
                  <td>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {plc.location}
                    </span>
                  </td>
                  <td>{plc.assignedUser}</td>
                  <td>{plc.deviceType}</td>
                  <td className="font-bold text-purple-600">{plc.tapsCount}</td>
                  <td>
                    <span className={`wetap-status-badge ${plc.status.toLowerCase()}`}>
                      {plc.status}
                    </span>
                  </td>
                  <td>
                    <div className="wetap-action-buttons">
                      <button className="wetap-action-icon-btn view" title="View Diagnostics">
                        <Eye size={16} />
                      </button>
                      <button className="wetap-action-icon-btn edit" title="Configure Device">
                        <Settings size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>

        {filteredPlaceCards.length === 0 && (
          <EmptyState message="No Records Found" />
        )}
      </div>
    </div>
  );
};

export default PlaceCardList;
