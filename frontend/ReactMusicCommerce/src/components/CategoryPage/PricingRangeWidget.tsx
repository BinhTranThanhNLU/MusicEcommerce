import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const MIN_PRICE = 0;
const MAX_PRICE = 5000000;
const STEP = 10000;

const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN") + " ₫";

const parsePriceFromParams = (params: URLSearchParams) => ({
  min: Number(params.get("minPrice")) || MIN_PRICE,
  max: Number(params.get("maxPrice")) || MAX_PRICE,
});

const PricingRangeWidget = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [prices, setPrices] = useState(() => parsePriceFromParams(searchParams));

  // Sync local state from URL when URL changes externally
  useEffect(() => {
    setPrices(parsePriceFromParams(searchParams));
  }, [searchParams]);

  const handleMinChange = (value: number) => {
    setPrices((prev) => ({
      ...prev,
      min: Math.max(MIN_PRICE, Math.min(value, prev.max - STEP)),
    }));
  };

  const handleMaxChange = (value: number) => {
    setPrices((prev) => ({
      ...prev,
      max: Math.min(MAX_PRICE, Math.max(value, prev.min + STEP)),
    }));
  };

  const handleApply = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (prices.min > MIN_PRICE) {
        next.set("minPrice", prices.min.toString());
      } else {
        next.delete("minPrice");
      }
      if (prices.max < MAX_PRICE) {
        next.set("maxPrice", prices.max.toString());
      } else {
        next.delete("maxPrice");
      }
      next.set("page", "0");
      return next;
    });
  };

  return (
    <div className="pricing-range-widget widget-item">
      <h3 className="widget-title">Giá tiền</h3>

      <div className="price-range-container">
        <div className="current-range mb-3">
          <span className="min-price">{formatCurrency(prices.min)}</span>
          <span className="max-price float-end">{formatCurrency(prices.max)}</span>
        </div>

        <div className="range-slider">
          <div className="slider-track"></div>
          <div className="slider-progress"></div>
          <input
            type="range"
            className="min-range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={prices.min}
            step={STEP}
            onChange={(e) => handleMinChange(Number(e.target.value))}
          />
          <input
            type="range"
            className="max-range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={prices.max}
            step={STEP}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
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
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={prices.min}
                  step={STEP}
                  onChange={(e) => handleMinChange(Number(e.target.value))}
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
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={prices.max}
                  step={STEP}
                  onChange={(e) => handleMaxChange(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="filter-actions mt-3">
          <button
            type="button"
            className="btn btn-sm btn-dark w-100"
            onClick={handleApply}
          >
            Áp dụng lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingRangeWidget;
