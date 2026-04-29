import React from "react";
import type { UpdateAudioTrackRequest } from "../../requestmodel/UpdateAudioTrackRequest";
import type { AudioTrackModel } from "../../models/AudioTrackModel";

interface Props {
  form: UpdateAudioTrackRequest;
  track: AudioTrackModel;
  coverPreview: string | null;
  resolveMediaUrl: (path: string | null | undefined) => string;
}

const UpdateSidebar: React.FC<Props> = ({ form, track, coverPreview, resolveMediaUrl }) => {
  return (
    <>
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden artist-focus-card">
        <img
          src={coverPreview || resolveMediaUrl(form.coverImage || track.coverImage)}
          alt={track.title}
          className="w-100"
          style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
        />
        <div className="card-body p-4">
          <h5 className="fw-bold mb-2">{track.title}</h5>
          <p className="text-muted small mb-0">{track.artist?.name}</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Ghi chú</h5>
          <p className="text-muted small mb-0">
            Thay đổi sẽ được gửi ngay tới API cập nhật. Hãy kiểm tra kỹ thông
            tin và trạng thái trước khi lưu.
          </p>
        </div>
      </div>
    </>
  );
};

export default UpdateSidebar;
