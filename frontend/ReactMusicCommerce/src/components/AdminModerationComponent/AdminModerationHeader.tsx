interface Props {
  totalItems: number;
  page: number;
  totalPages: number;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onClearKeyword: () => void;
  onRefresh: () => void;
}

const AdminModerationHeader = ({
  totalItems,
  page,
  totalPages,
  keyword,
  onKeywordChange,
  onClearKeyword,
  onRefresh,
}: Props) => {
  return (
    <>
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            Kiểm duyệt nội dung âm nhạc
          </h3>
          <p className="text-muted mb-0">
            Xem danh sách bài hát đang chờ duyệt, mở chi tiết và xử lý phê duyệt hoặc yêu cầu chỉnh sửa.
          </p>
        </div>

        <div className="text-lg-end">
          <div className="fw-semibold text-dark">{totalItems} bài hát chờ xử lý</div>
          <small className="text-muted">
            Trang {page + 1} / {totalPages || 1}
          </small>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4 d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-between">
          <div className="input-group" style={{ maxWidth: "520px" }}>
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Lọc nhanh theo tên bài hát, nghệ sĩ, thể loại..."
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
            />
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onClearKeyword}
            >
              Xóa lọc
            </button>
            <button
              type="button"
              className="btn rounded-pill px-4 fw-medium"
              style={{ backgroundColor: "#4f46e5", color: "white" }}
              onClick={onRefresh}
            >
              <i className="bi bi-arrow-clockwise me-2"></i> Làm mới
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminModerationHeader;