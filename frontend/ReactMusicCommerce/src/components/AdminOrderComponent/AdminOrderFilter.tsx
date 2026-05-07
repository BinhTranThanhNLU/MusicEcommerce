import React from "react";

interface Props {
  paymentStatus: string;
  setPaymentStatus: (val: string) => void;
}

const AdminOrderFilter: React.FC<Props> = ({ paymentStatus, setPaymentStatus }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 p-3">
      <div className="row g-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label fw-semibold small text-muted text-uppercase">
            Trạng thái thanh toán
          </label>
          <select
            className="form-select form-select-sm rounded-3"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="FAILED">Thất bại</option>
            <option value="REFUNDED">Hoàn tiền</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderFilter;