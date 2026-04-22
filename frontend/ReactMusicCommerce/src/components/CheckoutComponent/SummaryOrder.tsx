import { Link } from "react-router-dom";
import type { CartResponse } from "../../responsemodel/CartResponse";

interface SummaryOrderProps {
  cart: CartResponse | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const SummaryOrder = ({ cart }: SummaryOrderProps) => {
  const totalItems = cart?.totalItems || 0;
  const totalAmount = cart?.totalPrice || 0;

  return (
    <div className="order-summary" data-aos="fade-left" data-aos-delay="200">
      <div className="order-summary-header">
        <h3>Tóm tắt đơn hàng</h3>
        <span className="item-count">{totalItems} tài nguyên âm thanh</span>
      </div>

      <div className="order-summary-content">
        <div className="order-items">
          {cart?.items?.length ? (
            cart.items.map((item) => (
              <div className="order-item mt-3" key={item.cartItemId}>
                <div className="order-item-image">
                  <img
                    src={item.coverImage || "/assets/img/product/product-1.webp"}
                    alt={item.audioTitle}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="order-item-details">
                  <h4 className="text-truncate">{item.audioTitle}</h4>
                  <p className="order-item-variant text-primary fw-medium">
                    Giấy phép: {item.licenseType}
                  </p>
                  <div className="order-item-price mt-2">
                    <span className="quantity">1 x</span>
                    <span className="price">{formatCurrency(item.price)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-3 border rounded bg-light">
              <p className="mb-2">Giỏ hàng đang trống.</p>
              <Link to="/cart" className="btn btn-outline-primary btn-sm">
                Quay lại giỏ hàng
              </Link>
            </div>
          )}
        </div>

        <div className="promo-code mt-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Mã giảm giá nghệ sĩ"
              aria-label="Mã giảm giá"
            />
            <button className="btn btn-outline-primary" type="button">
              Áp dụng
            </button>
          </div>
        </div>

        <div className="order-totals mt-4">
          <div className="order-subtotal d-flex justify-content-between mb-2">
            <span className="text-muted">Tạm tính</span>
            <span className="fw-medium">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="order-tax d-flex justify-content-between mb-2">
            <span className="text-muted">Phí dịch vụ</span>
            <span className="fw-medium">{formatCurrency(0)}</span>
          </div>
          <hr />
          <div className="order-total d-flex justify-content-between fs-5 fw-bold">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="secure-checkout mt-4 text-center">
          <div className="secure-checkout-header text-success mb-2">
            <i className="bi bi-shield-check me-2"></i>
            <span>Giao dịch an toàn & Bảo vệ bản quyền</span>
          </div>
          <p className="text-muted small">
            File âm thanh gốc chất lượng cao cùng giấy chứng nhận bản quyền sẽ
            khả dụng ngay sau khi thanh toán thành công.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryOrder;
