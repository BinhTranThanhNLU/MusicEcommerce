const CartItem = () => {
  return (
    <div className="cart-item">
      <div className="row align-items-center">
        <div className="col-lg-6 col-12 mt-3 mt-lg-0 mb-lg-0 mb-3">
          <div className="product-info d-flex align-items-center">
            <div className="product-image">
              <img
                src="../../assets/img/product/product-1.webp"
                alt="Product"
                className="img-fluid"
                loading="lazy"
              />
            </div>
            <div className="product-details">
              <h6 className="product-title">Lorem ipsum dolor sit amet</h6>
              <div className="product-meta">
                <span className="product-color">Màu: đen</span>
                <span className="product-size">Kích thước: US 10</span>
              </div>
              <button className="remove-item" type="button">
                <i className="bi bi-trash"></i> Xóa
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-12 mt-3 mt-lg-0 text-center">
          <div className="price-tag">
            <span className="current-price">1.000.000đ</span>
          </div>
        </div>
        <div className="col-lg-2 col-12 mt-3 mt-lg-0 text-center">
          <div className="quantity-selector">
            <button className="quantity-btn decrease">
              <i className="bi bi-dash"></i>
            </button>
            <input
              type="number"
              className="quantity-input"
              value="1"
              min="1"
              max="10"
            />
            <button className="quantity-btn increase">
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>
        <div className="col-lg-2 col-12 mt-3 mt-lg-0 text-center">
          <div className="item-total">
            <span>2.000.000đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
