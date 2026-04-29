import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAudioTrackById } from "../../apis/audioTrackApi";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import "../../assets/css/artistDashboard.css";
import { parseApiError } from "../../utils/apiError";
import { getStatusTone } from "../../utils/formatHelpers";
import TrackBasicInfo from "../../components/ViewTrackComponent/TrackBasicInfo";
import TrackMetadata from "../../components/ViewTrackComponent/TrackMetadata";
import TrackSidebar from "../../components/ViewTrackComponent/TrackSidebar";
import TrackStats from "../../components/ViewTrackComponent/TrackStats";
import TrackTextContent from "../../components/ViewTrackComponent/TrackTextContent";


const ViewTrackPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [track, setTrack] = useState<AudioTrackModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTrack = async () => {
      const trackId = Number(id);
      if (!id || Number.isNaN(trackId)) {
        setErrorMessage("Thiếu hoặc sai ID tác phẩm.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getAudioTrackById(trackId);
        setTrack(data);
      } catch (error: any) {
        setErrorMessage(parseApiError(error, "Không thể tải chi tiết tác phẩm.").message);
      } finally {
        setIsLoading(false);
      }
    };
    void loadTrack();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container-fluid py-4 px-lg-4 artist-page-shell">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body py-5 text-center">
            <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
            <p className="mb-0 text-muted">Đang tải chi tiết tác phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !track) {
    return (
      <div className="container-fluid py-4 px-lg-4 artist-page-shell">
        <div className="alert alert-danger border-0 shadow-sm rounded-4 d-flex justify-content-between align-items-center">
          <div>{errorMessage || "Không tìm thấy tác phẩm."}</div>
          <button className="btn btn-outline-danger" onClick={() => navigate("/artist/tracks")}>Quay lại</button>
        </div>
      </div>
    );
  }

  const statusText = track.status ?? (track.uploadDate ? "Đang xuất bản" : "Đang chờ duyệt");
  const statusTone = getStatusTone(track.status ?? (track.uploadDate ? "approved" : "pending"));

  return (
    <div className="container-fluid py-4 px-lg-4 artist-page-shell">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h3 className="artist-page-title fw-bold mb-1" style={{ color: "var(--heading-color)", fontFamily: "var(--heading-font)" }}>
            Chi tiết tác phẩm
          </h3>
          <p className="artist-page-subtitle text-muted mb-0">Xem toàn bộ thông tin, file đính kèm và trạng thái xuất bản.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate("/artist/tracks")}>
            <i className="bi bi-arrow-left me-2"></i> Quay lại
          </button>
          <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "var(--accent-color)" }} onClick={() => navigate(`/artist/tracks/update/${track.id}`)}>
            <i className="bi bi-pencil-square me-2"></i> Cập nhật
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="row g-4">
        <div className="col-lg-4">
          <TrackSidebar track={track} statusTone={statusTone} statusText={statusText} />
        </div>
        <div className="col-lg-8">
          <TrackStats track={track} />
          <TrackBasicInfo track={track} />
          <TrackTextContent track={track} />
          <TrackMetadata track={track} />
        </div>
      </div>
    </div>
  );
};

export default ViewTrackPage;