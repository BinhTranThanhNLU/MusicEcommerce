import type { CartItemDetailResponse } from "../../responsemodel/CartItemDetailResponse";

interface CartItemProps {
  item: CartItemDetailResponse;
  onRemoveItem: (cartItemId: number) => void | Promise<void>;
  isMutating?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const formatDuration = (durationSeconds?: number) => {
  if (durationSeconds === undefined || durationSeconds === null) {
    return "00:00";
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const CartItem = ({ item, onRemoveItem, isMutating = false }: CartItemProps) => {
  const imageSrc = item.coverImage || "/assets/img/product/product-1.webp";

  return (
    <div className="cart-item border-bottom py-3">
      <div className="row align-items-center">
        <div className="col-lg-6 col-12 mt-3 mt-lg-0 mb-lg-0 mb-3">
          <div className="product-info d-flex align-items-center">
            <div className="product-image me-3">
              <img
                src={imageSrc}
                alt={item.audioTitle}
                className="img-fluid rounded"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
            <div className="product-details">
              <h6 className="product-title mb-1">{item.audioTitle}</h6>
              <p className="product-artist text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                Nghệ sĩ: {item.artistName || "Đang cập nhật"}
              </p>
              <div className="product-meta mb-2">
                <span>Audio track</span>
                <span>Mã nhạc #{item.audioId}</span>
                <span>Thời lượng: {formatDuration(item.duration)}</span>
              </div>
              <div className="product-tags">
                <span>Đã có trong giỏ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-12 mt-3 mt-lg-0 text-center">
          <div className="price-tag">
            <span className="license-chip">{item.licenseType}</span>
            <span className="small text-muted">{item.licenseDescription}</span>
          </div>
        </div>

        <div className="col-lg-3 col-12 mt-3 mt-lg-0 text-center">
          <div className="item-total">
            <span className="fw-bold fs-5">{formatCurrency(item.price)}</span>
            <div className="mt-2">
              <button
                className="btn btn-outline-remove btn-sm"
                type="button"
                onClick={() => onRemoveItem(item.cartItemId)}
                disabled={isMutating}
              >
                <i className="bi bi-trash me-1"></i>
                Gỡ bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;