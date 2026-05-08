import type { AudioTrackDTO } from "../../responsemodel/AudioTrackDTO";
import { formatDateTime, formatDuration, getStatusMeta, type ModerationMode } from "./moderationUtils";

interface Props {
  selectedTrack: AudioTrackDTO | null;
  detailLoading: boolean;
  detailError: string | null;
  moderationMode: ModerationMode | null;
  reason: string;
  revisionPointsText: string;
  submitting: boolean;
  onClose: () => void;
  onReasonChange: (value: string) => void;
  onRevisionPointsChange: (value: string) => void;
  onOpenModerationForm: (mode: ModerationMode) => void;
  onSubmitModeration: () => void;
  onApprove: (trackId: number) => void;
}

const AdminModerationDetailModal = ({
  selectedTrack,
  detailLoading,
  detailError,
  moderationMode,
  reason,
  revisionPointsText,
  submitting,
  onClose,
  onReasonChange,
  onRevisionPointsChange,
  onOpenModerationForm,
  onSubmitModeration,
  onApprove,
}: Props) => {
  if (!selectedTrack) {
    return null;
  }

  const selectedStatusMeta = getStatusMeta(selectedTrack.status);

  if (!moderationMode) {
    return (
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}>
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
            <div className="modal-header border-bottom-0 pb-0">
              <div>
                <h5 className="modal-title fw-bold mb-1">Chi tiết kiểm duyệt</h5>
                <div className="text-muted small">Bài hát #{selectedTrack.id}</div>
              </div>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body pt-2">
              {detailLoading && (
                <div className="py-4 text-center text-muted">Đang tải chi tiết...</div>
              )}

              {!detailLoading && detailError && (
                <div className="alert alert-danger rounded-4 mb-0" role="alert">{detailError}</div>
              )}

              {!detailLoading && !detailError && (
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="card border-0 bg-light rounded-4 h-100">
                      <div className="card-body p-4">
                        <div className="mb-3">
                          {selectedTrack.coverImage ? (
                            <img
                              src={selectedTrack.coverImage}
                              alt={selectedTrack.title}
                              className="w-100 rounded-4"
                              style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                            />
                          ) : (
                            <div className="w-100 rounded-4 d-flex align-items-center justify-content-center" style={{ aspectRatio: "1 / 1", backgroundColor: "#e2e8f0", color: "#64748b" }}>
                              <i className="bi bi-music-note-beamed fs-1"></i>
                            </div>
                          )}
                        </div>
                        <h4 className="fw-bold mb-1">{selectedTrack.title}</h4>
                        <p className="text-muted mb-3">{selectedTrack.artist?.name || selectedTrack.authorName || "-"}</p>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <span className={`badge rounded-pill px-3 py-2 ${selectedStatusMeta.className}`}>{selectedStatusMeta.label}</span>
                          <span className="badge bg-light text-dark border rounded-pill px-3 py-2">{selectedTrack.audioType}</span>
                          <span className="badge bg-light text-dark border rounded-pill px-3 py-2">{formatDuration(selectedTrack.duration)}</span>
                        </div>
                        {selectedTrack.watermarkedFileUrl && (
                          <audio controls className="w-100 mb-3">
                            <source src={selectedTrack.watermarkedFileUrl} />
                            Trình duyệt của bạn không hỗ trợ phát âm thanh.
                          </audio>
                        )}
                        <div className="d-grid gap-2">
                          <button type="button" className="btn btn-success" onClick={() => onApprove(selectedTrack.id)}>
                            <i className="bi bi-check-lg me-2"></i> Duyệt bài hát
                          </button>
                          <button type="button" className="btn btn-outline-danger" onClick={() => onOpenModerationForm("reject")}>
                            <i className="bi bi-x-lg me-2"></i> Từ chối
                          </button>
                          <button type="button" className="btn btn-outline-warning" onClick={() => onOpenModerationForm("revision")}>
                            <i className="bi bi-pencil-square me-2"></i> Yêu cầu chỉnh sửa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="card border-0 bg-light rounded-4 h-100">
                          <div className="card-body p-4">
                            <div className="text-muted small mb-2">Nghệ sĩ</div>
                            <div className="fw-semibold text-dark">{selectedTrack.artist?.name || selectedTrack.authorName || "-"}</div>
                            <div className="text-muted small mt-1">Đăng tải lúc {formatDateTime(selectedTrack.uploadDate)}</div>
                            <div className="text-muted small">Duyệt bởi {selectedTrack.moderatedBy || "-"}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 bg-light rounded-4 h-100">
                          <div className="card-body p-4">
                            <div className="text-muted small mb-2">Thống kê</div>
                            <div className="d-flex justify-content-between mb-2"><span>Lượt nghe</span><strong>{selectedTrack.playCount ?? 0}</strong></div>
                            <div className="d-flex justify-content-between mb-2"><span>Giá khởi điểm</span><strong>{selectedTrack.startingPrice?.toLocaleString("vi-VN") || 0} đ</strong></div>
                            <div className="d-flex justify-content-between"><span>Đánh giá</span><strong>{selectedTrack.averageRating ?? "-"} / {selectedTrack.reviewCount ?? 0}</strong></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="card border-0 bg-light rounded-4">
                          <div className="card-body p-4">
                            <div className="text-muted small mb-2">Mô tả</div>
                            <p className="mb-0 text-dark">{selectedTrack.description || "Không có mô tả."}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 bg-light rounded-4 h-100">
                          <div className="card-body p-4">
                            <div className="text-muted small mb-3">Thể loại và mood</div>
                            <div className="d-flex flex-wrap gap-2">
                              {(selectedTrack.tags?.genres || []).map((genre) => (
                                <span key={genre} className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill px-3 py-2">{genre}</span>
                              ))}
                              {(selectedTrack.tags?.moods || []).map((mood) => (
                                <span key={mood} className="badge bg-info bg-opacity-10 text-info border border-info-subtle rounded-pill px-3 py-2">{mood}</span>
                              ))}
                              {!selectedTrack.tags?.genres?.length && !selectedTrack.tags?.moods?.length && (
                                <span className="text-muted">Chưa gắn thẻ.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 bg-light rounded-4 h-100">
                          <div className="card-body p-4">
                            <div className="text-muted small mb-3">Giấy phép</div>
                            <div className="d-flex flex-column gap-2">
                              {(selectedTrack.licenses || []).map((license) => (
                                <div key={license.licenseId} className="d-flex justify-content-between align-items-center border rounded-3 bg-white px-3 py-2">
                                  <div>
                                    <div className="fw-semibold">{license.licenseType}</div>
                                    <small className="text-muted">{license.description}</small>
                                  </div>
                                  <strong>{license.price?.toLocaleString("vi-VN") || 0} đ</strong>
                                </div>
                              ))}
                              {!selectedTrack.licenses?.length && <span className="text-muted">Chưa có thông tin giấy phép.</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="card border-0 bg-light rounded-4">
                          <div className="card-body p-4">
                            <div className="text-muted small mb-2">Kết quả kiểm duyệt</div>
                            <div className="row g-3">
                              <div className="col-md-4">
                                <div className="text-muted small">Quyết định</div>
                                <div className="fw-semibold">{selectedTrack.moderationDecision || "Chưa xử lý"}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-muted small">Lý do từ chối</div>
                                <div className="fw-semibold">{selectedTrack.rejectionReason || "-"}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-muted small">Thời điểm kiểm duyệt</div>
                                <div className="fw-semibold">{formatDateTime(selectedTrack.moderatedAt)}</div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="text-muted small mb-2">Gợi ý chỉnh sửa</div>
                              <div className="d-flex flex-wrap gap-2">
                                {(selectedTrack.revisionPoints || []).map((point) => (
                                  <span key={point} className="badge bg-warning bg-opacity-10 text-warning border border-warning-subtle rounded-pill px-3 py-2">{point}</span>
                                ))}
                                {!selectedTrack.revisionPoints?.length && <span className="text-muted">-</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light" onClick={onClose}>Đóng</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div className="modal-header border-bottom-0 pb-0">
            <div>
              <h5 className={`modal-title fw-bold mb-1 ${moderationMode === "reject" ? "text-danger" : "text-warning"}`}>
                {moderationMode === "reject" ? "Từ chối bài hát" : "Yêu cầu chỉnh sửa bài hát"}
              </h5>
              <div className="text-muted small">{selectedTrack.title} - {selectedTrack.artist?.name || selectedTrack.authorName || "-"}</div>
            </div>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body pt-2">
            <div className="alert alert-light border rounded-4">
              <div className="fw-semibold mb-1">Bài hát đang xử lý</div>
              <div className="text-muted small">{selectedTrack.audioType} • {formatDuration(selectedTrack.duration)} • {selectedTrack.artist?.name || selectedTrack.authorName || "-"}</div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">
                Lý do {moderationMode === "reject" ? "từ chối" : "yêu cầu chỉnh sửa"} <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={4}
                value={reason}
                onChange={(event) => onReasonChange(event.target.value)}
                placeholder={moderationMode === "reject" ? "Ví dụ: Tệp âm thanh vi phạm bản quyền..." : "Ví dụ: Cần bổ sung metadata, sửa đoạn intro..."}
              />
            </div>

            {moderationMode === "revision" && (
              <div className="mb-3">
                <label className="form-label fw-medium">Các điểm cần chỉnh sửa</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={revisionPointsText}
                  onChange={(event) => onRevisionPointsChange(event.target.value)}
                  placeholder="Nhập mỗi dòng một góp ý hoặc ngăn cách bằng dấu phẩy"
                />
                <div className="form-text">Có thể nhập nhiều dòng để gửi từng yêu cầu rõ ràng cho nghệ sĩ.</div>
              </div>
            )}
          </div>
          <div className="modal-footer border-top-0 pt-0">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={submitting}>Hủy</button>
            <button
              type="button"
              className={`btn ${moderationMode === "reject" ? "btn-danger" : "btn-warning"}`}
              onClick={onSubmitModeration}
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : moderationMode === "reject" ? "Xác nhận từ chối" : "Gửi yêu cầu chỉnh sửa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModerationDetailModal;