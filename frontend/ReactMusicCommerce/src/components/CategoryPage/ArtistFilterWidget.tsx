import { useState, useEffect, useMemo } from "react";
import type React from "react";
import { useSearchParams } from "react-router-dom";
import type { ArtistModel } from "../../models/ArtistModel";

interface ArtistFilterWidgetProps {
  artists: ArtistModel[];
}

const ArtistFilterWidget: React.FC<ArtistFilterWidgetProps> = ({ artists }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync local state from URL on mount and when URL changes
  useEffect(() => {
    setSelectedIds(searchParams.getAll("artistIds"));
  }, [searchParams]);

  const filteredArtists = useMemo(
    () =>
      artists.filter((a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [artists, searchTerm]
  );

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("artistIds");
      selectedIds.forEach((id) => next.append("artistIds", id));
      next.set("page", "0");
      return next;
    });
  };

  const handleClear = () => {
    setSelectedIds([]);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("artistIds");
      next.set("page", "0");
      return next;
    });
  };

  return (
    <div className="artist-filter-widget widget-item mb-4">
      <h3 className="widget-title mb-3">Nghệ sĩ</h3>

      <div className="brand-filter-content">
        {/* Search Input Box */}
        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-end-0 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0 shadow-none"
            placeholder="Tìm kiếm nghệ sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Artist List with Scroll */}
        <div
          className="brand-list pe-2"
          style={{ maxHeight: "220px", overflowY: "auto", overflowX: "hidden" }}
        >
          {filteredArtists.map((artist) => (
            <div className="brand-item mb-2" key={artist.id}>
              {/* Dùng flexbox để căn hai bên */}
              <div className="form-check d-flex justify-content-between align-items-center mb-0">
                <div>
                  <input
                    className="form-check-input me-2 shadow-none"
                    type="checkbox"
                    id={`artist-${artist.id}`}
                    checked={selectedIds.includes(artist.id.toString())}
                    onChange={() => handleToggle(artist.id.toString())}
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

        {/* Action Buttons */}
        <div className="brand-actions mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
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
            Áp dụng lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistFilterWidget;