import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { checkout, getCart } from "../../apis/cartApi";
import CheckoutForm, {
  type CheckoutFormValues,
} from "../../components/CheckoutPage/CheckoutForm";
import SummaryOrder from "../../components/CheckoutPage/SummaryOrder";
import TermAndPrivacy from "../../components/CheckoutPage/TermAndPrivacy";
import { ErrorMessage } from "../../components/utils/ErrorMessage";
import PageTitle from "../../components/utils/PageTitle";
import { SpinningLoading } from "../../components/utils/SpinningLoading";
import type { CheckoutRequest } from "../../requestmodel/CheckoutRequest";
import type { CartResponse } from "../../responsemodel/CartResponse";
import { CART_ITEMS_UPDATED_EVENT } from "../../utils/cartStorage";

const CheckoutPage = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "VNPAY",
    acceptedTerms: false,
  });

  useEffect(() => {
    const syncCart = async () => {
      setIsLoading(true);
      setHttpError(null);

      try {
        const response = await getCart();
        setCart(response);
      } catch (error: any) {
        setHttpError(error?.response?.data || error?.message || "Không tải được giỏ hàng.");
        setCart(null);
      } finally {
        setIsLoading(false);
      }
    };

    void syncCart();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePaymentMethodChange = (paymentMethod: string) => {
    setFormValues((prev) => ({ ...prev, paymentMethod }));
  };

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cart || cart.totalItems === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Giỏ hàng trống",
        text: "Vui lòng thêm sản phẩm trước khi thanh toán.",
      });
      return;
    }

    if (!formValues.acceptedTerms) {
      await Swal.fire({
        icon: "warning",
        title: "Chưa xác nhận điều khoản",
        text: "Bạn cần đồng ý Điều khoản Bản quyền và Chính sách Bảo mật.",
      });
      return;
    }

    const payload: CheckoutRequest = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      phone: formValues.phone,
      paymentMethod: formValues.paymentMethod,
    };

    setIsSubmitting(true);

    try {
      const result = await checkout(payload);
      window.dispatchEvent(new Event(CART_ITEMS_UPDATED_EVENT));

      const refreshedCart = await getCart();
      setCart(refreshedCart);

      await Swal.fire({
        icon: "success",
        title: "Thanh toán thành công",
        html: `
          <div style="text-align:left">
            <p><strong>Mã đơn hàng:</strong> #${result.orderId}</p>
            <p><strong>Trạng thái:</strong> ${result.paymentStatus}</p>
            <p><strong>Phương thức:</strong> ${result.paymentMethod}</p>
            <p><strong>Số lượng:</strong> ${result.totalItems}</p>
          </div>
        `,
        text: result.message || undefined,
      });
    } catch (error: any) {
      const message =
        error?.response?.data ||
        error?.message ||
        "Thanh toán thất bại. Vui lòng thử lại.";

      await Swal.fire({
        icon: "error",
        title: "Thanh toán thất bại",
        text: typeof message === "string" ? message : "Đã xảy ra lỗi không xác định.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <SpinningLoading />;
  }

  if (httpError) {
    return <ErrorMessage message={httpError} />;
  }

  return (
    <main className="main">
      <PageTitle title="Thanh toán" current="Thanh toán" />

      <section id="checkout" className="checkout section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row">
            <div className="col-lg-7">
              <CheckoutForm
                values={formValues}
                totalAmount={cart?.totalPrice || 0}
                isSubmitting={isSubmitting}
                onInputChange={handleInputChange}
                onPaymentMethodChange={handlePaymentMethodChange}
                onSubmit={handleCheckout}
              />
            </div>

            <div className="col-lg-5">
              <SummaryOrder cart={cart} />
            </div>
          </div>

          <TermAndPrivacy />
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;
