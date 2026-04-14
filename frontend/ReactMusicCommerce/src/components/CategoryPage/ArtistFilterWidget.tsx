const ArtistFilterWidget = () => {
  // Đưa data vào mảng để code nhìn clean hơn và dễ map()
  const artists = [
    { id: "artist1", name: "Sơn Tùng M-TP", count: 156 },
    { id: "artist2", name: "HIEUTHUHAI", count: 98 },
    { id: "artist3", name: "Đen Vâu", count: 85 },
    { id: "artist4", name: "MCK", count: 72 },
    { id: "artist5", name: "tlinh", count: 64 },
    { id: "artist6", name: "Binz", count: 53 },
    { id: "artist7", name: "Vũ.", count: 41 },
    { id: "artist8", name: "SOOBIN", count: 38 },
  ];

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
          />
        </div>

        {/* Artist List with Scroll */}
        <div 
          className="brand-list pe-2" 
          style={{ maxHeight: "220px", overflowY: "auto", overflowX: "hidden" }}
        >
          {artists.map((artist) => (
            <div className="brand-item mb-2" key={artist.id}>
              {/* Dùng flexbox để căn hai bên */}
              <div className="form-check d-flex justify-content-between align-items-center mb-0">
                <div>
                  <input
                    className="form-check-input me-2 shadow-none"
                    type="checkbox"
                    id={artist.id}
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={artist.id}
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
          <button className="btn btn-sm text-muted text-decoration-underline px-0 shadow-none">
            Xóa
          </button>
          <button className="btn btn-sm btn-dark px-3 rounded-pill shadow-none">
            Áp dụng lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistFilterWidget;