import type { AdminDashboardOverviewDTO } from "../../responsemodel/AdminDashboardOverviewDTO";

interface Props {
  data: AdminDashboardOverviewDTO | null;
  loading: boolean;
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value) + " ₫";

const AdminDashboardSummaryCards = ({ data, loading }: Props) => {
  const cards = [
    {
      label: "Tổng user",
      value: data ? new Intl.NumberFormat("vi-VN").format(data.totalUsers) : "--",
      icon: "bi-people",
      tone: { bg: "#e0e7ff", color: "#4f46e5" },
      note: "Tài khoản đang hoạt động trên hệ thống",
    },
    {
      label: "Tổng nghệ sĩ",
      value: data ? new Intl.NumberFormat("vi-VN").format(data.totalArtists) : "--",
      icon: "bi-person-badge",
      tone: { bg: "#ccfbf1", color: "#0f766e" },
      note: "Nghệ sĩ đã đăng ký và được quản lý",
    },
    {
      label: "Tổng bài đăng",
      value: data ? new Intl.NumberFormat("vi-VN").format(data.totalAudioTracks) : "--",
      icon: "bi-music-note-list",
      tone: { bg: "#fef3c7", color: "#d97706" },
      note: "Bao gồm mọi cấp độ sản phẩm âm thanh",
    },
    {
      label: "Tổng doanh thu",
      value: data ? formatMoney(data.totalRevenue) : "--",
      icon: "bi-cash-stack",
      tone: { bg: "#dcfce7", color: "#16a34a" },
      note: `Chu kỳ ${data?.period ?? "--"} với ${data?.points ?? "--"} điểm dữ liệu`,
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {cards.map((card) => (
        <div className="col-xl-3 col-sm-6" key={card.label}>
          <div className="card border-0 shadow-sm rounded-4 h-100 admin-summary-card">
            <div className="card-body p-4 d-flex align-items-start gap-3">
              <div
                className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: card.tone.bg,
                  color: card.tone.color,
                }}
              >
                <i className={`bi ${card.icon} fs-3`} />
              </div>
              <div className="min-w-0">
                <p className="text-muted mb-1 small text-uppercase fw-semibold">
                  {card.label}
                </p>
                <h4 className="fw-bold mb-1 text-truncate">
                  {loading ? "Đang tải..." : card.value}
                </h4>
                <small className="text-muted d-block">{card.note}</small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboardSummaryCards;