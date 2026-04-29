import React, { useRef } from "react";
import type { UpdateAudioTrackRequest } from "../../../requestmodel/UpdateAudioTrackRequest";

interface Props {
  form: UpdateAudioTrackRequest;
  trackCover: string | undefined;
  resolveMediaUrl: (path: string | null | undefined) => string;
}

const UpdateMediaManager: React.FC<Props> = ({
  form,
  trackCover,
  resolveMediaUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
          <div className="d-flex align-items-center justify-content-between mt-2">
            <span
              className="text-muted text-truncate me-3"
              style={{ maxWidth: "200px" }}
            >
              {form.originalFileUrl
                ? form.originalFileUrl.split("/").pop()
                : "Chưa có file"}
            </span>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-sm btn-outline-primary rounded-pill"
              >
                <i className="bi bi-upload me-1"></i> Tải file mới
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) => {
                  // TODO: Xử lý lưu state file Audio mới tại đây
                  console.log("Đã chọn file audio mới", e.target.files?.[0]);
                }}
              />
            </div>
          </div>
        </div>

        {/* Khu vực đổi Ảnh Bìa */}
        <div className="mb-3 p-3 border rounded-3 bg-light">
          <label className="form-label fw-bold">
            <i className="bi bi-image text-success me-2"></i>Ảnh Bìa (Cover)
          </label>
          <div className="d-flex align-items-center mt-2">
            <img
              src={resolveMediaUrl(form.coverImage || trackCover)}
              alt="Current Cover"
              className="rounded me-3 border"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="btn btn-sm btn-outline-success rounded-pill"
            >
              <i className="bi bi-camera me-1"></i> Đổi ảnh bìa
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                // TODO: Xử lý lưu state file Ảnh mới tại đây
                console.log("Đã chọn ảnh bìa mới", e.target.files?.[0]);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMediaManager;
