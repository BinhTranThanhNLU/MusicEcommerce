import { useEffect, useState, type FormEvent } from "react";
import type { SearchType } from "../../models/Search";
import type { GenreModel } from "../../models/GenreModel";
import type { MoodModel } from "../../models/MoodModel";
import type { ThemeModel } from "../../models/ThemeModel";

export interface SearchFilters {
  status: string;
  genre: string;
  mood: string;
  theme: string;
  minPrice: string;
  maxPrice: string;
}

interface SearchResultHeaderProps {
  totalResults: number;
  query: string;
  searchType: SearchType;
  onSearch: (keyword: string) => void;
  filters: SearchFilters;
  genres: GenreModel[];
  moods: MoodModel[];
  themes: ThemeModel[];
  onApplyFilters: (filters: SearchFilters) => void;
  onResetFilters: () => void;
}

const searchTypeLabel: Record<SearchType, string> = {
  "full-text": "Toàn văn bản",
  fuzzy: "Fuzzy",
  phrase: "Phrase",
  semantic: "Thông minh (Semantic)",
  hybrid: "Kết hợp (Hybrid)",
  advanced: "Nâng cao (Advanced)",
  filter: "Lọc (Filter)",
};

const SearchResultHeader = ({
  totalResults,
  query,
  searchType,
  onSearch,
  filters,
  genres,
  moods,
  themes,
  onApplyFilters,
  onResetFilters,
}: SearchResultHeaderProps) => {
  const [keyword, setKeyword] = useState(query);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setKeyword(query);
  }, [query]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(keyword);
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApplyFilters(localFilters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

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
                  Chúng tôi tìm thấy{" "}
                  <span className="results-number">{totalResults}</span> kết quả theo{" "}
                  <span className="search-term">"{query || "..."}"</span>
                </p>
                <p className="mb-0 small text-muted">
                  Kiểu tìm kiếm hiện tại: <strong>{searchTypeLabel[searchType]}</strong>
                </p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
              <form className="search-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tim kiem tren trang ket qua..."
                    name="search"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    required
                  />
                  <button className="btn search-btn" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <form className="search-filters-panel mt-4" onSubmit={handleFilterSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-xl-2">
                <label className="form-label mb-1">Trạng thái</label>
                <select
                  className="form-select"
                  value={localFilters.status}
                  onChange={(event) => updateFilter("status", event.target.value)}
                >
                  <option value="">Tat ca</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="col-12 col-md-6 col-xl-2">
                <label className="form-label mb-1">Thể loại</label>
                <select
                  className="form-select"
                  value={localFilters.genre}
                  onChange={(event) => updateFilter("genre", event.target.value)}
                >
                  <option value="">Tat ca</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.name}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6 col-xl-2">
                <label className="form-label mb-1">Cảm xúc</label>
                <select
                  className="form-select"
                  value={localFilters.mood}
                  onChange={(event) => updateFilter("mood", event.target.value)}
                >
                  <option value="">Tat ca</option>
                  {moods.map((mood) => (
                    <option key={mood.id} value={mood.name}>
                      {mood.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6 col-xl-2">
                <label className="form-label mb-1">Chủ đề</label>
                <select
                  className="form-select"
                  value={localFilters.theme}
                  onChange={(event) => updateFilter("theme", event.target.value)}
                >
                  <option value="">Tat ca</option>
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.name}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6 col-xl-2">
                <label className="form-label mb-1">Giá từ</label>
                <input
                  type="number"
                  min={0}
                  step="1000"
                  className="form-control"
                  placeholder="0"
                  value={localFilters.minPrice}
                  onChange={(event) => updateFilter("minPrice", event.target.value)}
                />
              </div>

              <div className="col-12 col-md-6 col-xl-2">
                <label className="form-label mb-1">Đến giá</label>
                <input
                  type="number"
                  min={0}
                  step="1000"
                  className="form-control"
                  placeholder="Khong gioi han"
                  value={localFilters.maxPrice}
                  onChange={(event) => updateFilter("maxPrice", event.target.value)}
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3 flex-wrap">
              <button type="submit" className="btn btn-dark px-4">
                Áp dụng bộ lọc
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => {
                  setLocalFilters({
                    status: "",
                    genre: "",
                    mood: "",
                    theme: "",
                    minPrice: "",
                    maxPrice: "",
                  });
                  onResetFilters();
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchResultHeader;
