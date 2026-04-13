import CartItem from "./CartItem";

const CartList = () => {
  return (
    <div className="cart-items">
      <div className="cart-header d-none d-lg-block">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h5>Sản phẩm</h5>
          </div>
          <div className="col-lg-2 text-center">
            <h5>Giá tiền</h5>
          </div>
          <div className="col-lg-2 text-center">
            <h5>Số lượng</h5>
          </div>
          <div className="col-lg-2 text-center">
            <h5>Tổng</h5>
          </div>
        </div>
      </div>

      <CartItem />
      <CartItem />
      <CartItem />

      <div className="cart-actions">
        <div className="row">
          <div className="col-lg-6 mb-3 mb-lg-0">
            <div className="coupon-form">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Coupon code"
                />
                <button className="btn btn-outline-accent" type="button">
                  Áp dụng mã giảm giá
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-md-end">
            <button className="btn btn-outline-remove">
              <i className="bi bi-trash"></i> Xóa cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartList;
