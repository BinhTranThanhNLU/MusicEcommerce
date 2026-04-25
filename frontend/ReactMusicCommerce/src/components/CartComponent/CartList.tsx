import { Link } from "react-router-dom";
import type { CartItemDetailResponse } from "../../responsemodel/CartItemDetailResponse";
import CartItem from "./CartItem";

interface CartListProps {
  items: CartItemDetailResponse[];
  onRemoveItem: (cartItemId: number) => void | Promise<void>;
  onUpdateItemLicense: (cartItemId: number, licenseId: number) => void | Promise<void>;
  onClearCart: () => void | Promise<void>;
  isMutating?: boolean;
}

const CartList = ({
  items,
  onRemoveItem,
  onUpdateItemLicense,
  onClearCart,
  isMutating = false,
}: CartListProps) => {
  return (
    <div className="cart-items">
      <div className="cart-list-note">
        <i className="bi bi-info-circle"></i>
        Vui lòng kiểm tra kỹ loại Giấy phép (Cá nhân / Thương mại) trước khi thanh toán.
      </div>

      {items.length > 0 ? (
        <>
          <div className="cart-header d-none d-lg-block">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h5>Sản phẩm âm nhạc</h5>
              </div>
              <div className="col-lg-3 text-center">
                <h5>Giấy phép</h5>
              </div>
              <div className="col-lg-3 text-center">
                <h5>Thành tiền</h5>
              </div>
            </div>
          </div>

          {items.map((item) => (
            <CartItem
              key={item.cartItemId}
              item={item}
              onRemoveItem={onRemoveItem}
              onUpdateItemLicense={onUpdateItemLicense}
              isMutating={isMutating}
            />
          ))}

          <div className="cart-actions mt-4">
            <div className="row">
              <div className="col-12 d-flex justify-content-end">
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={onClearCart}
                  disabled={isMutating}
                >
                  <i className="bi bi-trash"></i> {isMutating ? "Đang xử lý..." : "Xóa toàn bộ giỏ hàng"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-5 px-3 border rounded-4 bg-light">
          <i className="bi bi-bag-heart fs-1 text-secondary d-block mb-3"></i>
          <h4 className="mb-2">Giỏ hàng đang trống</h4>
          <p className="text-muted mb-4">
            Hãy mở một track, chọn giấy phép và bấm thêm vào giỏ để lưu đơn mua nhạc bản quyền của bạn.
          </p>
          <Link to="/" className="btn btn-accent">
            <i className="bi bi-music-note-list me-2"></i>
            Khám phá nhạc ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartList;