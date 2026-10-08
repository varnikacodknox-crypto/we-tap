import React, { useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import { mockCards } from '../../data/mockData';
import { CreditCard, Eye, Edit, QrCode, Plus } from 'lucide-react';

export const CardsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showEmptyStateToggle, setShowEmptyStateToggle] = useState(false);

  const filteredCards = showEmptyStateToggle
    ? []
    : mockCards.filter((card) => {
      const matchesSearch =
        card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            placeholder="Search Card ID / User / Name"
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
        </div>

        {/* <button className="wetap-add-btn">
          <Plus size={16} />
          <span>New Card</span>
        </button> */}
      </div>

      {/* Table Container */}
      <div className="wetap-table-wrapper">
        <table className="wetap-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Card Id</th>
              <th>Status</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <tr key={card.id}>
                  <td className="font-semibold">{card.assignedTo}</td>
                  <td>{card.assignedTo.toLowerCase().replace(' ', '.')}@gmail.com</td>
                  <td className="font-mono text-sm">{card.id}</td>
                  <td>
                    <span className={`wetap-status-badge ${card.status.toLowerCase()}`}>
                      {card.status}
                    </span>
                  </td>
                  <td>2026-10-08</td>
                  <td>
                    <div className="wetap-action-buttons">
                      <button className="wetap-action-icon-btn view" title="Preview Card QR">
                        <QrCode size={16} />
                      </button>
                      <button className="wetap-action-icon-btn edit" title="Edit Card">
                        <Edit size={16} />
                      </button>
                    </div>
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
  );
};

export default CardsList;
