import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getAudioTrackById, updateAudioTrack } from "../../apis/audioTrackApi";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import type { UpdateAudioTrackRequest } from "../../requestmodel/UpdateAudioTrackRequest";
import "../../assets/css/artistDashboard.css";
import { parseApiError } from "../../utils/apiError";
import UpdateBasicInfoForm from "../../components/UpdateTrackComponent/UpdateBasicInfoForm";
import UpdateMediaManager from "../../components/UpdateTrackComponent/UpdateMediaManager";
import UpdateSidebar from "../../components/UpdateTrackComponent/UpdateSidebar";


const FALLBACK_COVER_IMAGE = "/assets/img/product/product-1.webp";

const emptyForm = (): UpdateAudioTrackRequest => ({
  title: "", audioType: "", description: "", lyrics: "", duration: null,
  originalFileUrl: "", watermarkedFileUrl: "", coverImage: "", status: "Pending",
});

const resolveMediaUrl = (path: string | null | undefined) => {
  if (!path) return FALLBACK_COVER_IMAGE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `http://localhost:8080${path.startsWith("/") ? path : `/${path}`}`;
};

const UpdateTrackPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [track, setTrack] = useState<AudioTrackModel | null>(null);
  const [form, setForm] = useState<UpdateAudioTrackRequest>(emptyForm);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTrack = async () => {
      const trackId = Number(id);
      if (!id || Number.isNaN(trackId)) {
        setErrorMessage("Thiếu hoặc sai ID tác phẩm.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true); setErrorMessage(null);
        const data = await getAudioTrackById(trackId);
        setTrack(data);
        setForm({
          title: data.title ?? "", audioType: data.audioType ?? "", description: data.description ?? "",
          lyrics: data.lyrics ?? "", duration: data.duration ?? null, originalFileUrl: data.originalFileUrl ?? "",
          watermarkedFileUrl: data.watermarkedFileUrl ?? "", coverImage: data.coverImage ?? "",
          status: data.status ?? (data.uploadDate ? "Approved" : "Pending"),
        });
        setOriginalFile(null);
        setCoverImageFile(null);
        setCoverPreview(resolveMediaUrl(data.coverImage));
      } catch (error: any) {
        setErrorMessage(parseApiError(error, "Không thể tải dữ liệu cập nhật.").message);
      } finally {
        setIsLoading(false);
      }
    };
    void loadTrack();
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "duration" ? (value ? Number(value) : null) : value }));
  };

  const handleOriginalFileChange = (file: File | null) => {
    setOriginalFile(file);
  };

  const handleCoverImageChange = (file: File | null) => {
    setCoverImageFile(file);

    if (!file) {
      setCoverPreview(track ? resolveMediaUrl(track.coverImage) : null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverPreview(typeof event.target?.result === "string" ? event.target.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trackId = Number(id);
    if (!id || Number.isNaN(trackId)) return;

    if (!form.title.trim() || !form.audioType.trim()) {
      await Swal.fire({ icon: "warning", title: "Thiếu thông tin", text: "Vui lòng nhập tên tác phẩm và loại âm thanh." });
      return;
    }

    try {
      setIsSaving(true);
      const updateRequest: UpdateAudioTrackRequest = {
        ...form,
        title: form.title.trim(),
        audioType: form.audioType.trim(),
        description: form.description.trim(),
        lyrics: form.lyrics.trim(),
        status: form.status.trim(),
      };

      const updatedTrack = await updateAudioTrack(
        trackId,
        updateRequest,
        originalFile,
        coverImageFile,
      );

      await Swal.fire({ icon: "success", title: "Cập nhật thành công", text: `Đã cập nhật "${updatedTrack.title}".`, timer: 1800, showConfirmButton: false });
      navigate(`/artist/tracks/view/${updatedTrack.id}`);
    } catch (error: any) {
      await Swal.fire({ icon: "error", title: "Thất bại", text: parseApiError(error, "Không thể cập nhật.").message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container-fluid py-4 px-lg-4 text-center"><div className="spinner-border text-primary" /></div>;
  if (errorMessage || !track) return <div className="container-fluid py-4 px-lg-4"><div className="alert alert-danger">{errorMessage || "Không tìm thấy tác phẩm."}</div></div>;

  return (
    <div className="container-fluid py-4 px-lg-4 artist-page-shell">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h3 className="artist-page-title fw-bold mb-1" style={{ color: "var(--heading-color)" }}>Cập nhật tác phẩm</h3>
          <p className="artist-page-subtitle text-muted mb-0">Chỉnh sửa metadata, file đính kèm và trạng thái hiển thị.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-pill px-4" type="button" onClick={() => navigate("/artist/tracks")}>Quay lại</button>
          <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "var(--accent-color)" }} type="submit" form="update-track-form" disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <form id="update-track-form" onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <UpdateBasicInfoForm form={form} handleChange={handleChange} />
            <UpdateMediaManager
              form={form}
              trackCover={track?.coverImage}
              coverPreview={coverPreview}
              originalFile={originalFile}
              resolveMediaUrl={resolveMediaUrl}
              onOriginalFileChange={handleOriginalFileChange}
              onCoverImageChange={handleCoverImageChange}
            />
          </div>
          <div className="col-lg-4">
            <UpdateSidebar
              form={form}
              track={track}
              coverPreview={coverPreview}
              resolveMediaUrl={resolveMediaUrl}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateTrackPage;