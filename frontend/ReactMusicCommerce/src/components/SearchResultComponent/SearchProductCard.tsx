import { Link } from "react-router-dom";
import type { AudioTrackSearchDocument } from "../../models/Search";


interface SearchProductCardProps {
  track: AudioTrackSearchDocument;
}

const SearchProductCard = ({ track }: SearchProductCardProps) => {
  const firstPrice = track.pricesVnd?.[0] ?? 0;
  const numericId = Number(track.id);
  const detailPath = Number.isNaN(numericId)
    ? undefined
    : `/detail-product/${numericId}`;

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div className="product-item music-card h-100" data-aos="fade-up">
        <div className="product-image">
          <img
            src={track.coverImage || "/assets/img/music-logo.png"}
            className="img-fluid rounded-3"
            alt={track.title}
            style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
            loading="lazy"
          />
        </div>

        <div className="product-info mt-3">
          <div className="product-category text-muted small mb-1">
            {track.genres?.length ? track.genres.join(" / ") : "Không có thể loại"}
          </div>

          <h5 className="product-name mb-1">
            {detailPath ? (
              <Link to={detailPath} className="text-decoration-none text-dark fw-bold">
                {track.title}
              </Link>
            ) : (
              <span className="text-dark fw-bold">{track.title}</span>
            )}
          </h5>

          <div className="artist-name text-primary mb-2">
            <i className="bi bi-mic-fill me-1"></i>
            {track.artistName || "Không rõ nghệ sĩ"}
          </div>

          {track.description && (
            <p className="small text-muted mb-2" style={{ minHeight: "40px" }}>
              {track.description.length > 90
                ? `${track.description.slice(0, 90)}...`
                : track.description}
            </p>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <div className="product-price fw-semibold">
              {firstPrice > 0
                ? `${firstPrice.toLocaleString("vi-VN")}đ`
                : "Liên hệ giá"}
            </div>
            <div className="small text-muted d-flex align-items-center gap-1">
              <i className="bi bi-play-circle"></i>
              {track.playCount ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProductCard;
