import { useEffect, useRef, useState, type FormEvent } from "react";
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
  onMelodySearch: (audioFile: File) => void;
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
  melody: "Giai điệu (Melody)",
  hybrid: "Kết hợp (Hybrid)",
  advanced: "Nâng cao (Advanced)",
  filter: "Lọc (Filter)",
};

const SearchResultHeader = ({
  totalResults,
  query,
  searchType,
  onSearch,
  onMelodySearch,
  filters,
  genres,
  moods,
  themes,
  onApplyFilters,
  onResetFilters,
}: SearchResultHeaderProps) => {
  const [keyword, setKeyword] = useState(query);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [melodyFile, setMelodyFile] = useState<File | null>(null);

  // cho chức năng thu âm
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    setKeyword(query);
  }, [query]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Cleanup stream micro nếu component bị unmount trong lúc đang thu âm
  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(keyword);
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApplyFilters(localFilters);
  };

  const handleMelodySearchClick = () => {
    if (!melodyFile) {
      return;
    }

    onMelodySearch(melodyFile);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const startRecording = async () => {
    try {
      // 1. Xin quyền truy cập micro
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      // 2. Thu thập các mảnh dữ liệu âm thanh
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      // 3. Xử lý khi kết thúc ghi âm
      recorder.onstop = () => {
        // Gom các chunk thành Blob (định dạng webm phổ biến trên trình duyệt)
        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        // Chuyển đổi Blob thành File object để khớp với cấu trúc API hiện tại
        const file = new File(
          [audioBlob],
          `mic-recording-${new Date().getTime()}.webm`,
          { type: "audio/webm" },
        );

        setMelodyFile(file);

        // Tắt stream để tắt đèn báo micro màu đỏ trên tab trình duyệt
        stream.getTracks().forEach((track) => track.stop());
      };

      // Bắt đầu thu âm
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Lỗi truy cập micro:", error);
      alert(
        "Không thể truy cập micro. Vui lòng kiểm tra quyền trên trình duyệt.",
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
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
                  <span className="results-number">{totalResults}</span> kết quả
                  theo <span className="search-term">"{query || "..."}"</span>
                </p>
                <p className="mb-0 small text-muted">
                  Kiểu tìm kiếm hiện tại:{" "}
                  <strong>{searchTypeLabel[searchType]}</strong>
                </p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
              <form className="search-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm trên trang kết quả ..."
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

          {/* Form Filter và Tìm kiếm Giai điệu */}
          <form
            className="search-filters-panel mt-4"
            onSubmit={handleFilterSubmit}
          >
            <div className="row g-3 mb-3 align-items-end">
              <div className="col-12 col-md-8">
                <label className="form-label mb-1">
                  Tìm theo giai điệu (Upload file hoặc Thu âm)
                </label>
                <div className="input-group">
                  {/* NÚT THU ÂM */}
                  <button
                    type="button"
                    className={`btn ${isRecording ? "btn-danger" : "btn-outline-secondary"}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    title={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                  >
                    {isRecording ? (
                      <>
                        <i className="bi bi-stop-circle-fill me-1"></i>
                        Đang thu...
                      </>
                    ) : (
                      <i className="bi bi-mic-fill"></i>
                    )}
                  </button>

                  <input
                    type="file"
                    className="form-control"
                    accept="audio/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setMelodyFile(file);
                    }}
                    disabled={isRecording} // Disable nút chọn file khi đang thu âm
                  />

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleMelodySearchClick}
                    disabled={!melodyFile || isRecording}
                  >
                    Tìm giai điệu
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-4">
                {melodyFile && (
                  <p className="small text-muted mb-0">
                    File đã chọn: <strong>{melodyFile.name}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Các Select Filters */}
            <div className="row g-3">
              <div className="col-12 col-md-6 col-xl-2">
                <label className="form-label mb-1">Trạng thái</label>
                <select
                  className="form-select"
                  value={localFilters.status}
                  onChange={(event) =>
                    updateFilter("status", event.target.value)
                  }
                >
                  <option value="">Tất cả</option>
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
                  onChange={(event) =>
                    updateFilter("genre", event.target.value)
                  }
                >
                  <option value="">Tất cả</option>
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
                  <option value="">Tất cả</option>
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
                  onChange={(event) =>
                    updateFilter("theme", event.target.value)
                  }
                >
                  <option value="">Tất cả</option>
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
                  onChange={(event) =>
                    updateFilter("minPrice", event.target.value)
                  }
                />
              </div>
              <div className="col-12 col-md-6 col-xl-2">
                <label className="form-label mb-1">Đến giá</label>
                <input
                  type="number"
                  min={0}
                  step="1000"
                  className="form-control"
                  placeholder="Không giới hạn"
                  value={localFilters.maxPrice}
                  onChange={(event) =>
                    updateFilter("maxPrice", event.target.value)
                  }
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
