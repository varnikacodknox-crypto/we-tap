import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PAGE_SIZE = 5;

// Page numbers to show: first, last, and a window around the current page, with gaps as null.
const getPageItems = (currentPage, pageCount) => {
  const pages = new Set([0, pageCount - 1, currentPage - 1, currentPage, currentPage + 1]);
  const sorted = [...pages].filter((page) => page >= 0 && page < pageCount).sort((a, b) => a - b);

  return sorted.reduce((items, page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push(null);
    items.push(page);
    return items;
  }, []);
};

export const Pagination = ({ page, totalCount, itemCount, onPageChange, disabled = false }) => {
  // Fall back to "a full page means there may be more" when the API omits totalCount.
  const hasTotal = Number.isFinite(totalCount);
  const pageCount = hasTotal
    ? Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    : page + (itemCount === PAGE_SIZE ? 2 : 1);

  if (pageCount <= 1) return null;

  const firstItem = page * PAGE_SIZE + 1;
  const lastItem = page * PAGE_SIZE + itemCount;
  const canGoBack = page > 0 && !disabled;
  const canGoForward = page < pageCount - 1 && !disabled;

  return (
    <nav className="wetap-pagination" aria-label="Pagination">
      <span className="wetap-pagination-summary">
        {itemCount > 0 && `${firstItem}–${lastItem}`}
        {itemCount > 0 && hasTotal && ` of ${totalCount}`}
      </span>

      <div className="wetap-pagination-controls">
        <button
          type="button"
          className="wetap-pagination-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoBack}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {hasTotal &&
          getPageItems(page, pageCount).map((item, index) =>
            item === null ? (
              <span key={`gap-${index}`} className="wetap-pagination-gap">…</span>
            ) : (
              <button
                key={item}
                type="button"
                className={`wetap-pagination-btn ${item === page ? 'active' : ''}`}
                onClick={() => onPageChange(item)}
                disabled={disabled}
                aria-current={item === page ? 'page' : undefined}
              >
                {item + 1}
              </button>
            )
          )}

        <button
          type="button"
          className="wetap-pagination-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoForward}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
