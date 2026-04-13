const ProductGallery = () => {
  return (
    <div className="col-lg-7" data-aos="zoom-in" data-aos-delay="150">
      <div className="product-gallery">
        <div className="main-showcase">
          <div className="image-zoom-container">
            <img
              src="../../assets/img/product/product-details-6.webp"
              alt="Product Main"
              className="img-fluid main-product-image drift-zoom"
              id="main-product-image"
              data-zoom="../../assets/img/product/product-details-6.webp"
            />

            <div className="image-navigation">
              <button
                className="nav-arrow prev-image image-nav-btn prev-image"
                type="button"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="nav-arrow next-image image-nav-btn next-image"
                type="button"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="thumbnail-grid">
          <div
            className="thumbnail-wrapper thumbnail-item active"
            data-image="../../assets/img/product/product-details-6.webp"
          >
            <img
              src="../../assets/img/product/product-details-6.webp"
              alt="View 1"
              className="img-fluid"
            />
          </div>
          <div
            className="thumbnail-wrapper thumbnail-item"
            data-image="../../assets/img/product/product-details-7.webp"
          >
            <img
              src="../../assets/img/product/product-details-7.webp"
              alt="View 2"
              className="img-fluid"
            />
          </div>
          <div
            className="thumbnail-wrapper thumbnail-item"
            data-image="../../assets/img/product/product-details-8.webp"
          >
            <img
              src="../../assets/img/product/product-details-8.webp"
              alt="View 3"
              className="img-fluid"
            />
          </div>
          <div
            className="thumbnail-wrapper thumbnail-item"
            data-image="../../assets/img/product/product-details-4.webp"
          >
            <img
              src="../../assets/img/product/product-details-4.webp"
              alt="View 4"
              className="img-fluid"
            />
          </div>
          <div
            className="thumbnail-wrapper thumbnail-item"
            data-image="../../assets/img/product/product-details-5.webp"
          >
            <img
              src="../../assets/img/product/product-details-5.webp"
              alt="View 5"
              className="img-fluid"
            />
          </div>
          <div
            className="thumbnail-wrapper thumbnail-item"
            data-image="../../assets/img/product/product-details-3.webp"
          >
            <img
              src="../../assets/img/product/product-details-3.webp"
              alt="View 6"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
