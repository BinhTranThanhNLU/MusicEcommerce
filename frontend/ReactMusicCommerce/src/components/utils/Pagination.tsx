import type React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  setPage,
}) => {
  const pages = [...Array(totalPages).keys()]; // [0,1,2,...]

  return (
    <section id="category-pagination" className="category-pagination section">
      <div className="container">
        <nav
          className="d-flex justify-content-center"
          aria-label="Page navigation"
        >
          <ul className="pagination">
            {/* Previous */}
            <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                ← Trước
              </button>
            </li>

            {/* Page numbers */}
            {pages.map((p) => (
              <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(p)}>
                  {p + 1}
                </button>
              </li>
            ))}

            {/* Next */}
            <li
              className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(page + 1)}>
                Sau →
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Pagination;
