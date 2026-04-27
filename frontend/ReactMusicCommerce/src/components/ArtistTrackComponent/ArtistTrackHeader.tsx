import { useNavigate } from "react-router-dom";

const ArtistTrackHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-end mb-4">
      <div>
        <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)" }}>
          Kho nhạc của tôi
        </h3>
        <p className="text-muted mb-0">
          Quản lý toàn bộ tác phẩm, chỉnh sửa metadata và theo dõi lượt mua.
        </p>
      </div>
      <div>
        <button
          className="btn rounded-pill px-4 shadow-sm text-white"
          style={{ backgroundColor: "var(--accent-color)" }}
          type="button"
          onClick={() => navigate("/artist/upload")}
        >
          <i className="bi bi-cloud-arrow-up-fill me-2"></i> Tải nhạc lên
        </button>
      </div>
    </div>
  );
};

export default ArtistTrackHeader;
