const BrandFilterWidget = () => {
  return (
    <div className="brand-filter-widget widget-item">
      <h3 className="widget-title">Thương hiệu</h3>

      <div className="brand-filter-content">
        <div className="brand-search">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm thương hiệu..."
          />
          <i className="bi bi-search"></i>
        </div>

        <div className="brand-list">
          <div className="brand-item">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="brand1" />
              <label className="form-check-label" htmlFor="brand1">
                Nike
                <span className="brand-count">(24)</span>
              </label>
            </div>
          </div>

          <div className="brand-item">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="brand2" />
              <label className="form-check-label" htmlFor="brand2">
                Adidas
                <span className="brand-count">(18)</span>
              </label>
            </div>
          </div>

          <div className="brand-item">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="brand3" />
              <label className="form-check-label" htmlFor="brand3">
                Puma
                <span className="brand-count">(12)</span>
              </label>
            </div>
          </div>

          <div className="brand-item">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="brand4" />
              <label className="form-check-label" htmlFor="brand4">
                Reebok
                <span className="brand-count">(9)</span>
              </label>
            </div>
          </div>

          <div className="brand-item">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="brand5" />
              <label className="form-check-label" htmlFor="brand5">
                Under Armour
                <span className="brand-count">(7)</span>
              </label>
            </div>
          </div>

          <div className="brand-item">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="brand6" />
              <label className="form-check-label" htmlFor="brand6">
                New Balance
                <span className="brand-count">(6)</span>
              </label>
            </div>
          </div>

          <div className="brand-item">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="brand7" />
              <label className="form-check-label" htmlFor="brand7">
                Converse
                <span className="brand-count">(5)</span>
              </label>
            </div>
          </div>

          <div className="brand-item">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="brand8" />
              <label className="form-check-label" htmlFor="brand8">
                Vans
                <span className="brand-count">(4)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="brand-actions">
          <button className="btn btn-sm btn-outline-primary">
            Áp dụng lọc
          </button>
          <button className="btn btn-sm btn-link">Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default BrandFilterWidget;
