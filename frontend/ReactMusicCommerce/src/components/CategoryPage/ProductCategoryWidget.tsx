const ProductCategoryWidget = () => {
  return (
    <div className="product-categories-widget widget-item">
      <h3 className="widget-title">Cấp độ âm thanh</h3>

      <ul className="category-tree list-unstyled mb-0">
        {/* Full Song Category */}
        <li className="category-item">
          <div
            className="d-flex justify-content-between align-items-center category-header collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#category-fullsong-sub"
            aria-expanded="false"
            aria-controls="category-fullsong-sub"
          >
            <a href="javascript:void(0)" className="category-link">
              Bài hát hoàn chỉnh
            </a>
            <span className="category-toggle">
              <i className="bi bi-chevron-down"></i>
              <i className="bi bi-chevron-up"></i>
            </span>
          </div>
          <ul
            id="category-fullsong-sub"
            className="subcategory-list list-unstyled collapse ps-3 mt-2"
          >
            <li>
              <a href="#" className="subcategory-link">
                Pop
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Rap / Hip-hop
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                R&B
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Ballad
              </a>
            </li>
          </ul>
        </li>

        {/* Instrumental Category */}
        <li className="category-item">
          <div
            className="d-flex justify-content-between align-items-center category-header collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#category-instrumental-sub"
            aria-expanded="false"
            aria-controls="category-instrumental-sub"
          >
            <a href="javascript:void(0)" className="category-link">
              Nhạc không lời
            </a>
            <span className="category-toggle">
              <i className="bi bi-chevron-down"></i>
              <i className="bi bi-chevron-up"></i>
            </span>
          </div>
          <ul
            id="category-fullsong-sub"
            className="subcategory-list list-unstyled collapse ps-3 mt-2"
          >
            <li>
              <a href="#" className="subcategory-link">
                Beat phối sẵn
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Nhạc nền Vlog
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Nhạc Cinematic
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Lofi / Chill
              </a>
            </li>
          </ul>
        </li>

        {/* Short Audio Category */}
        <li className="category-item">
          <div
            className="d-flex justify-content-between align-items-center category-header collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#category-shortaudio-sub"
            aria-expanded="false"
            aria-controls="category-shortaudio-sub"
          >
            <a href="javascript:void(0)" className="category-link">
              Đoạn âm thanh ngắn
            </a>
            <span className="category-toggle">
              <i className="bi bi-chevron-down"></i>
              <i className="bi bi-chevron-up"></i>
            </span>
          </div>
          <ul
            id="category-shortaudio-sub"
            className="subcategory-list list-unstyled collapse ps-3 mt-2"
          >
            <li>
              <a href="#" className="subcategory-link">
                Hiệu ứng (SFX)
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Jingle quảng cáo
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Nhạc chuông
              </a>
            </li>
            <li>
              <a href="#" className="subcategory-link">
                Mẫu âm thanh (Sample)
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default ProductCategoryWidget;
