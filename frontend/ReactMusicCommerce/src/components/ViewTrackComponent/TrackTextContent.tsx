import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";

interface Props {
  track: AudioTrackModel;
}

const TrackTextContent: React.FC<Props> = ({ track }) => {
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">Mô tả</h5>
            <p className="text-muted mb-0" style={{ whiteSpace: "pre-line" }}>
              {track.description || "Chưa có mô tả."}
            </p>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">Lời bài hát</h5>
            <p className="text-muted mb-0" style={{ whiteSpace: "pre-line" }}>
              {track.lyrics || "Chưa có lời bài hát."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackTextContent;