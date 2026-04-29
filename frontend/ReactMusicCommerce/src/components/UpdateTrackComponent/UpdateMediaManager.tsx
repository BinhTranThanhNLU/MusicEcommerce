import React, { useRef } from "react";
import type { UpdateAudioTrackRequest } from "../../requestmodel/UpdateAudioTrackRequest";

interface Props {
  form: UpdateAudioTrackRequest;
  trackCover: string | undefined;
  coverPreview: string | null;
  originalFile: File | null;
  resolveMediaUrl: (path: string | null | undefined) => string;
  onOriginalFileChange: (file: File | null) => void;
  onCoverImageChange: (file: File | null) => void;
}

const UpdateMediaManager: React.FC<Props> = ({
  form,
  trackCover,
  coverPreview,
  originalFile,
  resolveMediaUrl,
  onOriginalFileChange,
  onCoverImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const currentOriginalLabel = originalFile?.name || form.originalFileUrl?.split("/").pop() || "Chưa chọn file mới";
  const currentCoverPreview = coverPreview || resolveMediaUrl(form.coverImage || trackCover);

  return (
    <div className="card border-0 shadow-sm rounded-4 artist-focus-card">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Quản lý File & Ảnh bìa</h5>

        {/* Khu vực đổi File Gốc */}
        <div className="mb-4 p-3 border rounded-3 bg-light">
          <label className="form-label fw-bold">
            <i className="bi bi-file-earmark-music text-primary me-2"></i> File
            Gốc (Original)
          </label>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2">
            <span className="text-muted text-truncate" style={{ maxWidth: "260px" }}>
              {currentOriginalLabel}
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-sm btn-outline-primary rounded-pill"
              >
                <i className="bi bi-upload me-1"></i> Chọn file mới
              </button>
              {originalFile && (
                <button
                  type="button"
                  onClick={() => onOriginalFileChange(null)}
                  className="btn btn-sm btn-outline-secondary rounded-pill"
                >
                  Bỏ chọn
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) => {
                  onOriginalFileChange(e.target.files?.[0] ?? null);
                }}
              />
            </div>
          </div>
          {originalFile && (
            <div className="small text-success mt-2">
              Đã chọn: {originalFile.name}
            </div>
          )}
        </div>

        {/* Khu vực đổi Ảnh Bìa */}
        <div className="mb-3 p-3 border rounded-3 bg-light">
          <label className="form-label fw-bold">
            <i className="bi bi-image text-success me-2"></i>Ảnh Bìa (Cover)
          </label>
          <div className="d-flex align-items-center gap-3 mt-2 flex-wrap">
            <img
              src={currentCoverPreview}
              alt="Current Cover"
              className="rounded me-3 border"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="btn btn-sm btn-outline-success rounded-pill"
              >
                <i className="bi bi-camera me-1"></i> Đổi ảnh bìa
              </button>
              {coverPreview && (
                <button
                  type="button"
                  onClick={() => onCoverImageChange(null)}
                  className="btn btn-sm btn-outline-secondary rounded-pill"
                >
                  Bỏ chọn
                </button>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                onCoverImageChange(e.target.files?.[0] ?? null);
              }}
            />
          </div>
          {coverPreview && (
            <div className="small text-success mt-2">Đã chọn ảnh bìa mới.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateMediaManager;
