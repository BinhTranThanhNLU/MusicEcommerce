import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ArtistModel } from "../../models/ArtistModel";

interface ArtistFilterWidgetProps {
  artists: ArtistModel[];
}

const ArtistFilterWidget: React.FC<ArtistFilterWidgetProps> = ({ artists }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [selectedArtistIds, setSelectedArtistIds] = useState<number[]>([]);

  const urlArtistIds = useMemo(() => {
    return searchParams
      .getAll("artistIds")
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
  }, [searchParams]);

  useEffect(() => {
    setSelectedArtistIds(urlArtistIds);
  }, [urlArtistIds]);

  const filteredArtists = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return artists;
    return artists.filter((a) => a.name.toLowerCase().includes(k));
  }, [artists, keyword]);

  const toggleArtist = (id: number) => {
    setSelectedArtistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onClear = () => {
    setSelectedArtistIds([]);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("artistIds");
      next.set("page", "0");
      return next;
    });
  };

  const onApply = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("artistIds");

      selectedArtistIds.forEach((id) => next.append("artistIds", String(id)));

      next.set("page", "0");
      return next;
    });
  };

  return (
    <div className="artist-filter-widget widget-item mb-4">
      <h3 className="widget-title mb-3">Nghệ sĩ</h3>

      <div className="brand-filter-content">
        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-end-0 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0 shadow-none"
            placeholder="Tìm kiếm nghệ sĩ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div
          className="brand-list pe-2"
          style={{ maxHeight: "220px", overflowY: "auto", overflowX: "hidden" }}
        >
          {filteredArtists.map((artist) => (
            <div className="brand-item mb-2" key={artist.id}>
              <div className="form-check d-flex justify-content-between align-items-center mb-0">
                <div>
                  <input
                    className="form-check-input me-2 shadow-none"
                    type="checkbox"
                    id={`artist-${artist.id}`}
                    checked={selectedArtistIds.includes(artist.id)}
                    onChange={() => toggleArtist(artist.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`artist-${artist.id}`}
                    style={{ cursor: "pointer", fontSize: "0.95rem" }}
                  >
                    {artist.name}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="brand-actions mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
          <button
            type="button"
            className="btn btn-sm text-muted text-decoration-underline px-0 shadow-none"
            onClick={onClear}
          >
            Xóa
          </button>
          <button
            type="button"
            className="btn btn-sm btn-dark px-3 rounded-pill shadow-none"
            onClick={onApply}
          >
            Áp dụng lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistFilterWidget;