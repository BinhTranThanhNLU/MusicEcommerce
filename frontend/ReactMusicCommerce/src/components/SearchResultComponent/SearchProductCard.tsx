const SearchProductCard = () => {
  return (
    <div className="col-6 col-lg-3">
      <div className="product-card" data-aos="zoom-in" data-aos-delay="600">
        <div className="product-image">
          <img
            src="../../assets/img/product/product-f-7.webp"
            className="main-image img-fluid"
            alt="Product"
          />
          <img
            src="../../assets/img/product/product-f-8.webp"
            className="hover-image img-fluid"
            alt="Product Variant"
          />
          <div className="product-overlay">
            <div className="product-actions">
              <button
                type="button"
                className="action-btn"
                data-bs-toggle="tooltip"
                title="Quick View"
              >
                <i className="bi bi-eye"></i>
              </button>
              <button
                type="button"
                className="action-btn"
                data-bs-toggle="tooltip"
                title="Add to Cart"
              >
                <i className="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="product-details">
          <div className="product-category">Accessories</div>
          <h4 className="product-title">
            <a href="product-details.html">Incididunt Labore</a>
          </h4>
          <div className="product-meta">
            <div className="product-price">$55.00</div>
            <div className="product-rating">
              <i className="bi bi-star-fill"></i>
              4.6 <span>(31)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProductCard;
