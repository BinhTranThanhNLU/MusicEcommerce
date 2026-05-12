import React, { useState } from "react";
import Swal from "sweetalert2";
import type { UpdateAudioTrackRequest } from "../../requestmodel/UpdateAudioTrackRequest";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { resubmitMyAudioTrack } from "../../apis/artistApi";
import { parseApiError } from "../../utils/apiError";

interface Props {
  form: UpdateAudioTrackRequest;
  track: AudioTrackModel;
  coverPreview: string | null;
  resolveMediaUrl: (path: string | null | undefined) => string;
  onResubmitted?: () => void;
}

const UpdateSidebar: React.FC<Props> = ({ form, track, coverPreview, resolveMediaUrl, onResubmitted }) => {
  const [isResubmitting, setIsResubmitting] = useState(false);
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

      {track.status && track.status.toLowerCase() === "need revision" && (
        <div className="card border-0 shadow-sm rounded-4 mt-4">
          <div className="card-body p-4 d-flex flex-column gap-2">
            <h5 className="fw-bold mb-1">Trạng thái: {track.status}</h5>
            <p className="text-muted small mb-0">Bài hát đang ở trạng thái cần chỉnh sửa. Sau khi hoàn tất, hãy nộp lại để admin kiểm duyệt.</p>
            <div className="d-flex mt-3">
              <button
                className="btn btn-primary rounded-pill ms-auto"
                type="button"
                disabled={isResubmitting}
                onClick={async () => {
                  const result = await Swal.fire({
                    title: "Xác nhận nộp lại",
                    text: "Bạn có chắc muốn nộp lại bài hát này để admin kiểm duyệt?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Có, nộp lại",
                    cancelButtonText: "Hủy",
                  });

                  if (!result.isConfirmed) return;

                  try {
                    setIsResubmitting(true);
                    await resubmitMyAudioTrack(track.id as number);
                    await Swal.fire({ icon: "success", title: "Đã nộp lại", text: "Bài hát đã được nộp lại và chuyển sang trạng thái Pending." });
                    onResubmitted && onResubmitted();
                  } catch (error: any) {
                    await Swal.fire({ icon: "error", title: "Lỗi", text: parseApiError(error, "Không thể nộp lại.").message });
                  } finally {
                    setIsResubmitting(false);
                  }
                }}
              >
                {isResubmitting ? "Đang nộp..." : "Nộp lại"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateSidebar;
