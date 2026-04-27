interface ArtistTrackPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  currentCount: number;
}

const ArtistTrackPagination = ({
  page,
  setPage,
  totalPages,
  totalItems,
  pageSize,
  currentCount,
}: ArtistTrackPaginationProps) => {
  return (
    <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
      <span className="text-muted small">
        Hiển thị {currentCount > 0 ? page * pageSize + 1 : 0} -{" "}
        {page * pageSize + currentCount} của {totalItems} tác phẩm
      </span>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              Trước
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, idx) => idx).map((idx) => (
            <li
              key={idx}
              className={`page-item ${idx === page ? "active" : ""}`}
            >
              <button
                className={`page-link ${idx === page ? "" : "text-dark"}`}
                type="button"
                style={
                  idx === page
                    ? {
                        backgroundColor: "var(--accent-color)",
                        borderColor: "var(--accent-color)",
                      }
                    : undefined
                }
                onClick={() => setPage(idx)}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${page >= totalPages - 1 || totalPages === 0 ? "disabled" : ""}`}
          >
            <button
              className="page-link text-dark"
              type="button"
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, Math.max(totalPages - 1, 0)),
                )
              }
            >
              Sau
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ArtistTrackPagination;
