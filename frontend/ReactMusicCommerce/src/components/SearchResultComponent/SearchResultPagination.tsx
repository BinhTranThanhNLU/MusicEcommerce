interface SearchResultPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

const SearchResultPagination = ({
  page,
  totalPages,
  onPageChange,
}: SearchResultPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <section id="search-result-pagination" className="category-pagination section">
      <div className="container">
        <nav className="d-flex justify-content-center" aria-label="Search pagination">
          <ul className="pagination">
            <li className={`page-item ${page <= 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 0}
              >
                ← Truoc
              </button>
            </li>

            {pages.map((currentPage) => (
              <li
                key={currentPage}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  type="button"
                  onClick={() => onPageChange(currentPage)}
                >
                  {currentPage + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Sau →
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default SearchResultPagination;
