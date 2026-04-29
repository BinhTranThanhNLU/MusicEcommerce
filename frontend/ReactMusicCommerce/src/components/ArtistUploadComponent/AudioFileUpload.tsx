import React, { useRef } from "react";

interface Props {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  error?: string;
}

const AudioFileUpload: React.FC<Props> = ({
  audioFile,
  setAudioFile,
  error,
}) => {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverRef.current)
      dragOverRef.current.classList.remove(
        "border-primary",
        "bg-primary",
        "bg-opacity-10",
      );
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("audio/")) {
      setAudioFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragOverRef.current)
      dragOverRef.current.classList.add(
        "border-primary",
        "bg-primary",
        "bg-opacity-10",
      );
  };

  const handleDragLeave = () => {
    if (dragOverRef.current)
      dragOverRef.current.classList.remove(
        "border-primary",
        "bg-primary",
        "bg-opacity-10",
      );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      setAudioFile(e.currentTarget.files[0]);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-file-earmark-music me-2 text-primary"></i> File Âm
          Thanh Gốc
        </h5>
        <div
          ref={dragOverRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="border border-2 border-dashed rounded-4 p-5 text-center bg-light transition"
          style={{
            borderColor: "#dee2e6",
            borderStyle: "dashed",
            cursor: "pointer",
          }}
        >
          <div className="mb-3">
            <i
              className="bi bi-cloud-arrow-up text-primary"
              style={{ fontSize: "3rem" }}
            ></i>
          </div>
          <h6 className="fw-bold">Kéo thả file âm thanh vào đây</h6>
          <p className="text-muted small mb-3">
            Hỗ trợ định dạng: WAV, FLAC, MP3 (Tối đa 100MB)
          </p>
          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            className="btn btn-primary rounded-pill px-4"
          >
            Chọn File Máy Tính
          </button>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>

        {error && (
          <div className="alert alert-danger small mt-2 mb-0">
            <i className="bi bi-exclamation-circle me-1"></i> {error}
          </div>
        )}

        {audioFile && (
          <div className="mt-4 p-3 border rounded-3 d-flex align-items-center justify-content-between bg-white">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                <i className="bi bi-music-note-beamed fs-4"></i>
              </div>
              <div>
                <h6 className="mb-0 fw-bold">{audioFile.name}</h6>
                <small className="text-muted">
                  {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                </small>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAudioFile(null)}
              className="btn btn-sm btn-outline-danger border-0"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioFileUpload;
