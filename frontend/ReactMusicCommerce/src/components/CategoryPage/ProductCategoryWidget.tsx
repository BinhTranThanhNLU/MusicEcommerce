const ProductCategoryWidget = () => {
  return (
    <div className="product-categories-widget widget-item">
      <h3 className="widget-title">Danh mục</h3>

      <ul className="category-tree list-unstyled mb-0">
        {/* Music Category */}
        <li className="category-item">
          <div
            className="d-flex justify-content-between align-items-center category-header collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#categories-1-clothing-subcategories"
            aria-expanded="false"
            aria-controls="categories-1-clothing-subcategories"
          >
            <a href="javascript:void(0)" className="category-link">
              Giày thể thao
            </a>
            <span className="category-toggle">
              <i className="bi bi-chevron-down"></i>
              <i className="bi bi-chevron-up"></i>
            </span>
          </div>
          <ul
            id="categories-1-clothing-subcategories"
            className="subcategory-list list-unstyled collapse ps-3 mt-2"
          >
            <li>
              <a href="#" className="subcategory-link">
                Bóng đá
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Bóng rổ
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Bóng chuyền
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Chạy bộ
              </a>
            </li>
          </ul>
        </li>

        {/* Music Cateogry */}
        <li className="category-item">
          <div
            className="d-flex justify-content-between align-items-center category-header collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#categories-1-electronics-subcategories"
            aria-expanded="false"
            aria-controls="categories-1-electronics-subcategories"
          >
            <a href="javascript:void(0)" className="category-link">
              Giày thời trang
            </a>
            <span className="category-toggle">
              <i className="bi bi-chevron-down"></i>
              <i className="bi bi-chevron-up"></i>
            </span>
          </div>
          <ul
            id="categories-1-electronics-subcategories"
            className="subcategory-list list-unstyled collapse ps-3 mt-2"
          >
            <li>
              <a href="#" className="subcategory-link">
                Thời trang nam
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Thời trang nữ
              </a>
            </li>
          </ul>
        </li>

        {/* Music Category */}
        <li className="category-item">
          <div
            className="d-flex justify-content-between align-items-center category-header collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#categories-1-home-subcategories"
            aria-expanded="false"
            aria-controls="categories-1-home-subcategories"
          >
            <a href="javascript:void(0)" className="category-link">
              Phụ kiện thể thao
            </a>
            <span className="category-toggle">
              <i className="bi bi-chevron-down"></i>
              <i className="bi bi-chevron-up"></i>
            </span>
          </div>
          <ul
            id="categories-1-home-subcategories"
            className="subcategory-list list-unstyled collapse ps-3 mt-2"
          >
            <li>
              <a href="#" className="subcategory-link">
                Bình nước
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Áo
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Quần
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Khác
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default ProductCategoryWidget;
