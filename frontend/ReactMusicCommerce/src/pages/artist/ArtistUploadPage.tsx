import "../../assets/css/artistDashboard.css";
import ArtistSidebar from "../../components/layouts/ArtistSidebar";
import ArtistHeader from "../../components/layouts/ArtistHeader";

const ArtistUploadPage = () => {
  return (
    <div className="artist-dashboard d-flex">
      <ArtistSidebar />

      <main className="main-content flex-grow-1 bg-light min-vh-100">
        <ArtistHeader />

        <div className="container-fluid py-4 px-lg-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3
                className="fw-bold mb-1"
                style={{
                  color: "var(--heading-color)",
                  fontFamily: "var(--heading-font)",
                }}
              >
                Đăng Tác Phẩm Mới
              </h3>
              <p className="text-muted mb-0">
                Tải lên file âm thanh chuẩn Lossless/WAV và thiết lập bản quyền.
              </p>
            </div>
            <div>
              <button className="btn btn-outline-secondary rounded-pill px-4 me-2">
                Lưu nháp
              </button>
              <button
                className="btn rounded-pill px-4 shadow-sm text-white"
                style={{ backgroundColor: "var(--accent-color)" }}
              >
                <i className="bi bi-cloud-arrow-up-fill me-2"></i> Xuất bản
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* ================= CỘT TRÁI: UPLOAD FILE & METADATA ================= */}
            <div className="col-lg-8">
              {/* Box 1: Khu vực Upload File Âm Thanh */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-file-earmark-music me-2 text-primary"></i>
                    File Âm Thanh Gốc
                  </h5>

                  {/* Vùng kéo thả file */}
                  <div
                    className="border border-2 border-dashed rounded-4 p-5 text-center bg-light"
                    style={{ borderColor: "#dee2e6", borderStyle: "dashed" }}
                  >
                    <div className="mb-3">
                      <i
                        className="bi bi-cloud-arrow-up text-primary"
                        style={{ fontSize: "3rem" }}
                      ></i>
                    </div>
                    <h6 className="fw-bold">Kéo thả file âm thanh vào đây</h6>
                    <p className="text-muted small mb-3">
                      Hỗ trợ định dạng: WAV, FLAC, MP3 (Tối đa 100MB)
                    </p>
                    <button className="btn btn-primary rounded-pill px-4">
                      Chọn File Máy Tính
                    </button>
                  </div>

                  {/* File đang tải (Ví dụ giả lập) */}
                  <div className="mt-4 p-3 border rounded-3 d-flex align-items-center justify-content-between bg-white">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                        <i className="bi bi-music-note-beamed fs-4"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">
                          Con_Mua_Ngang_Qua_Master.wav
                        </h6>
                        <small className="text-muted">45.2 MB • Hoàn tất</small>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger border-0">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Box 2: Thông tin cơ bản (Metadata) */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Thông tin Tác phẩm</h5>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Tên bài hát <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên bài hát..."
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        Nghệ sĩ thể hiện <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Sơn Tùng M-TP"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        Nhạc sĩ sáng tác
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tên người sáng tác..."
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Lời bài hát (Lyrics)
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Nhập lời bài hát để hỗ trợ người dùng tìm kiếm theo lời..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Box 3: Dữ liệu Tìm kiếm thông minh (Smart Search Metadata) */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">
                      Phân loại & Tìm kiếm thông minh
                    </h5>
                    <span className="badge bg-info bg-opacity-10 text-info rounded-pill">
                      <i className="bi bi-robot"></i> Smart Metadata
                    </span>
                  </div>
                  <p className="text-muted small mb-4">
                    Các thông số này giúp thuật toán AI và công cụ tìm kiếm đề
                    xuất bài hát của bạn chính xác hơn.
                  </p>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-medium">
                        Thể loại (Genre)
                      </label>
                      <select className="form-select">
                        <option>Pop</option>
                        <option>Ballad</option>
                        <option>Hip-hop / Rap</option>
                        <option>EDM</option>
                        <option>Lofi / Chill</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">
                        Tâm trạng (Mood)
                      </label>
                      <select className="form-select">
                        <option>Sôi động (Energetic)</option>
                        <option>Buồn (Sad / Melancholy)</option>
                        <option>Vui vẻ (Happy)</option>
                        <option>Thư giãn (Relaxing)</option>
                        <option>Hùng tráng (Epic)</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">
                        Nhịp độ (BPM)
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Ví dụ: 120"
                        />
                        <span className="input-group-text bg-light">BPM</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label fw-medium">
                      Thẻ từ khóa (Tags)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập từ khóa và nhấn Enter (VD: mua_dong, that_tinh, acoustic...)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CỘT PHẢI: BẢN QUYỀN & GIÁ & ẢNH BÌA ================= */}
            <div className="col-lg-4">
              {/* Box 4: Ảnh Bìa (Cover Art) */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Ảnh Bìa (Artwork)</h5>
                  <div
                    className="position-relative bg-light rounded-4 d-flex align-items-center justify-content-center border"
                    style={{ aspectRatio: "1/1", overflow: "hidden" }}
                  >
                    {/* Placeholder Ảnh */}
                    <div className="text-center text-muted">
                      <i className="bi bi-image fs-1"></i>
                      <p className="small mt-2 mb-0">
                        Tỉ lệ 1:1 (Khuyến nghị 1000x1000px)
                      </p>
                    </div>
                    {/* Nút upload chồng lên */}
                    <button
                      className="btn btn-light position-absolute bottom-0 end-0 m-3 shadow-sm rounded-circle"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className="bi bi-camera-fill text-dark"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Box 5: Thiết lập Bản quyền & Giá */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Bản quyền & Cấp phép</h5>

                  {/* Anti-Piracy / Watermark */}
                  <div className="p-3 bg-warning bg-opacity-10 rounded-3 mb-4 border border-warning border-opacity-25">
                    <div className="form-check form-switch d-flex justify-content-between ps-0 align-items-center">
                      <div>
                        <label
                          className="form-check-label fw-bold text-dark mb-1"
                          htmlFor="watermarkSwitch"
                        >
                          Audio Watermarking{" "}
                          <i className="bi bi-shield-lock-fill text-warning ms-1"></i>
                        </label>
                        <p className="small text-muted mb-0">
                          Tự động chèn âm thanh "AudioJungle" vào bản nghe thử
                          để chống quay lén.
                        </p>
                      </div>
                      <input
                        className="form-check-input fs-4 m-0"
                        type="checkbox"
                        role="switch"
                        id="watermarkSwitch"
                        defaultChecked
                      />
                    </div>
                  </div>

                  {/* Giá Giấy phép Cá nhân */}
                  <div className="mb-3">
                    <label className="form-label fw-bold d-flex align-items-center">
                      <i className="bi bi-person-fill me-2 text-info"></i> Giấy
                      phép Cá nhân
                    </label>
                    <p className="small text-muted mb-2">
                      Nghe cá nhân, không dùng cho mục đích kiếm tiền.
                    </p>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="150.000"
                      />
                      <span className="input-group-text bg-light">VNĐ</span>
                    </div>
                  </div>

                  <hr className="my-4 text-muted" />

                  {/* Giá Giấy phép Thương mại */}
                  <div className="mb-3">
                    <label className="form-label fw-bold d-flex align-items-center">
                      <i className="bi bi-briefcase-fill me-2 text-danger"></i>{" "}
                      Giấy phép Thương mại
                    </label>
                    <p className="small text-muted mb-2">
                      Dùng cho Youtube có bật kiếm tiền, Video Ads, Phim ảnh.
                    </p>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="2.500.000"
                      />
                      <span className="input-group-text bg-light">VNĐ</span>
                    </div>
                  </div>

                  <hr className="my-4 text-muted" />

                  {/* Giá Độc quyền */}
                  <div className="mb-3">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="exclusiveCheck"
                      />
                      <label
                        className="form-check-label fw-bold d-flex align-items-center"
                        htmlFor="exclusiveCheck"
                      >
                        <i className="bi bi-star-fill me-2 text-warning"></i>{" "}
                        Bán đứt (Độc quyền)
                      </label>
                    </div>
                    <p className="small text-muted mb-2">
                      Chuyển nhượng toàn bộ bản quyền cho người mua.
                    </p>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Thỏa thuận hoặc nhập giá"
                        disabled
                      />
                      <span className="input-group-text bg-light">VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistUploadPage;
