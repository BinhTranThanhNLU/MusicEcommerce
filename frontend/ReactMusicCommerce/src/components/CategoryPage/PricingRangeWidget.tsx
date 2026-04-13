const PricingRangeWidget = () => {
  return (
    <div className="pricing-range-widget widget-item">
      <h3 className="widget-title">Giá tiền</h3>

      <div className="price-range-container">
        <div className="current-range mb-3">
          <span className="min-price">0 ₫</span>
          <span className="max-price float-end">5.000.000 ₫</span>
        </div>

        <div className="range-slider">
          <div className="slider-track"></div>
          <div className="slider-progress"></div>
          <input
            type="range"
            className="min-range"
            min="0"
            max="1000000"
            value="0"
            step="10000"
          />
          <input
            type="range"
            className="max-range"
            min="0"
            max="1000000"
            value="500000"
            step="10000"
          />
        </div>

        <div className="price-inputs mt-3">
          <div className="row g-2">
            <div className="col-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text">₫</span>
                <input
                  type="number"
                  className="form-control min-price-input"
                  placeholder="Tối thiểu"
                  min="0"
                  max="1000000"
                  value="0"
                  step="10000"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text">₫</span>
                <input
                  type="number"
                  className="form-control max-price-input"
                  placeholder="Tối đa"
                  min="0"
                  max="1000000"
                  value="500000"
                  step="10000"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="filter-actions mt-3">
          <button type="button" className="btn btn-sm btn-dark w-100">
            Áp dụng lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingRangeWidget;
