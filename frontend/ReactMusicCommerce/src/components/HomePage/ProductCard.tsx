import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

const ProductCard: React.FC<{ track: AudioTrackModel }> = ({ track }) => {
  const { currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();

  // Kiểm tra xem bài hát hiện tại có phải là bài hát này không
  const isCurrentTrack = currentTrack?.id === track.id;
  const trackIsPlaying = isCurrentTrack && isPlaying;

  const handlePlayToggle = () => {
    togglePlayPause(track);
  };

  return (
    <div className="col-lg-3 col-md-6" data-aos="fade-up">
      <div className="product-item music-card">
        {/* === PHẦN HÌNH ẢNH & PLAY === */}
        <div className="product-image position-relative">
          {/* Badge: Ví dụ 'Mới' hoặc 'Exclusive' */}
          <div className="product-badge bg-danger">Mới</div>

          <img
            src={`${track.coverImage}`}
            // Nên thay bằng ảnh vuông (Cover Art)
            alt={track.title}
            className="img-fluid rounded-3"
            loading="lazy"
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
          />

          {/* Overlay Actions: Nút Play to ở giữa */}
          <div
            className="product-actions d-flex justify-content-center align-items-center h-100 w-100 position-absolute top-0 start-0"
            style={{
              backgroundColor: trackIsPlaying ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.3)",
              opacity: trackIsPlaying ? 1 : 0,
              transition: "0.3s",
            }}
          >
            {/* Nút Play/Pause chính */}
            <button
              className="btn btn-primary rounded-circle d-flex justify-content-center align-items-center"
              onClick={handlePlayToggle}
              style={{ width: "60px", height: "60px", fontSize: "24px" }}
            >
              <i
                className={`bi ${trackIsPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
              ></i>
            </button>
          </div>

          {/* Nút thêm vào giỏ nhanh ở góc dưới */}
          <button
            className="cart-btn position-absolute bottom-0 start-0 w-100 btn btn-dark py-2"
            style={{ borderRadius: "0 0 0.5rem 0.5rem" }}
          >
            <i className="bi bi-cart-plus me-2"></i>
            {/* Giá tiền cho giấy phép cơ bản  */}
            <span>{track.startingPrice?.toLocaleString()}₫</span>
          </button>
        </div>

        {/* === PHẦN THÔNG TIN BÀI HÁT === */}
        <div className="product-info mt-3">
          {/* Thể loại nhạc (Genre) */}
          <div className="product-category text-muted small mb-1">
            {" "}
            {track.tags?.genres?.join(" / ") || "Unknown"}
          </div>

          {/* Tên bài hát */}
          <h5 className="product-name mb-1">
            <a href="#" className="text-decoration-none text-dark fw-bold">
              {track.title}
            </a>
          </h5>

          {/* Tên Nghệ sĩ*/}
          <div className="artist-name text-primary mb-2">
            <i className="bi bi-mic-fill me-1"></i>
            {track.artist?.name}
          </div>

          {/* Rating và Actions phụ */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="product-rating text-warning small">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
              <span className="text-muted ms-1">(24)</span>
            </div>

            {/* Nút yêu thích */}
            <button className="btn btn-sm btn-outline-danger border-0">
              <i className="bi bi-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
