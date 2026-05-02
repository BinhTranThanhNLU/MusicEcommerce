import React from "react";
import type { RecentActivityModel } from "../../models/RecentActivityModel";

interface Props {
  activities: RecentActivityModel[];
}

// Hàm tính thời gian trôi qua siêu ảo diệu
const timeAgo = (dateString: string) => {
  const past = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Hôm qua";
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  return past.toLocaleDateString("vi-VN");
};

const RecentActivityTable: React.FC<Props> = ({ activities }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-0 overflow-hidden">
      <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
        <h5 className="fw-bold mb-0">Hoạt động tương tác mới nhất</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <tbody className="bg-white">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-muted">Chưa có hoạt động nào gần đây.</td>
              </tr>
            ) : (
              activities.map((act, index) => (
                <tr key={index}>
                  <td className="ps-4 text-muted small" style={{ width: "15%" }}>{timeAgo(act.createdAt)}</td>
                  <td style={{ width: "25%" }}>
                    <div className="d-flex align-items-center">
                      <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex justify-content-center align-items-center me-2" style={{width: "32px", height: "32px"}}>
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <span className="fw-semibold text-dark">{act.user}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted">{act.action}</span>
                  </td>
                  <td className="text-end pe-4">
                    <i className={`bi ${act.icon} fs-5 ${act.color}`}></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-top text-center bg-white">
        <a href="#" className="text-decoration-none fw-medium text-primary small">Xem tất cả hoạt động</a>
      </div>
    </div>
  );
};

export default RecentActivityTable;