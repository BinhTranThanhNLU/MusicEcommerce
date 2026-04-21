import { Link } from "react-router-dom";
import type { CartResponse } from "../../responsemodel/CartResponse";

interface CartSummaryProps {
  cart: CartResponse | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const CartSummary = ({ cart }: CartSummaryProps) => {
  const total = cart?.totalPrice || 0;
  const totalItems = cart?.totalItems || 0;

  return (
    <div className="cart-summary p-4 bg-light rounded shadow-sm">
      <div className="summary-top-tag text-success mb-3">
        <i className="bi bi-shield-check me-2"></i>
        Thanh toán an toàn
      </div>

      <h4 className="summary-title mb-4">Tóm tắt đơn hàng</h4>

      <div className="summary-item d-flex justify-content-between mb-3">
        <span className="summary-label text-muted">Tạm tính ({totalItems} sản phẩm)</span>
        <span className="summary-value fw-medium">{formatCurrency(total)}</span>
      </div>

      <hr />

      <div className="summary-total d-flex justify-content-between mb-4 mt-3">
        <span className="summary-label fw-bold fs-5">Tổng cộng</span>
        <span className="summary-value fw-bold fs-5 text-primary">{formatCurrency(total)}</span>
      </div>

      <div className="checkout-button mb-3">
        {totalItems > 0 ? (
          <Link to="/checkout" className="btn btn-primary w-100 py-2 fs-6">
            Thanh toán ngay <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        ) : (
          <button className="btn btn-primary w-100 py-2 fs-6" type="button" disabled>
            Thanh toán ngay <i className="bi bi-arrow-right ms-1"></i>
          </button>
        )}
      </div>

      <div className="continue-shopping text-center mb-4">
        <Link to="/" className="text-decoration-none text-secondary">
          <i className="bi bi-arrow-left me-1"></i> Tiếp tục chọn nhạc
        </Link>
      </div>

      <ul className="summary-benefits list-unstyled text-muted" style={{ fontSize: "0.9rem" }}>
        <li className="mb-2">
          <i className="bi bi-cloud-download me-2"></i> Nhận file MP3 gốc sạch (không watermark)
        </li>
        <li className="mb-2">
          <i className="bi bi-file-earmark-text me-2"></i> Tự động cấp Giấy chứng nhận bản quyền PDF
        </li>
        <li>
          <i className="bi bi-music-note-list me-2"></i> Lưu trữ vĩnh viễn trong Thư viện cá nhân
        </li>
      </ul>

      <hr />

      <div className="payment-methods text-center mt-3">
        <p className="payment-title text-muted mb-2" style={{ fontSize: "0.85rem" }}>Phương thức thanh toán hỗ trợ</p>
        <div className="payment-icons fs-4 text-secondary">
          <i className="bi bi-credit-card me-3"></i>
          <i className="bi bi-paypal me-3"></i>
          <i className="bi bi-wallet2 me-3"></i>
          <i className="bi bi-bank"></i>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;