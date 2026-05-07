import React from "react";
import type { AdminOrderDetailDTO } from "../../models/AdminOrderDetailDTO";

interface Props {
  items: AdminOrderDetailDTO[];
  totalItems: number;
}

const AdminOrderItemsTable: React.FC<Props> = ({ items, totalItems }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <h6 className="fw-bold text-muted text-uppercase mb-3">Chi tiết sản phẩm ({totalItems})</h6>
        {items && items.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light">
                <tr>
                  <th>Tên bài hát</th>
                  <th>Nghệ sĩ</th>
                  <th>Loại giấy phép</th>
                  <th>Giá</th>
                  <th>Thời hạn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.orderDetailId}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {item.coverImage && (
                          <img src={item.coverImage} alt={item.trackTitle} style={{ width: "44px", height: "44px", objectFit: "cover" }} className="rounded" />
                        )}
                        <div>
                          <div className="fw-semibold">{item.trackTitle}</div>
                          <small className="text-muted">#{item.audioId}</small>
                        </div>
                      </div>
                    </td>
                    <td className="fw-semibold">{item.artistName}</td>
                    <td><span className="badge bg-light text-dark border px-3">{item.licenseType}</span></td>
                    <td className="fw-semibold">{new Intl.NumberFormat("vi-VN").format(item.price)} đ</td>
                    <td className="text-muted small">
                      {item.expiredAt ? new Date(item.expiredAt).toLocaleDateString("vi-VN") : "Vĩnh viễn"}
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 ${item.licenseStatus === "ACTIVE" ? "bg-success bg-opacity-10 text-success" : "bg-secondary bg-opacity-10 text-secondary"}`}>
                        {item.licenseStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted">Đơn hàng này không có sản phẩm.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderItemsTable;