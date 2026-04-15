import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AUDIO_TYPES = [
  { value: "Full-song", label: "Bài hát hoàn chỉnh" },
  { value: "Instrumental", label: "Nhạc không lời" },
  { value: "Short-audio", label: "Đoạn âm thanh ngắn" },
];

const ProductCategoryWidget = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Sync local state from URL on mount and when URL changes
  useEffect(() => {
    setSelectedTypes(searchParams.getAll("types"));
  }, [searchParams]);

  const handleToggle = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("types");
      selectedTypes.forEach((t) => next.append("types", t));
      next.set("page", "0");
      return next;
    });
  };

  const handleClear = () => {
    setSelectedTypes([]);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("types");
      next.set("page", "0");
      return next;
    });
  };

  return (
    <div className="product-categories-widget widget-item mb-4">
      <h3 className="widget-title mb-3">Cấp độ âm thanh</h3>

      <div className="category-filter-content">
        <div className="category-list">
          {AUDIO_TYPES.map((type) => (
            <div className="category-item mb-2" key={type.value}>
              {/* Dùng flexbox để căn hai bên */}
              <div className="form-check d-flex justify-content-between align-items-center mb-0">
                <div>
                  <input
                    className="form-check-input me-2 shadow-none"
                    type="checkbox"
                    id={`cat-${type.value}`}
                    checked={selectedTypes.includes(type.value)}
                    onChange={() => handleToggle(type.value)}
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`cat-${type.value}`}
                    style={{ cursor: "pointer", fontSize: "0.95rem" }}
                  >
                    {type.label}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="category-actions mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
          <button
            className="btn btn-sm text-muted text-decoration-underline px-0 shadow-none"
            onClick={handleClear}
          >
            Xóa
          </button>
          <button
            className="btn btn-sm btn-dark px-3 rounded-pill shadow-none"
            onClick={handleApply}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryWidget;
