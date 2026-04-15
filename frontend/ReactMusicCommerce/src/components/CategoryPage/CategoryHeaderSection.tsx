import { useSearchParams } from "react-router-dom";

const CategoryHeaderSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSort = searchParams.get("sort") || "";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set("sort", value);
      } else {
        next.delete("sort"); // Chọn "Mặc định" thì xoá param cho gọn URL
      }
      next.set("page", "0"); // Reset về trang đầu tiên
      return next;
    });
  };

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
            {/* Thanh tìm kiếm */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="filter-item search-form">
                <label htmlFor="productSearch" className="form-label">
                  Tìm kiếm âm thanh
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control shadow-none"
                    id="productSearch"
                    placeholder="Tên bài hát, nghệ sĩ, giai điệu..."
                    aria-label="Search for products"
                  />
                  <button className="btn search-btn btn-dark" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Lọc theo Giấy phép */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="filter-item">
                <label htmlFor="licenseType" className="form-label">
                  Giấy phép
                </label>
                <select
                  className="form-select shadow-none"
                  id="licenseType"
                  defaultValue=""
                >
                  <option value="">Tất cả giấy phép</option>
                  <option value="personal">Cá nhân (Nghe nhạc)</option>
                  <option value="commercial">Thương mại (YouTube, Ads)</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="filter-item">
                <label htmlFor="sortBy" className="form-label">
                  Sắp xếp theo
                </label>
                <select
                  className="form-select shadow-none"
                  id="sortBy"
                  value={currentSort} // Ràng buộc giá trị với URL
                  onChange={handleSortChange}
                >
                  <option value="">Mặc định (Mới nhất)</option>
                  <option value="newest">Mới phát hành</option>
                  <option value="popular">Lượt nghe nhiều nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryHeaderSection;
