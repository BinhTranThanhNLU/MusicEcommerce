import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const MIN = 0;
const MAX = 5000000;
const STEP = 10000;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const PricingRangeWidget = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlMin = useMemo(() => {
    const v = Number(searchParams.get("minPrice"));
    return Number.isFinite(v) ? v : MIN;
  }, [searchParams]);

  const urlMax = useMemo(() => {
    const v = Number(searchParams.get("maxPrice"));
    return Number.isFinite(v) ? v : MAX;
  }, [searchParams]);

  const [minPrice, setMinPrice] = useState<number>(MIN);
  const [maxPrice, setMaxPrice] = useState<number>(MAX);

  useEffect(() => {
    const nextMin = clamp(urlMin, MIN, MAX);
    const nextMax = clamp(urlMax, MIN, MAX);
    setMinPrice(Math.min(nextMin, nextMax));
    setMaxPrice(Math.max(nextMin, nextMax));
  }, [urlMin, urlMax]);

  const onApply = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (minPrice <= MIN) next.delete("minPrice");
      else next.set("minPrice", String(minPrice));

      if (maxPrice >= MAX) next.delete("maxPrice");
      else next.set("maxPrice", String(maxPrice));

      next.set("page", "0");
      return next;
    });
  };

  return (
    <div className="pricing-range-widget widget-item">
      <h3 className="widget-title">Giá tiền</h3>

      <div className="price-range-container">
        <div className="current-range mb-3">
          <span className="min-price">{minPrice.toLocaleString("vi-VN")} ₫</span>
          <span className="max-price float-end">{maxPrice.toLocaleString("vi-VN")} ₫</span>
        </div>

        <div className="range-slider">
          <div className="slider-track"></div>
          <div className="slider-progress"></div>

          <input
            type="range"
            className="min-range"
            min={MIN}
            max={MAX}
            value={minPrice}
            step={STEP}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMinPrice(Math.min(v, maxPrice));
            }}
          />
          <input
            type="range"
            className="max-range"
            min={MIN}
            max={MAX}
            value={maxPrice}
            step={STEP}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMaxPrice(Math.max(v, minPrice));
            }}
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
                  min={MIN}
                  max={MAX}
                  value={minPrice}
                  step={STEP}
                  onChange={(e) => {
                    const v = clamp(Number(e.target.value), MIN, MAX);
                    setMinPrice(Math.min(v, maxPrice));
                  }}
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
                  min={MIN}
                  max={MAX}
                  value={maxPrice}
                  step={STEP}
                  onChange={(e) => {
                    const v = clamp(Number(e.target.value), MIN, MAX);
                    setMaxPrice(Math.max(v, minPrice));
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="filter-actions mt-3">
          <button type="button" className="btn btn-sm btn-dark w-100" onClick={onApply}>
            Áp dụng lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingRangeWidget;