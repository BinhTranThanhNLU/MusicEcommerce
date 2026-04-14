import type React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";

interface Props {
  track: AudioTrackModel;
}

const ProductCard: React.FC<Props> = ({ track }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={track.coverImage}
          className="main-image img-fluid"
          alt={track.title}
        />

        <div className="product-overlay">
          <div className="product-actions">
            <button className="action-btn">
              <i className="bi bi-eye"></i>
            </button>
            <button className="action-btn">
              <i className="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="product-details">
        <div className="product-category">
          {track.tags?.genres?.[0] || "Music"}
        </div>

        <h4 className="product-title">
          {track.title}
        </h4>

        <div className="product-meta">
          <div className="product-price">
            ${track.startingPrice}
          </div>

          <div className="product-rating">
            <i className="bi bi-play-fill"></i>
            {track.playCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;