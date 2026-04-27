interface ArtistTrackFilterProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  genreFilter: string;
  setGenreFilter: (genre: string) => void;
  genres: string[];
}

const ArtistTrackFilter = ({
  keyword,
  setKeyword,
  genreFilter,
  setGenreFilter,
  genres,
}: ArtistTrackFilterProps) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
        <div className="input-group" style={{ maxWidth: "350px" }}>
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control bg-light border-start-0 ps-0"
            placeholder="Tìm theo tên bài, tag, thể loại..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2">
          <select
            className="form-select bg-light border-0"
            style={{ minWidth: "150px" }}
            disabled
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đang xuất bản</option>
            <option value="pending">Đang chờ duyệt</option>
            <option value="draft">Bản nháp</option>
          </select>

          <select
            className="form-select bg-light border-0"
            style={{ minWidth: "150px" }}
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="all">Mọi thể loại</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ArtistTrackFilter;
