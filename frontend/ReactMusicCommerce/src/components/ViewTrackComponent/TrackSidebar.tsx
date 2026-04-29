import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { resolveMediaUrl, formatDuration } from "../../utils/formatHelpers";


interface Props {
  track: AudioTrackModel;
  statusTone: string;
  statusText: string;
}

const TrackSidebar: React.FC<Props> = ({ track, statusTone, statusText }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 artist-focus-card">
      <img
        src={resolveMediaUrl(track.coverImage)}
        alt={track.title}
        className="w-100"
        style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
      />
      <div className="card-body p-4">
        <span className={`badge rounded-pill px-3 py-2 bg-${statusTone} bg-opacity-10 text-${statusTone} border border-${statusTone} border-opacity-25 mb-3`}>
          {statusText}
        </span>
        <h4 className="fw-bold mb-2">{track.title}</h4>
        <p className="text-muted mb-3">{track.description || "Chưa có mô tả cho tác phẩm này."}</p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="badge bg-light text-dark border">{track.audioType}</span>
          <span className="badge bg-light text-dark border">{formatDuration(track.duration)}</span>
          <span className="badge bg-light text-dark border">{track.artist?.name}</span>
        </div>

        <div className="d-grid gap-2">
          <a className="btn btn-outline-primary" href={resolveMediaUrl(track.watermarkedFileUrl)} target="_blank" rel="noreferrer">
            <i className="bi bi-play-circle me-2"></i> Mở file nghe thử
          </a>
          <a className="btn btn-outline-secondary" href={resolveMediaUrl(track.originalFileUrl ?? null)} target="_blank" rel="noreferrer">
            <i className="bi bi-file-earmark-music me-2"></i> Mở file gốc
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrackSidebar;