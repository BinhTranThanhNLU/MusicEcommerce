import React from "react";

const topTracks = [
  { id: 1, title: "Cơn Mưa Ngang Qua", type: "Thương mại", revenue: 12500000, cover: "https://placehold.co/40x40" },
  { id: 2, title: "Nắng Ấm Xa Dần", type: "Cá nhân", revenue: 8300000, cover: "https://placehold.co/40x40" },
  { id: 3, title: "Chắc Ai Đó Sẽ Về", type: "Độc quyền", revenue: 7500000, cover: "https://placehold.co/40x40" },
  { id: 4, title: "Em Của Ngày Hôm Qua", type: "Thương mại", revenue: 4200000, cover: "https://placehold.co/40x40" },
  { id: 5, title: "Khuôn Mặt Đáng Thương", type: "Cá nhân", revenue: 1500000, cover: "https://placehold.co/40x40" },
];

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const TopSellingTracks = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Top bán chạy</h5>
        <div className="d-flex flex-column gap-3">
          {topTracks.map((track, index) => (
            <div key={track.id} className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="fw-bold text-muted" style={{ width: "20px" }}>#{index + 1}</div>
                <img src={track.cover} alt="Cover" className="rounded" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                <div>
                  <h6 className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>{track.title}</h6>
                  <small className="text-muted" style={{ fontSize: "12px" }}>Bán chạy nhất: {track.type}</small>
                </div>
              </div>
              <div className="fw-bold text-success small">
                {formatVND(track.revenue)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSellingTracks;