const ProductCategoryWidget = () => {
  // Đưa data vào mảng tương tự ArtistFilterWidget để dễ quản lý
  const categories = [
    { id: "cat-fullsong", name: "Bài hát hoàn chỉnh", count: 345 },
    { id: "cat-instrumental", name: "Nhạc không lời", count: 128 },
    { id: "cat-shortaudio", name: "Đoạn âm thanh ngắn", count: 89 },
  ];

  return (
    <div className="product-categories-widget widget-item mb-4">
      <h3 className="widget-title mb-3">Cấp độ âm thanh</h3>

      <div className="category-filter-content">
        <div className="category-list">
          {categories.map((category) => (
            <div className="category-item mb-2" key={category.id}>
              {/* Dùng flexbox để căn hai bên */}
              <div className="form-check d-flex justify-content-between align-items-center mb-0">
                <div>
                  <input
                    className="form-check-input me-2 shadow-none"
                    type="checkbox"
                    id={category.id}
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={category.id}
                    style={{ cursor: "pointer", fontSize: "0.95rem" }}
                  >
                    {category.name}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="category-actions mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
          <button className="btn btn-sm text-muted text-decoration-underline px-0 shadow-none">
            Xóa
          </button>
          <button className="btn btn-sm btn-dark px-3 rounded-pill shadow-none">
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryWidget;
