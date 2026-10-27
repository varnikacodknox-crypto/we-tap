import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import Pagination, { PAGE_SIZE } from '../../components/common/Pagination';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { getPhysicalCards } from '../../api/cards';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

// The card list shape isn't confirmed yet, so read the likely field names with fallbacks.
const getCardName = (card) => card.name || card.userName || card.userDetails?.name || '';
const getCardEmail = (card) => card.email || card.userDetails?.email || '';
const getCardId = (card) => card.cardId || card.cardNumber || card._id || '';
const getCardStatus = (card) => card.status || '';
// insertDate may arrive as Unix seconds, milliseconds, or a date string.
const toDate = (value) => {
  if (typeof value === 'number' || /^\d+$/.test(value)) {
    const num = Number(value);
    return new Date(num < 1e12 ? num * 1000 : num);
  }
  return new Date(value);
};
const getCardDate = (card) => {
  const raw = card.creationDate || card.insertDate;
  if (!raw) return '';
  const date = toDate(raw);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

export const CardsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cardsResult, setCardsResult] = useState(null);
  const [page, setPage] = useState(0);
  const [cardsError, setCardsError] = useState(null);
  const { accessToken } = useAuth();
  const showToast = useToast();
  const queryKey = `${accessToken}|${page}`;
  const cards = cardsResult?.queryKey === queryKey ? cardsResult.data.cardList || [] : [];
  const cardsErrorMessage =
    cardsError?.queryKey === queryKey ? cardsError.message : '';
  const isLoadingCards = cardsResult?.queryKey !== queryKey && !cardsErrorMessage;

  useEffect(() => {
    const controller = new AbortController();

    getPhysicalCards(accessToken, { limit: PAGE_SIZE, offset: page * PAGE_SIZE }, controller.signal)
      .then((data) => {
        setCardsResult({ queryKey, data });
        setCardsError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setCardsError({ queryKey, message: error.message });
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, page, queryKey, showToast]);

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
      {/* Below 760px each row becomes a card; data-label supplies the field names. */}
      <div className="wetap-table-wrapper wetap-table-wrapper--stacked">
        <table className="wetap-data-table wetap-stacked-table">
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
                  <td className="font-semibold wetap-stacked-title">{getCardName(card)}</td>
                  <td data-label="Email">{getCardEmail(card)}</td>
                  <td data-label="Card Id" className="font-mono text-sm">{getCardId(card)}</td>
                  <td data-label="Status" className="wetap-stacked-inline">
                    <span className={`wetap-status-badge ${getCardStatus(card).toLowerCase()}`}>
                      {getCardStatus(card)}
                    </span>
                  </td>
                  <td className="wetap-stacked-date">{getCardDate(card)}</td>
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

      <Pagination
        page={page}
        totalCount={cardsResult?.queryKey === queryKey ? cardsResult.data.totalCount : undefined}
        itemCount={cards.length}
        onPageChange={setPage}
        disabled={isLoadingCards}
      />
    </div>
  );
};

export default CardsList;
