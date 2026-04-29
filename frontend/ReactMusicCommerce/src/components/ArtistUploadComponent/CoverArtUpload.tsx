import React, { useRef } from "react";

interface Props {
  coverPreview: string | null;
  handleCoverImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const CoverArtUpload: React.FC<Props> = ({
  coverPreview,
  handleCoverImageSelect,
  error,
}) => {
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-3">Ảnh Bìa (Artwork)</h5>
        <div
          className="position-relative bg-light rounded-4 d-flex align-items-center justify-content-center border overflow-hidden"
          style={{ aspectRatio: "1/1", backgroundColor: "#f8f9fa" }}
        >
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="text-center text-muted">
              <i className="bi bi-image fs-1"></i>
              <p className="small mt-2 mb-0">
                Tỉ lệ 1:1 (Khuyến nghị 1000x1000px)
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="btn btn-light position-absolute bottom-0 end-0 m-3 shadow-sm rounded-circle"
            style={{ width: "40px", height: "40px" }}
          >
            <i className="bi bi-camera-fill text-dark"></i>
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageSelect}
            style={{ display: "none" }}
          />
        </div>
        {error && (
          <div className="alert alert-danger small mt-2 mb-0">
            <i className="bi bi-exclamation-circle me-1"></i>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverArtUpload;
