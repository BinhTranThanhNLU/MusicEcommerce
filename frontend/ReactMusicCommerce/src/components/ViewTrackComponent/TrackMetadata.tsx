import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { formatCurrency } from "../../utils/formatHelpers";

interface Props {
  track: AudioTrackModel;
}

const TrackMetadata: React.FC<Props> = ({ track }) => {
  return (
    <>
      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Tags và thể loại</h5>
          <div className="d-flex flex-wrap gap-2">
            {(track.tags?.genres ?? []).map((genre) => (
              <span key={`detail-genre-${genre}`} className="badge bg-secondary bg-opacity-10 text-secondary border fw-normal">
                {genre}
              </span>
            ))}
            {(track.tags?.moods ?? []).map((mood) => (
              <span key={`detail-mood-${mood}`} className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 fw-normal">
                {mood}
              </span>
            ))}
            {!(track.tags?.genres?.length || track.tags?.moods?.length) && (
              <span className="text-muted">Chưa có metadata.</span>
            )}
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Giấy phép</h5>
          <div className="row g-3">
            {(track.licenses ?? []).map((license) => (
              <div className="col-md-4" key={license.licenseId}>
                <div className="border rounded-3 p-3 h-100">
                  <div className="fw-bold mb-1">{license.licenseType}</div>
                  <div className="text-muted small mb-2">{license.description || "Không có mô tả."}</div>
                  <div className="fw-semibold">{formatCurrency(license.price)}</div>
                </div>
              </div>
            ))}
            {(!track.licenses || track.licenses.length === 0) && (
              <div className="col-12 text-muted">Tác phẩm này chưa có giấy phép.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackMetadata;