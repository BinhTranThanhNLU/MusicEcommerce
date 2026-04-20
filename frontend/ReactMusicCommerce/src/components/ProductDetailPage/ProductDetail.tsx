import type React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import DigitalBenefitsList from "./DigitalBenefitsList";
import { useState } from "react";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

interface ProductDetailProps {
  track: AudioTrackModel;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ track }) => {
  const { currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();
  
  // Kiểm tra xem bài hát hiện tại có phải là bài hát này không
  const isCurrentTrack = currentTrack?.id === track.id;
  const trackIsPlaying = isCurrentTrack && isPlaying;
  
  // Gán mặc định giấy phép đầu tiên được chọn
  const [selectedLicenseId, setSelectedLicenseId] = useState<number>(
    track.licenses && track.licenses.length > 0
      ? track.licenses[0].licenseId
      : 0,
  );

  // Hàm format tiền tệ VNĐ
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm format giây thành phút:giây
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="col-lg-7" data-aos="fade-left" data-aos-delay="200">
      <div className="product-details p-lg-4">
        <div className="product-badge-container d-flex align-items-center justify-content-between mb-2">
          <span className="badge bg-secondary">{track.audioType}</span>
          <div className="rating-group text-warning">
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-half"></i>
            <span className="text-muted ms-2 small">
              ({track.playCount} lượt nghe)
            </span>
          </div>
        </div>

        <h1 className="product-name fs-3 fw-bold mb-1">{track.title}</h1>
        <p className="text-muted mb-3">
          Sáng tác bởi:{" "}
          <a href="#" className="text-decoration-none fw-medium">
            {track.artist?.name}
          </a>
        </p>

        {/* Thông tin metadata bài hát */}
        <div className="d-flex gap-3 mb-4 text-muted small align-items-center flex-wrap">
          <span>
            <i className="bi bi-music-note-list"></i>{" "}
            {track.tags?.genres?.join(", ") || "Đang cập nhật"}
          </span>
          <span>
            <i className="bi bi-stopwatch"></i> {formatDuration(track.duration)}
          </span>
          <span>
            <i className="bi bi-emoji-smile"></i> Cảm xúc:{" "}
            {track.tags?.moods?.join(", ") || "Đang cập nhật"}
          </span>
          
          {/* Nút phát nhạc preview */}
          <button
            className={`btn btn-sm rounded-pill d-flex align-items-center gap-2 ms-auto ${
              trackIsPlaying
                ? "btn-danger"
                : "btn-outline-primary"
            }`}
            onClick={() => togglePlayPause(track)}
          >
            <i className={`bi ${trackIsPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>
            {trackIsPlaying ? "Dừng" : "Nghe thử"}
          </button>
        </div>

        <div className="product-description mb-4">
          <p>
            Bản nhạc mang âm hưởng hùng tráng, dồn dập, rất phù hợp làm nhạc nền
            cho các video trailer, phim hành động hoặc các dự án truyền thông
            cần sự kịch tính và cao trào.
          </p>
        </div>

        {/* Lựa chọn giấy phép bản quyền */}
        <div className="license-selection mb-4">
          <h6 className="fw-bold mb-3">Chọn loại giấy phép</h6>
          <div className="d-flex flex-column gap-2">
            {track.licenses?.map((license) => (
              <label
                key={license.licenseId}
                className={`border p-3 rounded d-flex justify-content-between align-items-center cursor-pointer ${selectedLicenseId === license.licenseId ? "border-primary shadow-sm" : "hover-shadow"}`}
              >
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    name="licenseType"
                    className="form-check-input me-3"
                    value={license.licenseId}
                    checked={selectedLicenseId === license.licenseId}
                    onChange={() => setSelectedLicenseId(license.licenseId)}
                  />
                  <div>
                    <div
                      className={`fw-bold ${selectedLicenseId === license.licenseId ? "text-primary" : ""}`}
                    >
                      Giấy phép {license.licenseType}
                    </div>
                    <small className="text-muted">{license.description}</small>
                  </div>
                </div>
                <div
                  className={`fw-bold fs-5 ${selectedLicenseId === license.licenseId ? "text-primary" : ""}`}
                >
                  {formatPrice(license.price)}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Purchase Options */}
        <div className="purchase-section d-flex gap-3 mb-4">
          <button className="btn btn-outline-primary py-2 px-4 flex-grow-1">
            <i className="bi bi-cart-plus me-2"></i> Thêm vào giỏ
          </button>
          <button className="btn btn-primary py-2 px-4 flex-grow-1">
            <i className="bi bi-lightning me-2"></i> Mua ngay
          </button>
          <button
            className="btn btn-light border py-2 px-3"
            title="Thêm vào yêu thích"
          >
            <i className="bi bi-heart"></i>
          </button>
        </div>

        <DigitalBenefitsList />
      </div>
    </div>
  );
};

export default ProductDetail;
