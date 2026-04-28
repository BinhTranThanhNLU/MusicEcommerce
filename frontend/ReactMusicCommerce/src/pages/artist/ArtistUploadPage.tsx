import "../../assets/css/artistDashboard.css";
import { useEffect, useRef, useState } from "react";
import { uploadAudioTrack } from "../../apis/audioTrackApi";
import { getAllGenres } from "../../apis/genreApi";
import { getAllMoods } from "../../apis/moodApi";
import { getAllThemes } from "../../apis/themeApi";
import type { GenreModel } from "../../models/GenreModel";
import type { MoodModel } from "../../models/MoodModel";
import type { ThemeModel } from "../../models/ThemeModel";
import type { CreateAudioTrackRequest } from "../../requestmodel/CreateAudioTrackRequest";

interface LicensePriceForm {
  licenseId: number;
  price: number;
}

const ArtistUploadPage = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    audioType: "Original",
    authorName: "",
    description: "",
    lyrics: "",
    duration: 0,
  });

  const [genres, setGenres] = useState<GenreModel[]>([]);
  const [moods, setMoods] = useState<MoodModel[]>([]);
  const [themes, setThemes] = useState<ThemeModel[]>([]);

  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<number[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);

  const [licenses, setLicenses] = useState<LicensePriceForm[]>([
    { licenseId: 1, price: 0 }, // Personal License
    { licenseId: 2, price: 0 }, // Commercial License
  ]);

  const [isExclusive, setIsExclusive] = useState(false);
  const [exclusivePrice, setExclusivePrice] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const [genresList, moodsList, themesList] = await Promise.all([
        getAllGenres(),
        getAllMoods(),
        getAllThemes(),
      ]);
      setGenres(genresList);
      setMoods(moodsList);
      setThemes(themesList);
    } catch (error) {
      console.error("Failed to load metadata:", error);
      setApiError("Failed to load genres, moods, and themes");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.authorName.trim())
      newErrors.authorName = "Author name is required";
    if (formData.duration <= 0)
      newErrors.duration = "Duration must be greater than 0";
    if (!audioFile) newErrors.audioFile = "Audio file is required";
    if (!coverImage) newErrors.coverImage = "Cover image is required";
    if (selectedGenres.length === 0)
      newErrors.genres = "Select at least one genre";
    if (selectedMoods.length === 0)
      newErrors.moods = "Select at least one mood";

    const hasValidLicense =
      licenses.some((l) => l.price > 0) || (isExclusive && exclusivePrice > 0);
    if (!hasValidLicense) {
      newErrors.licenses = "Set at least one license price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAudioDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverRef.current)
      dragOverRef.current.classList.remove(
        "border-primary",
        "bg-primary",
        "bg-opacity-10",
      );

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("audio/")) {
        setAudioFile(file);
        if (errors.audioFile) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.audioFile;
            return newErrors;
          });
        }
      }
    }
  };

  const handleAudioDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragOverRef.current)
      dragOverRef.current.classList.add(
        "border-primary",
        "bg-primary",
        "bg-opacity-10",
      );
  };

  const handleAudioDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragOverRef.current)
      dragOverRef.current.classList.remove(
        "border-primary",
        "bg-primary",
        "bg-opacity-10",
      );
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      setAudioFile(files[0]);
      if (errors.audioFile) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.audioFile;
          return newErrors;
        });
      }
    }
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      if (errors.coverImage) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.coverImage;
          return newErrors;
        });
      }
    }
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
    if (errors.genres) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.genres;
        return newErrors;
      });
    }
  };

  const toggleMood = (moodId: number) => {
    setSelectedMoods((prev) =>
      prev.includes(moodId)
        ? prev.filter((id) => id !== moodId)
        : [...prev, moodId],
    );
    if (errors.moods) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.moods;
        return newErrors;
      });
    }
  };

  const toggleTheme = (themeId: number) => {
    setSelectedThemes((prev) =>
      prev.includes(themeId)
        ? prev.filter((id) => id !== themeId)
        : [...prev, themeId],
    );
  };

  const handleLicensePriceChange = (index: number, price: number) => {
    setLicenses((prev) => {
      const newLicenses = [...prev];
      newLicenses[index].price = price;
      return newLicenses;
    });
    if (errors.licenses) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.licenses;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const licensePrices: Array<{ licenseId: number; price: number }> = [];
      licenses.forEach((license) => {
        if (license.price > 0) {
          licensePrices.push({
            licenseId: license.licenseId,
            price: license.price,
          });
        }
      });

      if (isExclusive && exclusivePrice > 0) {
        licensePrices.push({
          licenseId: 3, // Assuming 3 is exclusive license
          price: exclusivePrice,
        });
      }

      const createRequest: CreateAudioTrackRequest = {
        title: formData.title,
        audioType: formData.audioType,
        authorName: formData.authorName,
        description: formData.description,
        lyrics: formData.lyrics,
        duration: formData.duration,
        genreIds: selectedGenres,
        moodIds: selectedMoods,
        themeIds: selectedThemes,
        licensePrices,
      };

      await uploadAudioTrack(createRequest, audioFile!, coverImage!);
      setSuccessMessage("Audio track uploaded successfully!");

      // Reset form
      setTimeout(() => {
        setFormData({
          title: "",
          audioType: "Original",
          authorName: "",
          description: "",
          lyrics: "",
          duration: 0,
        });
        setAudioFile(null);
        setCoverImage(null);
        setCoverPreview(null);
        setSelectedGenres([]);
        setSelectedMoods([]);
        setSelectedThemes([]);
        setLicenses([
          { licenseId: 1, price: 0 },
          { licenseId: 2, price: 0 },
        ]);
        setIsExclusive(false);
        setExclusivePrice(0);
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      console.error("Upload failed:", error);
      setApiError(
        error.response?.data?.message || "Failed to upload audio track",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <button
            className="btn btn-outline-secondary rounded-pill px-4 me-2"
            disabled={loading}
          >
            Lưu nháp
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn rounded-pill px-4 shadow-sm text-white"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <i className="bi bi-cloud-arrow-up-fill me-2"></i>{" "}
            {loading ? "Đang tải..." : "Xuất bản"}
          </button>
        </div>
      </div>

      {successMessage && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage("")}
          ></button>
        </div>
      )}

      {apiError && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <i className="bi bi-exclamation-circle me-2"></i>
          {apiError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setApiError("")}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
                  ref={dragOverRef}
                  onDrop={handleAudioDrop}
                  onDragOver={handleAudioDragOver}
                  onDragLeave={handleAudioDragLeave}
                  className="border border-2 border-dashed rounded-4 p-5 text-center bg-light transition"
                  style={{
                    borderColor: "#dee2e6",
                    borderStyle: "dashed",
                    cursor: "pointer",
                  }}
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
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="btn btn-primary rounded-pill px-4"
                  >
                    Chọn File Máy Tính
                  </button>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileSelect}
                    style={{ display: "none" }}
                  />
                </div>

                {errors.audioFile && (
                  <div className="alert alert-danger small mt-2 mb-0">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.audioFile}
                  </div>
                )}

                {/* File đang tải (Ví dụ giả lập) */}
                {audioFile && (
                  <div className="mt-4 p-3 border rounded-3 d-flex align-items-center justify-content-between bg-white">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                        <i className="bi bi-music-note-beamed fs-4"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">{audioFile.name}</h6>
                        <small className="text-muted">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </small>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAudioFile(null)}
                      className="btn btn-sm btn-outline-danger border-0"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                )}
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
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    placeholder="Nhập tên bài hát..."
                  />
                  {errors.title && (
                    <div className="invalid-feedback d-block">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.title}
                    </div>
                  )}
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Định dạng âm thanh <span className="text-danger">*</span>
                    </label>
                    <select
                      name="audioType"
                      value={formData.audioType}
                      onChange={handleFormChange}
                      className="form-select"
                    >
                      <option value="Original">Original</option>
                      <option value="Remix">Remix</option>
                      <option value="Cover">Cover</option>
                      <option value="Mashup">Mashup</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Thời lượng (giây) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleFormChange}
                      className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                      placeholder="Ví dụ: 240"
                      min="1"
                    />
                    {errors.duration && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.duration}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Nghệ sĩ thể hiện <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleFormChange}
                      className={`form-control ${errors.authorName ? "is-invalid" : ""}`}
                      placeholder="Tên tác giả/nghệ sĩ..."
                    />
                    {errors.authorName && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.authorName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="form-control"
                    rows={3}
                    placeholder="Mô tả chi tiết về bài hát..."
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Lời bài hát (Lyrics)
                  </label>
                  <textarea
                    name="lyrics"
                    value={formData.lyrics}
                    onChange={handleFormChange}
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

                {/* Genres */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Thể loại (Genre) <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() => toggleGenre(genre.id)}
                        className={`btn btn-sm rounded-pill ${
                          selectedGenres.includes(genre.id)
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                      >
                        <i className="bi bi-check me-1"></i>
                        {genre.name}
                      </button>
                    ))}
                  </div>
                  {errors.genres && (
                    <div className="alert alert-danger small mt-2 mb-0">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.genres}
                    </div>
                  )}
                </div>

                {/* Moods */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Tâm trạng (Mood) <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => toggleMood(mood.id)}
                        className={`btn btn-sm rounded-pill ${
                          selectedMoods.includes(mood.id)
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                      >
                        <i className="bi bi-check me-1"></i>
                        {mood.name}
                      </button>
                    ))}
                  </div>
                  {errors.moods && (
                    <div className="alert alert-danger small mt-2 mb-0">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.moods}
                    </div>
                  )}
                </div>

                {/* Themes */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Chủ đề (Theme)</label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => toggleTheme(theme.id)}
                        className={`btn btn-sm rounded-pill ${
                          selectedThemes.includes(theme.id)
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                      >
                        <i className="bi bi-check me-1"></i>
                        {theme.name}
                      </button>
                    ))}
                  </div>
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
                  className="position-relative bg-light rounded-4 d-flex align-items-center justify-content-center border overflow-hidden"
                  style={{ aspectRatio: "1/1", backgroundColor: "#f8f9fa" }}
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted">
                      <i className="bi bi-image fs-1"></i>
                      <p className="small mt-2 mb-0">
                        Tỉ lệ 1:1 (Khuyến nghị 1000x1000px)
                      </p>
                    </div>
                  )}
                  {/* Nút upload chồng lên */}
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="btn btn-light position-absolute bottom-0 end-0 m-3 shadow-sm rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="bi bi-camera-fill text-dark"></i>
                  </button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageSelect}
                    style={{ display: "none" }}
                  />
                </div>
                {errors.coverImage && (
                  <div className="alert alert-danger small mt-2 mb-0">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.coverImage}
                  </div>
                )}
              </div>
            </div>

            {/* Box 5: Thiết lập Bản quyền & Giá */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Bản quyền & Cấp phép</h5>

                {/* License Prices */}
                {licenses.map((license, index) => (
                  <div key={license.licenseId} className="mb-3">
                    <label className="form-label fw-bold d-flex align-items-center">
                      <i
                        className={`bi me-2 ${
                          license.licenseId === 1
                            ? "bi-person-fill text-info"
                            : "bi-briefcase-fill text-danger"
                        }`}
                      ></i>
                      {license.licenseId === 1
                        ? "Giấy phép Cá nhân"
                        : "Giấy phép Thương mại"}
                    </label>
                    <p className="small text-muted mb-2">
                      {license.licenseId === 1
                        ? "Nghe cá nhân, không dùng cho mục đích kiếm tiền."
                        : "Dùng cho Youtube có bật kiếm tiền, Video Ads, Phim ảnh."}
                    </p>
                    <div className="input-group">
                      <input
                        type="number"
                        value={license.price || ""}
                        onChange={(e) =>
                          handleLicensePriceChange(
                            index,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="form-control"
                        placeholder="0"
                        min="0"
                      />
                      <span className="input-group-text bg-light">VNĐ</span>
                    </div>
                    {index === 0 && <hr className="my-4 text-muted" />}
                  </div>
                ))}

                <hr className="my-4 text-muted" />

                {/* Giá Độc quyền */}
                <div className="mb-3">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="exclusiveCheck"
                      checked={isExclusive}
                      onChange={(e) => setIsExclusive(e.target.checked)}
                    />
                    <label
                      className="form-check-label fw-bold d-flex align-items-center"
                      htmlFor="exclusiveCheck"
                    >
                      <i className="bi bi-star-fill me-2 text-warning"></i> Bán
                      đứt (Độc quyền)
                    </label>
                  </div>
                  <p className="small text-muted mb-2">
                    Chuyển nhượng toàn bộ bản quyền cho người mua.
                  </p>
                  <div className="input-group">
                    <input
                      type="number"
                      value={exclusivePrice || ""}
                      onChange={(e) =>
                        setExclusivePrice(parseInt(e.target.value) || 0)
                      }
                      className="form-control"
                      placeholder="Thỏa thuận hoặc nhập giá"
                      disabled={!isExclusive}
                      min="0"
                    />
                    <span className="input-group-text bg-light">VNĐ</span>
                  </div>
                </div>

                {errors.licenses && (
                  <div className="alert alert-danger small mt-3 mb-0">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.licenses}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArtistUploadPage;
