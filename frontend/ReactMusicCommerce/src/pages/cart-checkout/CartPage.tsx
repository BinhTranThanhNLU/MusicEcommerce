import { useCallback, useEffect, useState } from "react";
import CartList from "../../components/CartComponent/CartList";
import CartSummary from "../../components/CartComponent/CartSummary";
import PageTitle from "../../components/utils/PageTitle";
import { ErrorMessage } from "../../components/utils/ErrorMessage";
import { SpinningLoading } from "../../components/utils/SpinningLoading";
import type { CartResponse } from "../../responsemodel/CartResponse";
import {
  deleteCart,
  getCart,
  removeFromCart,
  updateCartItemLicense,
} from "../../apis/cartApi";
import {
  CART_ITEMS_UPDATED_EVENT,
} from "../../utils/cartStorage";
import Swal from "sweetalert2";

const CartPage = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const [httpError, setHttpError] = useState<string | null>(null);

  const syncCart = useCallback(async (showPageLoading = false) => {
    if (showPageLoading) {
      setIsLoading(true);
    }
    setHttpError(null);

    try {
      const response = await getCart();
      setCart(response);
    } catch (error: any) {
      setHttpError(error?.response?.data || error?.message || "Không tải được giỏ hàng.");
      setCart(null);
    } finally {
      if (showPageLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const onCartUpdated = () => {
      void syncCart(false);
    };

    void syncCart(true);
    window.addEventListener(CART_ITEMS_UPDATED_EVENT, onCartUpdated);

    return () => {
      window.removeEventListener(CART_ITEMS_UPDATED_EVENT, onCartUpdated);
    };
  }, [syncCart]);

  const handleRemoveItem = async (cartItemId: number) => {
    setIsUpdatingCart(true);

    try {
      await removeFromCart(cartItemId);
      window.dispatchEvent(new Event(CART_ITEMS_UPDATED_EVENT));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data ||
        error?.message ||
        "Không thể xóa sản phẩm khỏi giỏ hàng.";

      await Swal.fire({
        icon: "error",
        title: "Xóa sản phẩm thất bại",
        text: errorMessage,
      });
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleUpdateItemLicense = async (
    cartItemId: number,
    licenseId: number,
  ) => {
    setIsUpdatingCart(true);

    try {
      await updateCartItemLicense(cartItemId, { licenseId });
      window.dispatchEvent(new Event(CART_ITEMS_UPDATED_EVENT));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data ||
        error?.message ||
        "Không thể cập nhật license cho sản phẩm.";

      await Swal.fire({
        icon: "error",
        title: "Cập nhật license thất bại",
        text: errorMessage,
      });
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleClearCart = async () => {
    if (!cart || cart.totalItems === 0) {
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Xóa toàn bộ giỏ hàng?",
      text: "Tất cả track trong giỏ sẽ bị xóa.",
      showCancelButton: true,
      confirmButtonText: "Xóa toàn bộ",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsUpdatingCart(true);

    try {
      await deleteCart();
      window.dispatchEvent(new Event(CART_ITEMS_UPDATED_EVENT));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data ||
        error?.message ||
        "Không thể xóa toàn bộ giỏ hàng.";

      await Swal.fire({
        icon: "error",
        title: "Xóa giỏ hàng thất bại",
        text: errorMessage,
      });
    } finally {
      setIsUpdatingCart(false);
    }
  };

  if (isLoading) return <SpinningLoading />;
  if (httpError) return <ErrorMessage message={httpError} />;

  return (
    <main className="main">
      <PageTitle title="Giỏ hàng" current="Giỏ hàng" />

      <section id="cart" className="cart section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="cart-hero" data-aos="fade-up" data-aos-delay="150">
            <div className="cart-hero-content">
              <p className="cart-eyebrow">Thanh toán & Bản quyền</p>
              <h2>Giỏ hàng của bạn</h2>
              <p>
                Mỗi sản phẩm âm nhạc trong giỏ sẽ được tải xuống dưới định dạng
                MP3 chất lượng cao kèm Giấy chứng nhận bản quyền PDF sau khi
                thanh toán thành công.
              </p>
            </div>

            <div className="cart-hero-stats">
              <div className="hero-stat-pill">
                <span className="pill-label">Sản phẩm đã chọn</span>
                <strong>{String(cart?.totalItems || 0).padStart(2, "0")}</strong>
              </div>
              <div className="hero-stat-pill">
                <span className="pill-label">Định dạng file</span>
                <strong>MP3 gốc</strong>
              </div>
              <div className="hero-stat-pill">
                <span className="pill-label">Cấp phép</span>
                <strong>Tức thì</strong>
              </div>
              <div className="hero-stat-pill">
                <span className="pill-label">Tổng tạm tính</span>
                <strong>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(cart?.totalPrice || 0)}
                </strong>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="200">
              <CartList
                items={cart?.items || []}
                onRemoveItem={handleRemoveItem}
                onUpdateItemLicense={handleUpdateItemLicense}
                onClearCart={handleClearCart}
                isMutating={isUpdatingCart}
              />
            </div>

            <div
              className="col-lg-4 mt-4 mt-lg-0"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <CartSummary cart={cart} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;