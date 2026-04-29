import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { formatDuration } from "../../utils/formatHelpers";


interface Props {
  track: AudioTrackModel;
}

const TrackStats: React.FC<Props> = ({ track }) => {
  return (
    <div className="row g-4 mb-4">
      <div className="col-md-3">
        <div className="card border-0 shadow-sm rounded-4 h-100 artist-summary-card">
          <div className="card-body text-center py-4">
            <div className="display-6 fw-bold text-primary">{track.playCount ?? 0}</div>
            <div className="text-muted small">Lượt nghe thử</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm rounded-4 h-100 artist-summary-card">
          <div className="card-body text-center py-4">
            <div className="display-6 fw-bold text-warning">{track.reviewCount ?? 0}</div>
            <div className="text-muted small">Lượt đánh giá</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm rounded-4 h-100 artist-summary-card">
          <div className="card-body text-center py-4">
            <div className="display-6 fw-bold text-success">{track.averageRating?.toFixed(1) ?? "-"}</div>
            <div className="text-muted small">Điểm trung bình</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm rounded-4 h-100 artist-summary-card">
          <div className="card-body text-center py-4">
            <div className="display-6 fw-bold text-dark">{formatDuration(track.duration)}</div>
            <div className="text-muted small">Thời lượng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackStats;