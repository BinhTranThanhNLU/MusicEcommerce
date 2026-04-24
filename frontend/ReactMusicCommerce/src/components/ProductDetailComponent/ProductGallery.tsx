import type React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

interface ProductGalleryProps {
  track: AudioTrackModel;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ track }) => {
  const { currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const trackIsPlaying = isCurrentTrack && isPlaying;

  // Hàm format giây thành phút:giây (VD: 225s -> 3:45)
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="col-lg-5" data-aos="zoom-in" data-aos-delay="150">
      <div className="product-gallery">
        <div className="main-showcase position-relative mb-3">
          <img
            src={track.coverImage || "https://placehold.co/500x500"}
            alt={track.title}
            className="img-fluid rounded shadow-sm w-100"
          />
          {/* Overlay báo hiệu bản nghe thử có Watermark */}
          <div className="position-absolute top-0 start-0 m-3 badge bg-dark opacity-75">
            <i className="bi bi-shield-lock me-1"></i> Watermarked Preview
          </div>
        </div>

        {/* Trình phát âm thanh */}
        <div className="audio-player-container bg-light p-3 rounded">
          <div className="d-flex align-items-center mb-2">
            <button
              type="button"
              className={`btn rounded-circle play-btn me-3 ${
                trackIsPlaying ? "btn-danger" : "btn-primary"
              }`}
              onClick={() => togglePlayPause(track)}
              style={{ width: "50px", height: "50px" }}
            >
              <i
                className={`bi fs-4 ${
                  trackIsPlaying ? "bi-pause-fill" : "bi-play-fill"
                }`}
              ></i>
            </button>
            <div className="w-100">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">0:00</small>
                <small className="text-muted">{formatDuration(track.duration)}</small>
              </div>
              <div className="progress" style={{ height: "5px", cursor: "default" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-center text-muted small mb-0 mt-2">
            <i className="bi bi-info-circle me-1"></i> Bản nghe thử đã được chèn
            âm thanh bảo vệ bản quyền.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
