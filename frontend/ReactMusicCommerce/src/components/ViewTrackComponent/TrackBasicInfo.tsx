import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { formatCurrency, formatDateTime, resolveMediaUrl } from "../../utils/formatHelpers";

interface Props {
  track: AudioTrackModel;
}

const TrackBasicInfo: React.FC<Props> = ({ track }) => {
  return (
    <>
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Thông tin cơ bản</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="small text-muted">Nghệ sĩ</div>
              <div className="fw-medium">{track.artist?.name}</div>
            </div>
            <div className="col-md-6">
              <div className="small text-muted">Ngày đăng</div>
              <div className="fw-medium">{formatDateTime(track.uploadDate)}</div>
            </div>
            <div className="col-md-6">
              <div className="small text-muted">Loại âm thanh</div>
              <div className="fw-medium">{track.audioType}</div>
            </div>
            <div className="col-md-6">
              <div className="small text-muted">Giá khởi điểm</div>
              <div className="fw-medium">{formatCurrency(track.startingPrice)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">File và liên kết</h5>
          <div className="list-group list-group-flush">
            <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
              <span>File gốc</span>
              <a href={resolveMediaUrl(track.originalFileUrl ?? null)} target="_blank" rel="noreferrer">Mở file</a>
            </div>
            <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
              <span>File nghe thử</span>
              <a href={resolveMediaUrl(track.watermarkedFileUrl)} target="_blank" rel="noreferrer">Mở file</a>
            </div>
            <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
              <span>Ảnh bìa</span>
              <a href={resolveMediaUrl(track.coverImage)} target="_blank" rel="noreferrer">Mở ảnh</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackBasicInfo;