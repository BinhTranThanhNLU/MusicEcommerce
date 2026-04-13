const ProductDetail = () => {
  return (
    <div className="col-lg-5" data-aos="fade-left" data-aos-delay="200">
      <div className="product-details">
        <div className="product-badge-container">
          <span className="badge-category">Giày bóng đá</span>
          <div className="rating-group">
            <div className="stars">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
            </div>
            <span className="review-text">(127 đánh giá)</span>
          </div>
        </div>

        <h1 className="product-name">
          Mauris tempus cursus magna vel scelerisque nisl consectetur
        </h1>

        <div className="pricing-section">
          <div className="price-display">
            <span className="sale-price">$189.99</span>
            <span className="regular-price">$239.99</span>
          </div>
          <div className="savings-info">
            <span className="save-amount">Tiết kiệm $50.00</span>
            <span className="discount-percent">(21% off)</span>
          </div>
        </div>

        <div className="product-description">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
        </div>

        <div className="availability-status">
          <div className="stock-indicator">
            <i className="bi bi-check-circle-fill"></i>
            <span className="stock-text">Còn</span>
          </div>
          <div className="quantity-left">Chỉ còn lại 18 sản phẩm</div>
        </div>

        {/* Product Variants Color */}
        <div className="variant-color-section mb-3">
          <h6>Màu sắc</h6>
          <div className="d-flex flex-wrap gap-2">
            <div className="size-option">Trắng</div>
            <div className="size-option">Đỏ </div>
            <div className="size-option">Đen</div>
            <div className="size-option">Xanh Dương</div>
          </div>
        </div>

        {/* Product Variants Size */}
        <div className="variant-size-section mb-3">
          <h6>Kích Thước</h6>
          <div className="d-flex flex-wrap gap-2">
            <div className="size-option">UK 3.5</div>
            <div className="size-option">UK 4</div>
            <div className="size-option">UK 4.5</div>
            <div className="size-option">UK 5</div>
            <div className="size-option">UK 5.5</div>
            <div className="size-option">UK 6</div>
            <div className="size-option">UK 6.5</div>
          </div>
        </div>

        {/* Purchase Options */}
        <div className="purchase-section">
          <div className="quantity-control">
            <label className="control-label">Số lượng:</label>
            <div className="quantity-input-group">
              <div className="quantity-selector">
                <button className="quantity-btn decrease" type="button">
                  <i className="bi bi-dash"></i>
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value="1"
                  min="1"
                  max="18"
                />
                <button className="quantity-btn increase" type="button">
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn primary-action">
              <i className="bi bi-bag-plus"></i>
              Thêm vào giỏ
            </button>
            <button className="btn secondary-action">
              <i className="bi bi-lightning"></i>
              Mua ngay
            </button>
            <button className="btn icon-action" title="Add to Wishlist">
              <i className="bi bi-heart"></i>
            </button>
          </div>
        </div>

        {/* Benefits List */}
        <div className="benefits-list">
          <div className="benefit-item">
            <i className="bi bi-truck"></i>
            <span>Giao hàng miễn phí cho đơn hàng trên 1.000.000đ</span>
          </div>
          <div className="benefit-item">
            <i className="bi bi-arrow-clockwise"></i>
            <span>Trả hàng miễn phí trong vòng 45 ngày</span>
          </div>
          <div className="benefit-item">
            <i className="bi bi-shield-check"></i>
            <span>Bảo hành 3 năm của nhà sản xuất</span>
          </div>
          <div className="benefit-item">
            <i className="bi bi-headset"></i>
            <span>Hỗ trợ khách hàng 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
