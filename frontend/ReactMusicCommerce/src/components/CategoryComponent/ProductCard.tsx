import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { Link, useNavigate } from "react-router-dom";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import Swal from "sweetalert2";
import { addToCart } from "../../apis/cartApi";
import { CART_ITEMS_UPDATED_EVENT } from "../../utils/cartStorage";

interface Props {
  track: AudioTrackModel;
}

const ProductCard: React.FC<Props> = ({ track }) => {
  const { currentTrack, isPlaying, togglePlayPause, getDisplayPlayCount } = useAudioPlayer();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  // Kiểm tra xem bài hát hiện tại có phải là bài hát này không
  const isCurrentTrack = currentTrack?.id === track.id;
  const trackIsPlaying = isCurrentTrack && isPlaying;
  const displayPlayCount = getDisplayPlayCount(track.id, track.playCount);

  const handlePlayToggle = () => {
    togglePlayPause(track);
  };

  const handleQuickAddToCart = async () => {
    const defaultLicenseId = track.licenses?.[0]?.licenseId;

    if (!defaultLicenseId) {
      const result = await Swal.fire({
        icon: "info",
        title: "Chọn giấy phép trước khi mua",
        text: "Track này cần chọn loại giấy phép. Chuyển tới trang chi tiết để tiếp tục.",
        showCancelButton: true,
        confirmButtonText: "Xem chi tiết",
        cancelButtonText: "Để sau",
      });

      if (result.isConfirmed) {
        navigate(`/detail-product/${track.id}`);
      }
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await addToCart({
        audioId: track.id,
        licenseId: defaultLicenseId,
      });

      window.dispatchEvent(new Event(CART_ITEMS_UPDATED_EVENT));

      await Swal.fire({
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        icon: response.alreadyInCart ? "info" : "success",
        title: response.alreadyInCart ? "Đã có sẵn trong giỏ" : "Đã thêm vào giỏ",
        text: track.title,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể thêm vào giỏ hàng";

      await Swal.fire({
        icon: "error",
        title: "Thêm vào giỏ thất bại",
        text: errorMessage,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="product-card h-100 d-flex flex-column">
      {/* === PHẦN HÌNH ẢNH & PLAY === */}
      <div className="product-image position-relative rounded-3 overflow-hidden shadow-sm">
        {/* Badge */}
        <div className="position-absolute top-0 start-0 m-2 badge bg-danger z-1">
          Mới
        </div>

        <img
          src={track.coverImage}
          alt={track.title}
          className="img-fluid w-100"
          loading="lazy"
          style={{ aspectRatio: "1/1", objectFit: "cover" }}
        />

        {/* Overlay Actions: Nút Play to ở giữa */}
        <div
          className="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: trackIsPlaying ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)",
            opacity: trackIsPlaying ? 1 : "",
            transition: "all 0.3s ease",
          }}
        >
          <button
            className="btn btn-primary rounded-circle d-flex justify-content-center align-items-center shadow"
            onClick={handlePlayToggle}
            style={{ width: "50px", height: "50px", fontSize: "20px" }}
          >
            <i
              className={`bi ${trackIsPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
            ></i>
          </button>
        </div>

        {/* Nút thêm vào giỏ nhanh ở góc dưới */}
        <button
          className="position-absolute bottom-0 start-0 w-100 btn btn-dark py-2 border-0"
          style={{ borderRadius: "0 0 0.5rem 0.5rem", opacity: 0.95 }}
          type="button"
          onClick={handleQuickAddToCart}
          disabled={isAddingToCart}
        >
          <div className="d-flex justify-content-between px-3 align-items-center">
            <span className="small">
              <i className="bi bi-cart-plus me-1"></i>
              {isAddingToCart ? "Đang thêm" : "Mua"}
            </span>
            <span className="fw-bold">
              {track.startingPrice?.toLocaleString()} ₫
            </span>
          </div>
        </button>
      </div>

      {/* === PHẦN THÔNG TIN BÀI HÁT === */}
      <div className="product-details mt-3 px-1 flex-grow-1 d-flex flex-column">
        {/* Thể loại nhạc (Genre) */}
        <div className="text-muted small mb-1 text-truncate">
          {track.tags?.genres?.join(" / ") || "Âm nhạc"}
        </div>

        {/* Tên bài hát */}
        <h6 className="product-title mb-1 text-truncate" title={track.title}>
          <Link to={`/detail-product/${track.id}`} className="text-decoration-none text-dark fw-bold">
            {track.title}
          </Link>
        </h6>

        {/* Tên Nghệ sĩ */}
        <div className="artist-name text-primary small mb-2 text-truncate">
          <i className="bi bi-mic-fill me-1"></i>
          {track.artist?.name || "Nghệ sĩ ẩn danh"}
        </div>

        {/* Play Count (Đặc trưng của Category) và Actions phụ */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <div
            className="text-muted small d-flex align-items-center"
            title="Lượt nghe"
          >
            <i className="bi bi-headphones me-1"></i>
            <span>{displayPlayCount?.toLocaleString() || 0}</span>
          </div>

          {/* Nút yêu thích */}
          <button className="btn btn-sm text-danger border-0 p-0 shadow-none">
            <i className="bi bi-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
