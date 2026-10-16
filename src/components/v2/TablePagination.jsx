const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const TablePagination = ({ page, pageSize, totalCount, itemCount, onPageChange, onPageSizeChange, disabled }) => {
  // Without a totalCount from the API, assume a full page means there may be more.
  const hasTotal = Number.isFinite(totalCount);
  const pageCount = hasTotal
    ? Math.max(1, Math.ceil(totalCount / pageSize))
    : page + (itemCount === pageSize ? 2 : 1);
  const firstItem = itemCount === 0 ? 0 : page * pageSize + 1;
  const lastItem = page * pageSize + itemCount;

  return (
    <div className="wtv2-pagination">
      <div className="wtv2-pagination-info">
        <span>
          Showing {firstItem} to {lastItem}
          {hasTotal && ` of ${totalCount}`} entries
        </span>
        <label>
          Rows per page:
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="wtv2-select wtv2-select-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="wtv2-pagination-controls">
        <button
          type="button"
          className="wtv2-page-btn wide"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page === 0}
        >
          &larr; Prev
        </button>
        {Array.from({ length: pageCount }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`wtv2-page-btn ${index === page ? 'active' : ''}`}
            onClick={() => onPageChange(index)}
            disabled={disabled}
            aria-current={index === page ? 'page' : undefined}
          >
            {index + 1}
          </button>
        ))}
        <button
          type="button"
          className="wtv2-page-btn wide"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= pageCount - 1}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
