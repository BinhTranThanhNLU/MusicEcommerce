import { useEffect, useState } from "react";
import { getAdminCopyrightDetail, updateAdminCopyright } from "../../apis/adminApi";
import type { CopyrightInfoDTO } from "../../models/CopyrightInfoDTO";
import type { UpdateCopyrightRequest } from "../../requestmodel/UpdateCopyrightRequest";
import { parseApiError } from "../../utils/apiError";
import { SpinningLoading } from "../utils/SpinningLoading";

interface Props {
  copyrightId: number | null;
  isOpen: boolean;
  mode: "view" | "edit";
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm: UpdateCopyrightRequest = {
  ownerName: "",
  isrcCode: "",
  certificateFileUrl: "",
};

const AdminCopyrightModal = ({
  copyrightId,
  isOpen,
  mode,
  onClose,
  onSaved,
}: Props) => {
  const [detail, setDetail] = useState<CopyrightInfoDTO | null>(null);
  const [form, setForm] = useState<UpdateCopyrightRequest>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDetail = async () => {
      if (!isOpen || copyrightId === null) {
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await getAdminCopyrightDetail(copyrightId);
        setDetail(data);
        setForm({
          ownerName: data.ownerName ?? "",
          isrcCode: data.isrcCode ?? "",
          certificateFileUrl: data.certificateFileUrl ?? "",
        });
      } catch (error) {
        setErrorMessage(parseApiError(error, "Không thể tải chi tiết bản quyền.").message);
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [copyrightId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setDetail(null);
      setForm(emptyForm);
      setErrorMessage(null);
      setLoading(false);
      setSaving(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (copyrightId === null) {
      return;
    }

    if (!form.ownerName.trim() || !form.isrcCode.trim()) {
      setErrorMessage("Vui lòng nhập owner name và ISRC code.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      await updateAdminCopyright(copyrightId, {
        ownerName: form.ownerName.trim(),
        isrcCode: form.isrcCode.trim(),
        certificateFileUrl: form.certificateFileUrl.trim(),
      });
      onSaved();
    } catch (error) {
      setErrorMessage(parseApiError(error, "Không thể cập nhật thông tin bản quyền.").message);
    } finally {
      setSaving(false);
    }
  };

  const isEditable = mode === "edit";

  if (!isOpen || copyrightId === null) {
    return null;
  }

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-bottom-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold mb-1" style={{ color: "#0f172a" }}>
                {isEditable ? "Chỉnh sửa thông tin bản quyền" : "Chi tiết bản quyền"}
              </h5>
              <p className="text-muted small mb-0">
                {detail ? `Mã bản ghi #${detail.id}` : "Đang tải dữ liệu..."}
              </p>
            </div>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body pt-3">
            {loading ? (
              <div className="py-5 d-flex justify-content-center">
                <SpinningLoading />
              </div>
            ) : errorMessage ? (
              <div className="alert alert-danger rounded-4 mb-0" role="alert">
                {errorMessage}
              </div>
            ) : detail ? (
              <div className="row g-4">
                <div className="col-md-5">
                  <div className="bg-light rounded-4 p-3 h-100">
                    <div className="mb-3">
                      <div className="text-muted small text-uppercase fw-semibold">Bài hát</div>
                      <div className="fw-bold">{detail.audioTitle}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-muted small text-uppercase fw-semibold">Nghệ sĩ</div>
                      <div>{detail.artistName}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-muted small text-uppercase fw-semibold">Audio ID</div>
                      <div className="font-monospace">{detail.audioId}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-muted small text-uppercase fw-semibold">Ngày đăng ký</div>
                      <div>{new Date(detail.registeredAt).toLocaleString("vi-VN")}</div>
                    </div>
                    <div>
                      <div className="text-muted small text-uppercase fw-semibold">Tệp chứng nhận</div>
                      {detail.certificateFileUrl ? (
                        <a href={detail.certificateFileUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                          Xem file chứng nhận
                        </a>
                      ) : (
                        <div className="text-muted">Chưa có file đính kèm</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-7">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Chủ sở hữu</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.ownerName}
                        onChange={(e) => setForm((current) => ({ ...current, ownerName: e.target.value }))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">ISRC Code</label>
                      <input
                        type="text"
                        className="form-control font-monospace"
                        value={form.isrcCode}
                        onChange={(e) => setForm((current) => ({ ...current, isrcCode: e.target.value }))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">URL chứng nhận</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={form.certificateFileUrl}
                        onChange={(e) => setForm((current) => ({ ...current, certificateFileUrl: e.target.value }))}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="modal-footer border-top-0 pt-0">
            <button type="button" className="btn btn-light" onClick={onClose}>
              {isEditable ? "Hủy" : "Đóng"}
            </button>
            {isEditable && (
              <button type="button" className="btn btn-primary px-4" onClick={handleSave} disabled={saving || loading}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCopyrightModal;