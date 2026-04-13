import { useState } from "react";

const ProductCard = () => {
    // State giả lập trạng thái đang nghe thử
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    // Sau này sẽ tích hợp logic gọi xuống Global Audio Player tại đây
    console.log(isPlaying ? "Pause preview" : "Play preview");
  };

  return (
    <div className="col-lg-3 col-md-6" data-aos="fade-up">
      <div className="product-item music-card">
        {/* === PHẦN HÌNH ẢNH & PLAY === */}
        <div className="product-image position-relative">
          {/* Badge: Ví dụ 'Mới' hoặc 'Exclusive' */}
          <div className="product-badge bg-danger">Mới</div>
          
          <img
            src="data:image/jpeg;base64,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" 
            // Lưu ý: Nên thay bằng ảnh vuông (Cover Art)
            alt="Album Cover"
            className="img-fluid rounded-3"
            loading="lazy"
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
          />

          {/* Overlay Actions: Nút Play to ở giữa */}
          <div className="product-actions d-flex justify-content-center align-items-center h-100 w-100 position-absolute top-0 start-0" 
               style={{ backgroundColor: "rgba(0,0,0,0.3)", opacity: 0, transition: "0.3s" }}>
            
            {/* Nút Play/Pause chính */}
            <button 
              className="btn btn-primary rounded-circle d-flex justify-content-center align-items-center"
              onClick={handlePlayToggle}
              style={{ width: "60px", height: "60px", fontSize: "24px" }}
            >
              <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>
            </button>
          </div>

          {/* Nút thêm vào giỏ nhanh ở góc dưới */}
          <button className="cart-btn position-absolute bottom-0 start-0 w-100 btn btn-dark py-2" 
                  style={{ borderRadius: "0 0 0.5rem 0.5rem" }}>
            <i className="bi bi-cart-plus me-2"></i>
            {/* Giá tiền cho giấy phép cơ bản  */}
            <span>150.000₫</span>
          </button>
        </div>

        {/* === PHẦN THÔNG TIN BÀI HÁT === */}
        <div className="product-info mt-3">
          {/* Thể loại nhạc (Genre) */}
          <div className="product-category text-muted small mb-1">Pop / Ballad</div>
          
          {/* Tên bài hát */}
          <h5 className="product-name mb-1">
            <a href="#" className="text-decoration-none text-dark fw-bold">
              Cơn Mưa Ngang Qua
            </a>
          </h5>

          {/* Tên Nghệ sĩ (Bắt buộc phải có trong Music Commerce) */}
          <div className="artist-name text-primary mb-2">
            <i className="bi bi-mic-fill me-1"></i>
            Sơn Tùng M-TP
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
