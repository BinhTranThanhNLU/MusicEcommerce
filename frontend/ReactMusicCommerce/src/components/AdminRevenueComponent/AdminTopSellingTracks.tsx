import { useEffect, useState } from "react";
import { getAdminTopSellingTracks } from "../../apis/adminApi";
import type { AdminTopTrackDTO } from "../../responsemodel/AdminTopTrackDTO";
import { parseApiError } from "../../utils/apiError";

interface Props {
  limit?: number;
}

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const AdminTopSellingTracks = ({ limit = 5 }: Props) => {
  const [tracks, setTracks] = useState<AdminTopTrackDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await getAdminTopSellingTracks(limit);
        setTracks(data ?? []);
      } catch (error) {
        setTracks([]);
        setErrorMessage(parseApiError(error, "Không thể tải top bán chạy.").message);
      } finally {
        setLoading(false);
      }
    };

    void fetchTopTracks();
  }, [limit]);

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Top bán chạy toàn nền tảng</h5>
          <span className="badge rounded-pill text-bg-light border text-secondary">{limit} mục</span>
        </div>
        {errorMessage && <div className="alert alert-warning py-2 small mb-3">{errorMessage}</div>}
        <div className="d-flex flex-column gap-3">
          {loading ? (
            <p className="text-muted text-center py-4 mb-0">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Đang tải...
            </p>
          ) : tracks.length === 0 ? (
            <p className="text-muted text-center py-4">Không có dữ liệu</p>
          ) : (
            tracks.map((track, index) => (
              <div key={track.id} className="d-flex align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="fw-bold text-muted" style={{ width: "20px" }}>#{index + 1}</div>
                  <img
                    src={track.cover ?? "https://via.placeholder.com/40?text=Track"}
                    alt={track.title}
                    className="rounded"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  <div>
                    <h6 className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>{track.title}</h6>
                    <small className="text-muted" style={{ fontSize: "12px" }}>
                      {track.audioType} · {track.licenseType} · {track.salesCount} lượt bán
                    </small>
                  </div>
                </div>
                <div className="text-end">
                  <div className="fw-bold text-success small">
                    {formatVND(track.adminRevenue ?? track.revenue)}
                  </div>
                  <small className="text-muted">
                    Tổng giao dịch: {formatVND(track.revenue)}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTopSellingTracks;
