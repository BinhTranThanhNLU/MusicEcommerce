import React from "react";
import type { TopTrackModel } from "../../models/TopTrackModel";

interface Props { tracks: TopTrackModel[]; }

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const AdminTopSellingTracks:React.FC<Props> = ({tracks}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Top bán chạy toàn nền tảng</h5>
        <div className="d-flex flex-column gap-3">
          {tracks.length === 0 ? (
            <p className="text-muted text-center py-4">Không có dữ liệu</p>
          ) : (
            tracks.map((track, index) => (
              <div key={track.id} className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="fw-bold text-muted" style={{ width: "20px" }}>#{index + 1}</div>
                  <img src={track.cover} alt="Cover" className="rounded" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                  <div>
                    <h6 className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>{track.title}</h6>
                    <small className="text-muted" style={{ fontSize: "12px" }}>{track.type}</small>
                  </div>
                </div>
                <div className="fw-bold text-success small">
                  {formatVND(track.revenue)}
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
