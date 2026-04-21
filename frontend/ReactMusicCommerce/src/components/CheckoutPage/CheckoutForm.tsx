import type { FormEvent } from "react";

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  paymentMethod: string;
  acceptedTerms: boolean;
}

interface CheckoutFormProps {
  values: CheckoutFormValues;
  totalAmount: number;
  isSubmitting: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPaymentMethodChange: (paymentMethod: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const paymentOptions = [
  {
    id: "VNPAY",
    icon: "bi bi-qr-code",
    label: "Cổng thanh toán VNPay",
  },
  {
    id: "MOMO",
    icon: "bi bi-phone",
    label: "Ví điện tử MoMo",
  },
  {
    id: "ZALOPAY",
    icon: "bi bi-chat-dots",
    label: "Ví ZaloPay",
  },
  {
    id: "BANK_TRANSFER",
    icon: "bi bi-bank",
    label: "Chuyển khoản ngân hàng",
  },
];

const CheckoutForm = ({
  values,
  totalAmount,
  isSubmitting,
  onInputChange,
  onPaymentMethodChange,
  onSubmit,
}: CheckoutFormProps) => {
  const submitDisabled = isSubmitting || !values.acceptedTerms;

  return (
    <div className="checkout-container" data-aos="fade-up">
      <form className="checkout-form" onSubmit={onSubmit}>
        {/* Customer Information */}
        <div className="checkout-section" id="customer-info">
          <div className="section-header">
            <div className="section-number">1</div>
            <h3>Thông tin khách hàng</h3>
          </div>
          <div className="section-content">
            <div className="row">
              <div className="col-md-6 form-group">
                <label htmlFor="first-name">Họ</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  id="first-name"
                  placeholder="Nhập họ của bạn"
                  value={values.firstName}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor="last-name">Tên</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  id="last-name"
                  placeholder="Nhập tên của bạn"
                  value={values.lastName}
                  onChange={onInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">
                Email (Link tải nhạc sẽ được gửi qua email này)
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Nhập email của bạn"
                value={values.email}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                id="phone"
                placeholder="Nhập số điện thoại"
                value={values.phone}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="checkout-section" id="payment-method">
          <div className="section-header">
            <div className="section-number">2</div>
            <h3>Phương thức thanh toán trực tuyến</h3>
          </div>
          <div className="section-content">
            <div className="payment-options">
              {paymentOptions.map((option) => {
                const elementId = `payment-${option.id.toLowerCase()}`;
                const isActive = values.paymentMethod === option.id;

                return (
                  <div
                    key={option.id}
                    className={`payment-option ${isActive ? "active" : ""}`.trim()}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      id={elementId}
                      checked={isActive}
                      onChange={() => onPaymentMethodChange(option.id)}
                    />
                    <label htmlFor={elementId}>
                      <span className="payment-icon">
                        <i className={option.icon}></i>
                      </span>
                      <span className="payment-label">{option.label}</span>
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Payment Details Context (Can be toggled via state in real implementation) */}
            <div className="payment-details" id="vnpay-details">
              <p className="payment-info">
                Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay an toàn để
                hoàn tất giao dịch.
              </p>
            </div>
          </div>
        </div>

        {/* Order Review */}
        <div className="checkout-section" id="order-review">
          <div className="section-header">
            <div className="section-number">3</div>
            <h3>Xác nhận cấp phép & Đặt hàng</h3>
          </div>
          <div className="section-content">
            <div className="form-check terms-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                name="acceptedTerms"
                checked={values.acceptedTerms}
                onChange={onInputChange}
                required
              />
              <label className="form-check-label" htmlFor="terms">
                Tôi xác nhận đã hiểu rõ quyền hạn sử dụng âm thanh và đồng ý với{" "}
                <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">
                  Điều khoản Bản quyền
                </a>{" "}
                và{" "}
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#privacyModal"
                >
                  Chính sách Bảo mật
                </a>
                .
              </label>
            </div>
            <div className="place-order-container mt-4">
              <button
                type="submit"
                className="btn btn-primary place-order-btn w-100 d-flex justify-content-between align-items-center p-3"
                disabled={submitDisabled}
              >
                <span className="btn-text">
                  {isSubmitting
                    ? "Đang xử lý thanh toán..."
                    : "Thanh Toán & Nhận Link Tải"}
                </span>
                <span className="btn-price fw-bold">{formatCurrency(totalAmount)}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
