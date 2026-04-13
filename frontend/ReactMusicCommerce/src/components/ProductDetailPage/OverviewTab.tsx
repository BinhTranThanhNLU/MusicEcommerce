const OverviewTab = () => {
  return (
    <div
      className="tab-pane fade show active"
      id="ecommerce-product-details-5-overview"
    >
      <div className="overview-content">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="content-section">
              <h3>Mô tả sản phẩm</h3>
              <p>
                Bởi vì không ai khinh miệt, ghét bỏ hay trốn tránh lạc thú chỉ
                vì nó là lạc thú, nhưng vì những nỗi đau khổ lớn lao sẽ theo
                đuổi những ai không biết cách theo đuổi lạc thú một cách lý trí.
                Cũng không ai yêu thích, theo đuổi hay mong muốn đạt được nỗi
                đau chỉ vì nó là nỗi đau.
              </p>

              <h4>Các sản phẩm liên quan</h4>
              <div
                id="relatedProductsCarousel"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {/* Slide 1 */}
                  <div className="carousel-item active">
                    <div className="row g-4">
                      <div className="col-md-3">
                        <div className="product-card">
                          <div className="product-image">
                            <img
                              src="../../assets/img/product/product-1.webp"
                              className="main-image img-fluid"
                              alt="Adidas"
                            />
                          </div>
                          <div className="product-details">
                            <div className="product-category">ADIDAS</div>
                            <h6 className="product-title">
                              Giày Sneaker Nữ Adidas Barreda Decode - Hồng
                            </h6>
                            <div className="product-price">2.000.000₫</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="product-card">
                          <div className="product-image">
                            <img
                              src="../../assets/img/product/product-1.webp"
                              className="main-image img-fluid"
                              alt="Hoka Red"
                            />
                          </div>
                          <div className="product-details">
                            <div className="product-category">HOKA</div>
                            <h6 className="product-title">
                              Giày Sneaker Unisex HOKA Mafate Speed 2 - Đỏ
                            </h6>
                            <div className="product-price">4.199.000₫</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="product-card">
                          <div className="product-image">
                            <img
                              src="../../assets/img/product/product-1.webp"
                              className="main-image img-fluid"
                              alt="Hoka White"
                            />
                          </div>
                          <div className="product-details">
                            <div className="product-category">HOKA</div>
                            <h6 className="product-title">
                              Giày Sneaker Unisex HOKA Mafate Speed 2 - Trắng
                            </h6>
                            <div className="product-price">4.199.000₫</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="product-card">
                          <div className="product-image">
                            <img
                              src="../../assets/img/product/product-1.webp"
                              className="main-image img-fluid"
                              alt="Puma Black"
                            />
                          </div>
                          <div className="product-details">
                            <div className="product-category">PUMA</div>
                            <h6 className="product-title">
                              Giày Sneaker Unisex Puma Speedcat Leather - Đen
                            </h6>
                            <div className="product-price">2.800.000₫</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2 */}
                  <div className="carousel-item">
                    <div className="row g-4">
                      <div className="col-md-3">
                        <div className="product-card">
                          <div className="product-image">
                            <img
                              src="../../assets/img/product/product-1.webp"
                              className="main-image img-fluid"
                              alt="Puma White"
                            />
                          </div>
                          <div className="product-details">
                            <div className="product-category">PUMA</div>
                            <h6 className="product-title">
                              Giày Sneaker Unisex Puma Speedcat Leather - Trắng
                            </h6>
                            <div className="product-price">2.800.000₫</div>
                          </div>
                        </div>
                      </div>
                      {/* Thêm các col-md-3 sản phẩm khác  */}
                    </div>
                  </div>
                </div>

                {/* Điều khiển Carousel  */}
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#relatedProductsCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#relatedProductsCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="package-contents">
              <h4>Phụ kiện</h4>
              <ul className="contents-list">
                <li>
                  <i className="bi bi-check-circle"></i>01 Đôi giày chính hãng
                </li>
                <li>
                  <i className="bi bi-check-circle"></i>Hộp giày bảo vệ
                </li>
                <li>
                  <i className="bi bi-check-circle"></i>Bao đựng chống bụi
                </li>
                <li>
                  <i className="bi bi-check-circle"></i>1 cặp dây giày dự phòng
                </li>
                <li>
                  <i className="bi bi-check-circle"></i>Thẻ bảo hành chính hãng
                </li>
                <li>
                  <i className="bi bi-check-circle"></i>Hướng dẫn chăm sóc & vệ
                  sinh giày
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
