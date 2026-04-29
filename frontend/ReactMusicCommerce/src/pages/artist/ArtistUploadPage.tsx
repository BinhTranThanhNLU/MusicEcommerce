import "../../assets/css/artistDashboard.css";
import { useEffect, useState } from "react";
import { uploadAudioTrack } from "../../apis/audioTrackApi";
import { getAllGenres } from "../../apis/genreApi";
import { getAllMoods } from "../../apis/moodApi";
import { getAllThemes } from "../../apis/themeApi";
import type { GenreModel } from "../../models/GenreModel";
import type { MoodModel } from "../../models/MoodModel";
import type { ThemeModel } from "../../models/ThemeModel";
import type { CreateAudioTrackRequest } from "../../requestmodel/CreateAudioTrackRequest";
import AudioFileUpload from "../../components/ArtistUploadComponent/AudioFileUpload";
import BasicInfoForm from "../../components/ArtistUploadComponent/BasicInfoForm";
import CoverArtUpload from "../../components/ArtistUploadComponent/CoverArtUpload";
import LicensePricing from "../../components/ArtistUploadComponent/LicensePricing";
import SmartMetadata from "../../components/ArtistUploadComponent/SmartMetadata";
import { parseApiError } from "../../utils/apiError";

interface LicensePriceForm {
  licenseId: number;
  price: number;
}

const ArtistUploadPage = () => {
  // === STATE MANAGEMENT ===
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
    { licenseId: 1, price: 0 },
    { licenseId: 2, price: 0 },
    { licenseId: 3, price: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  // === DATA FETCHING ===
  useEffect(() => {
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
        setApiError(
          parseApiError(error, "Không tải được danh sách genre, mood và theme.")
            .message,
        );
      }
    };
    loadMetadata();
  }, []);

  // === HANDLERS === (Giữ nguyên logic của bạn, loại bỏ error khi user tương tác)
  const clearError = (field: string) =>
    setErrors((prev) => {
      const ne = { ...prev };
      delete ne[field];
      return ne;
    });

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
    clearError(name);
  };

  const handleAudioFileChange = (file: File | null) => {
    setAudioFile(file);
    if (file) clearError("audioFile");
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      setCoverImage(files[0]);
      const reader = new FileReader();
      reader.onload = (event) =>
        setCoverPreview(event.target?.result as string);
      reader.readAsDataURL(files[0]);
      clearError("coverImage");
    }
  };

  const toggleItem = (
    id: number,
    selectedState: number[],
    setSelectedState: any,
    errField?: string,
  ) => {
    setSelectedState(
      selectedState.includes(id)
        ? selectedState.filter((item) => item !== id)
        : [...selectedState, id],
    );
    if (errField) clearError(errField);
  };

  const handleLicensePriceChange = (index: number, price: number) => {
    setLicenses((prev) => {
      const newL = [...prev];
      newL[index].price = price;
      return newL;
    });
    clearError("licenses");
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title không được để trống";
    if (!formData.authorName.trim())
      newErrors.authorName = "Author không được để trống";
    if (formData.duration <= 0)
      newErrors.duration = "Duration phải lớn hơn 0";
    if (!audioFile) newErrors.audioFile = "Audio file không được để trống";
    if (!coverImage) newErrors.coverImage = "Cover image không được để trống";
    if (selectedGenres.length === 0)
      newErrors.genres = "Cần ít nhất 1 genre";
    if (selectedMoods.length === 0)
      newErrors.moods = "Cần ít nhất 1 mood";

    const hasValidLicense = licenses.some((l) => l.price > 0);
    if (!hasValidLicense) newErrors.licenses = "Cần ít nhất 1 license price";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      const licensePrices = licenses
        .filter((l) => l.price > 0)
        .map((l) => ({ licenseId: l.licenseId, price: l.price }));

      const createRequest: CreateAudioTrackRequest = {
        ...formData,
        genreIds: selectedGenres,
        moodIds: selectedMoods,
        themeIds: selectedThemes,
        licensePrices,
      };

      await uploadAudioTrack(createRequest, audioFile!, coverImage!);
      setSuccessMessage("Tải tác phẩm thành công!");

      // Reset form (giữ nguyên logic reset của bạn)
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
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      setApiError(
        parseApiError(error, "Không thể tải tác phẩm.").message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-lg-4 artist-page-shell">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h3
            className="artist-page-title fw-bold mb-1"
            style={{
              color: "var(--heading-color)",
              fontFamily: "var(--heading-font)",
            }}
          >
            Đăng Tác Phẩm Mới
          </h3>
          <p className="artist-page-subtitle text-muted mb-0">
            Tải lên file âm thanh chuẩn Lossless/WAV và thiết lập bản quyền.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-outline-secondary rounded-pill px-4"
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

      {/* Alerts */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible">
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
          <button
            className="btn-close"
            onClick={() => setSuccessMessage("")}
          ></button>
        </div>
      )}
      {apiError && (
        <div className="alert alert-danger alert-dismissible">
          <i className="bi bi-exclamation-circle me-2"></i>
          {apiError}
          <button
            className="btn-close"
            onClick={() => setApiError("")}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* CỘT TRÁI */}
          <div className="col-lg-8">
            <AudioFileUpload
              audioFile={audioFile}
              setAudioFile={handleAudioFileChange}
              error={errors.audioFile}
            />
            <BasicInfoForm
              formData={formData}
              handleFormChange={handleFormChange}
              errors={errors}
            />
            <SmartMetadata
              genres={genres}
              moods={moods}
              themes={themes}
              selectedGenres={selectedGenres}
              selectedMoods={selectedMoods}
              selectedThemes={selectedThemes}
              toggleGenre={(id) =>
                toggleItem(id, selectedGenres, setSelectedGenres, "genres")
              }
              toggleMood={(id) =>
                toggleItem(id, selectedMoods, setSelectedMoods, "moods")
              }
              toggleTheme={(id) =>
                toggleItem(id, selectedThemes, setSelectedThemes)
              }
              errors={errors}
            />
          </div>

          {/* CỘT PHẢI */}
          <div className="col-lg-4">
            <CoverArtUpload
              coverPreview={coverPreview}
              handleCoverImageSelect={handleCoverImageSelect}
              error={errors.coverImage}
            />
            <LicensePricing
              licenses={licenses}
              handleLicensePriceChange={handleLicensePriceChange}
              error={errors.licenses}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArtistUploadPage;
