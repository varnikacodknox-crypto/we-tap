import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { getPhysicalCards } from '../../api/cards';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

// The card list shape isn't confirmed yet, so read the likely field names with fallbacks.
const getCardName = (card) => card.name || card.userName || card.userDetails?.name || '';
const getCardEmail = (card) => card.email || card.userDetails?.email || '';
const getCardId = (card) => card.cardId || card.cardNumber || card._id || '';
const getCardStatus = (card) => card.status || '';
const getCardDate = (card) => {
  if (card.creationDate) return card.creationDate.slice(0, 10);
  if (card.insertDate) return new Date(card.insertDate * 1000).toISOString().slice(0, 10);
  return '';
};

export const CardsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cardsResult, setCardsResult] = useState(null);
  const [cardsError, setCardsError] = useState(null);
  const { accessToken } = useAuth();
  const showToast = useToast();
  const cards = cardsResult?.token === accessToken ? cardsResult.data.cardList || [] : [];
  const cardsErrorMessage =
    cardsError?.token === accessToken ? cardsError.message : '';
  const isLoadingCards = cardsResult?.token !== accessToken && !cardsErrorMessage;

  useEffect(() => {
    const controller = new AbortController();

    getPhysicalCards(accessToken, { limit: 5, offset: 0 }, controller.signal)
      .then((data) => {
        setCardsResult({ token: accessToken, data });
        setCardsError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setCardsError({ token: accessToken, message: error.message });
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, showToast]);

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      getCardName(card).toLowerCase().includes(normalizedSearch) ||
      getCardEmail(card).toLowerCase().includes(normalizedSearch) ||
      String(getCardId(card)).toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === 'All' || getCardStatus(card).toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="wetap-page-container">
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
            </tr>
          </thead>
          <tbody>
            {!isLoadingCards && !cardsErrorMessage && filteredCards.length > 0 ? (
              filteredCards.map((card, index) => (
                <tr key={getCardId(card) || index}>
                  <td className="font-semibold">{getCardName(card)}</td>
                  <td>{getCardEmail(card)}</td>
                  <td className="font-mono text-sm">{getCardId(card)}</td>
                  <td>
                    <span className={`wetap-status-badge ${getCardStatus(card).toLowerCase()}`}>
                      {getCardStatus(card)}
                    </span>
                  </td>
                  <td>{getCardDate(card)}</td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>

        {isLoadingCards && <LoadingIndicator label="Loading cards" />}
        {!isLoadingCards && !cardsErrorMessage && filteredCards.length === 0 && (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default CardsList;
