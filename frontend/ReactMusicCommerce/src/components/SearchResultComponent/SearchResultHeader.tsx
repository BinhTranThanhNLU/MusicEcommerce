const SearchResultHeader = () => {
  return (
    <section
      id="search-results-header"
      className="search-results-header section"
    >
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="search-results-header">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div
                className="results-count"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <h2>Kết quả tìm kiếm</h2>
                <p>
                  Chúng tôi tìm thấy <span className="results-number">24</span>{" "}
                  sản phẩm theo{" "}
                  <span className="search-term">"Lorem ipsum"</span>
                </p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
              <form method="post" className="search-form">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm..."
                    name="search"
                    value="Lorem ipsum"
                    required
                  />
                  <button className="btn search-btn" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div
            className="search-filters mt-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="row">
              <div className="col-lg-8">
                <div className="filter-tags">
                  <span className="filter-label">Lọc:</span>
                  <div className="tags-wrapper">
                    <span className="filter-tag">
                      Danh mục: Giày bóng đá
                      <i className="bi bi-x-circle"></i>
                    </span>
                    <span className="filter-tag">
                      Thời gian: Tháng trước
                      <i className="bi bi-x-circle"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <div className="sort-options">
                  <label htmlFor="sort-select" className="me-2">
                    Sắp xếp:
                  </label>
                  <select
                    id="sort-select"
                    className="form-select form-select-sm d-inline-block w-auto"
                  >
                    <option value="relevance">Liên quan</option>
                    <option value="date-desc">Mới nhất</option>
                    <option value="date-asc">Cũ nhất</option>
                    <option value="title-asc">Từ A-Z</option>
                    <option value="title-desc">Từ Z-A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchResultHeader;
