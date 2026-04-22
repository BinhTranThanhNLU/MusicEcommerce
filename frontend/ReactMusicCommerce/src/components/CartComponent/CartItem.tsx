import { useEffect, useState } from "react";
import { getAudioTrackById } from "../../apis/audioTrackApi";
import type { AudioTrackLicenseModel } from "../../models/AudioTrackLicenseModel";
import type { CartItemDetailResponse } from "../../responsemodel/CartItemDetailResponse";

interface CartItemProps {
  item: CartItemDetailResponse;
  onRemoveItem: (cartItemId: number) => void | Promise<void>;
  onUpdateItemLicense: (cartItemId: number, licenseId: number) => void | Promise<void>;
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

const CartItem = ({
  item,
  onRemoveItem,
  onUpdateItemLicense,
  isMutating = false,
}: CartItemProps) => {
  const imageSrc = item.coverImage || "/assets/img/product/product-1.webp";
  const [licenses, setLicenses] = useState<AudioTrackLicenseModel[]>([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState(item.licenseId);

  useEffect(() => {
    setSelectedLicenseId(item.licenseId);
  }, [item.licenseId]);

  useEffect(() => {
    const loadLicenses = async () => {
      setIsLoadingLicenses(true);
      try {
        const track = await getAudioTrackById(item.audioId);
        setLicenses(track.licenses || []);
      } catch {
        setLicenses([]);
      } finally {
        setIsLoadingLicenses(false);
      }
    };

    void loadLicenses();
  }, [item.audioId]);

  const handleLicenseChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextLicenseId = Number(event.target.value);
    if (!nextLicenseId || nextLicenseId === item.licenseId) {
      return;
    }

    setSelectedLicenseId(nextLicenseId);
    await onUpdateItemLicense(item.cartItemId, nextLicenseId);
  };

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
            <div className="mt-2">
              <select
                className="form-select form-select-sm"
                value={selectedLicenseId}
                onChange={handleLicenseChange}
                disabled={isMutating || isLoadingLicenses || licenses.length === 0}
              >
                {licenses.length > 0 ? (
                  licenses.map((license) => (
                    <option key={license.licenseId} value={license.licenseId}>
                      {license.licenseType}
                    </option>
                  ))
                ) : (
                  <option value={item.licenseId}>Không có tùy chọn khác</option>
                )}
              </select>
            </div>
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