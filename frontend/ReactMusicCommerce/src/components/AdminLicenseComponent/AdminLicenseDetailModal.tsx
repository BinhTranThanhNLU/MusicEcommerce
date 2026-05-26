import type { AdminLicenseModel } from "../../models/AdminLicenseModel";
import { SpinningLoading } from "../utils/SpinningLoading";

interface Props {
  license: AdminLicenseModel | null;
  loading: boolean;
  onClose: () => void;
  onRevoke: (orderDetailId: number) => void;
}

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("vi-VN");
};

const formatMoney = (value: number | null) => {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const AdminLicenseDetailModal = ({ license, loading, onClose, onRevoke }: Props) => {
  if (!license) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
          {loading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
              <SpinningLoading />
            </div>
          )}

          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold mb-1">Chi tiết giấy phép #{license.orderDetailId}</h5>
              <div className="text-muted small">Bản ghi của đơn hàng #{license.orderId ?? "-"}</div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body pt-3">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-4 h-100">
                  <div className="text-muted small text-uppercase mb-2">Bài hát</div>
                  <div className="fw-semibold">{license.trackName ?? "-"}</div>
                  <div className="text-muted small mt-1">Nghệ sĩ: {license.artistName ?? "-"}</div>
                  <div className="text-muted small">Audio ID: {license.audioId ?? "-"}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-4 h-100">
                  <div className="text-muted small text-uppercase mb-2">Khách hàng</div>
                  <div className="fw-semibold">{license.customerName ?? "-"}</div>
                  <div className="text-muted small mt-1">{license.customerEmail ?? "-"}</div>
                  <div className="text-muted small">Watermark: {license.watermarkId ?? "-"}</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 bg-white border rounded-4 h-100">
                  <div className="text-muted small text-uppercase mb-2">Loại giấy phép</div>
                  <div className="fw-semibold">{license.licenseType ?? "-"}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-white border rounded-4 h-100">
                  <div className="text-muted small text-uppercase mb-2">Trạng thái</div>
                  <div className="fw-semibold">{license.licenseStatus ?? "-"}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-white border rounded-4 h-100">
                  <div className="text-muted small text-uppercase mb-2">Giá</div>
                  <div className="fw-semibold text-success">{formatMoney(license.price)}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 bg-white border rounded-4 h-100">
                  <div className="text-muted small text-uppercase mb-2">Ngày cấp</div>
                  <div className="fw-semibold">{formatDateTime(license.issuedAt)}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-white border rounded-4 h-100">
                  <div className="text-muted small text-uppercase mb-2">Ngày hết hạn</div>
                  <div className="fw-semibold">{formatDateTime(license.expiredAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Đóng
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onRevoke(license.orderDetailId)}
            >
              Thu hồi giấy phép
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLicenseDetailModal;