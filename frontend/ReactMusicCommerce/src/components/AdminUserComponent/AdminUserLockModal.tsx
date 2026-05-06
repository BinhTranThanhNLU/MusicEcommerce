import React, { useState } from "react";
import type { AdminUserModel } from "../../models/AdminUserModel";

interface Props {
  user: AdminUserModel | null;
  onConfirm: (userId: number, targetStatus: boolean, reason: string) => Promise<void>;
}

const AdminUserLockModal: React.FC<Props> = ({ user, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm(user.id, !user.isActive, reason);
    setIsProcessing(false);
    setReason("");
    // Đóng modal bằng Bootstrap JS
    const modalElement = document.getElementById('lockAccountModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  };

  const isLocking = user.isActive;

  return (
    <div className="modal fade" id="lockAccountModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className={`modal-title fw-bold ${isLocking ? 'text-danger' : 'text-success'}`}>
              {isLocking ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản"}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p className="text-muted mb-3">
              {isLocking 
                ? `Bạn đang thực hiện thao tác khóa tài khoản của ${user.name}. Người dùng này sẽ không thể đăng nhập.`
                : `Bạn đang thực hiện mở khóa cho tài khoản ${user.name}.`}
            </p>
            {isLocking && (
              <form>
                <div className="mb-3">
                  <label className="form-label fw-medium">Lý do khóa <span className="text-danger">*</span></label>
                  <select className="form-select mb-2" value={reason} onChange={(e) => setReason(e.target.value)}>
                    <option value="">Chọn lý do...</option>
                    <option value="Vi phạm bản quyền nghiêm trọng">Vi phạm bản quyền nghiêm trọng</option>
                    <option value="Gian lận thanh toán">Gian lận thanh toán</option>
                    <option value="Spam hệ thống">Spam hệ thống</option>
                    <option value="Khác">Lý do khác</option>
                  </select>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer border-top-0 pt-0">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Hủy bỏ</button>
            <button type="button" className={`btn px-4 ${isLocking ? 'btn-danger' : 'btn-success'}`} onClick={handleConfirm} disabled={isProcessing || (isLocking && !reason)}>
              {isProcessing ? "Đang xử lý..." : (isLocking ? <><i className="bi bi-lock-fill me-2"></i> Khóa ngay</> : <><i className="bi bi-unlock-fill me-2"></i> Mở khóa</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserLockModal;