import { useEffect, useState, type FormEvent } from "react";
import type { SearchType } from "../../models/Search";

interface SearchResultHeaderProps {
  totalResults: number;
  query: string;
  searchType: SearchType;
  onSearch: (keyword: string) => void;
}

const searchTypeLabel: Record<SearchType, string> = {
  "full-text": "Toan van",
  fuzzy: "Fuzzy",
  phrase: "Phrase",
  semantic: "Thong minh (Semantic)",
};

const SearchResultHeader = ({
  totalResults,
  query,
  searchType,
  onSearch,
}: SearchResultHeaderProps) => {
  const [keyword, setKeyword] = useState(query);

  useEffect(() => {
    setKeyword(query);
  }, [query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(keyword);
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
                  Kieu tim kiem hien tai: <strong>{searchTypeLabel[searchType]}</strong>
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
        </div>
      </div>
    </section>
  );
};

export default SearchResultHeader;
