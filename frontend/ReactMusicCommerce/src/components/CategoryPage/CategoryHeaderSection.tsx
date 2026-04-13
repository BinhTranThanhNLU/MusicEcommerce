const CategoryHeaderSection = () => {
  return (
    <section id="category-header" className="category-header section">
      <div className="container" data-aos="fade-up">
        {/* Filter and Sort Section */}
        <div
          className="filter-container mb-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="filter-item search-form">
                <label htmlFor="productSearch" className="form-label">
                  Tìm kiếm sản phẩm
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="productSearch"
                    placeholder="Tìm kiếm sản phẩm..."
                    aria-label="Search for products"
                  />
                  <button className="btn search-btn" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <div className="filter-item">
                <label htmlFor="priceRange" className="form-label">
                  Giá tiền
                </label>
                <select className="form-select" id="priceRange" defaultValue="">
                  <option value="">Tất cả giá tiền</option>
                  <option value="under-250">Dưới 250.000đ</option>
                  <option value="250-500">250.000đ đến 500.000đ</option>
                  <option value="500-1000">500.000đ đến 1.000.000đ</option>
                  <option value="1000-1500">1.000.000đ đến 1.500.000đ</option>
                  <option value="over-1500">Trên 1.500.000đ</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <div className="filter-item">
                <label htmlFor="sortBy" className="form-label">
                  Lọc theo
                </label>
                <select className="form-select" id="sortBy" defaultValue="">
                  <option value="">Sắp xếp</option>
                  <option>Giá tiền: thấp đến cao</option>
                  <option>Giá tiền: cao đến thấp</option>
                  <option>Đánh giá</option>
                  <option>Sản phẩm mới nhất</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12" data-aos="fade-up" data-aos-delay="200">
              <div className="active-filters">
                <span className="active-filter-label">Lọc theo:</span>
                <div className="filter-tags">
                  <span className="filter-tag">
                    Giày bóng đá{" "}
                    <button className="filter-remove">
                      <i className="bi bi-x"></i>
                    </button>
                  </span>
                  <span className="filter-tag">
                    50.000đ to 100.000đ{" "}
                    <button className="filter-remove">
                      <i className="bi bi-x"></i>
                    </button>
                  </span>
                  <button className="clear-all-btn">Xóa</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryHeaderSection;
