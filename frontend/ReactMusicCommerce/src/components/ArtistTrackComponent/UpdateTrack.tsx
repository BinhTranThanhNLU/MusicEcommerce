import { useEffect, useState } from "react";
import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getAudioTrackById, updateAudioTrack } from "../../apis/audioTrackApi";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import type { UpdateAudioTrackRequest } from "../../requestmodel/UpdateAudioTrackRequest";
import "../../assets/css/artistDashboard.css";

const FALLBACK_COVER_IMAGE = "/assets/img/product/product-1.webp";

const emptyForm = (): UpdateAudioTrackRequest => ({
  title: "",
  audioType: "",
  description: "",
  lyrics: "",
  duration: null,
  originalFileUrl: "",
  watermarkedFileUrl: "",
  coverImage: "",
  status: "Pending",
});

const resolveMediaUrl = (path: string | null | undefined) => {
  if (!path) {
    return FALLBACK_COVER_IMAGE;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `http://localhost:8080${path}`;
  }

  return `http://localhost:8080/${path}`;
};

const UpdateTrack = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [track, setTrack] = useState<AudioTrackModel | null>(null);
  const [form, setForm] = useState<UpdateAudioTrackRequest>(emptyForm);
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
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getAudioTrackById(trackId);
        setTrack(data);
        setForm({
          title: data.title ?? "",
          audioType: data.audioType ?? "",
          description: data.description ?? "",
          lyrics: data.lyrics ?? "",
          duration: data.duration ?? null,
          originalFileUrl: data.originalFileUrl ?? "",
          watermarkedFileUrl: data.watermarkedFileUrl ?? "",
          coverImage: data.coverImage ?? "",
          status: data.status ?? (data.uploadDate ? "Approved" : "Pending"),
        });
      } catch (error: any) {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Không thể tải dữ liệu cập nhật.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadTrack();
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "duration" ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trackId = Number(id);
    if (!id || Number.isNaN(trackId)) {
      await Swal.fire({
        icon: "error",
        title: "Thiếu ID tác phẩm",
        text: "Không thể cập nhật vì ID không hợp lệ.",
      });
      return;
    }

    if (!form.title.trim() || !form.audioType.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin bắt buộc",
        text: "Vui lòng nhập tên tác phẩm và loại âm thanh.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const updatedTrack = await updateAudioTrack(trackId, {
        ...form,
        title: form.title.trim(),
        audioType: form.audioType.trim(),
        description: form.description.trim(),
        lyrics: form.lyrics.trim(),
        originalFileUrl: form.originalFileUrl.trim(),
        watermarkedFileUrl: form.watermarkedFileUrl.trim(),
        coverImage: form.coverImage.trim(),
        status: form.status.trim(),
      });

      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        text: `Tác phẩm \"${updatedTrack.title}\" đã được cập nhật.`,
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      navigate(`/artist/tracks/view/${updatedTrack.id}`);
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể cập nhật tác phẩm. Vui lòng thử lại.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4 px-lg-4">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body py-5 text-center">
            <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
            <p className="mb-0 text-muted">Đang tải dữ liệu cập nhật...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !track) {
    return (
      <div className="container-fluid py-4 px-lg-4">
        <div className="alert alert-danger border-0 shadow-sm rounded-4 d-flex justify-content-between align-items-center">
          <div>{errorMessage || "Không tìm thấy tác phẩm."}</div>
          <button className="btn btn-outline-danger" onClick={() => navigate("/artist/tracks")}>Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)", fontFamily: "var(--heading-font)" }}>
            Cập nhật tác phẩm
          </h3>
          <p className="text-muted mb-0">Chỉnh sửa metadata, file đính kèm và trạng thái hiển thị.</p>
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
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Thông tin cơ bản</h5>
                <div className="mb-3">
                  <label className="form-label fw-medium">Tên tác phẩm</label>
                  <input className="form-control" name="title" value={form.title} onChange={handleChange} placeholder="Nhập tên tác phẩm" />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Loại âm thanh</label>
                    <input className="form-control" name="audioType" value={form.audioType} onChange={handleChange} placeholder="Ví dụ: WAV, MP3" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium">Thời lượng (giây)</label>
                    <input className="form-control" name="duration" type="number" min="0" value={form.duration ?? ""} onChange={handleChange} placeholder="240" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium">Trạng thái</label>
                    <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Revision">Revision</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label fw-medium">Mô tả</label>
                  <textarea className="form-control" name="description" rows={4} value={form.description} onChange={handleChange} placeholder="Nhập mô tả tác phẩm" />
                </div>
                <div className="mt-3">
                  <label className="form-label fw-medium">Lời bài hát</label>
                  <textarea className="form-control" name="lyrics" rows={6} value={form.lyrics} onChange={handleChange} placeholder="Nhập lời bài hát" />
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Đường dẫn file và ảnh</h5>
                <div className="mb-3">
                  <label className="form-label fw-medium">File gốc</label>
                  <input className="form-control" name="originalFileUrl" value={form.originalFileUrl} onChange={handleChange} placeholder="/uploads/audio/master.wav" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">File nghe thử</label>
                  <input className="form-control" name="watermarkedFileUrl" value={form.watermarkedFileUrl} onChange={handleChange} placeholder="/uploads/audio/preview.wav" />
                </div>
                <div>
                  <label className="form-label fw-medium">Ảnh bìa</label>
                  <input className="form-control" name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="/uploads/images/cover.jpg" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <img src={resolveMediaUrl(form.coverImage || track.coverImage)} alt={track.title} className="w-100" style={{ aspectRatio: "1 / 1", objectFit: "cover" }} />
              <div className="card-body p-4">
                <h5 className="fw-bold mb-2">{track.title}</h5>
                <p className="text-muted small mb-0">{track.artist?.name}</p>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Ghi chú</h5>
                <p className="text-muted small mb-0">
                  Thay đổi sẽ được gửi ngay tới API cập nhật. Hãy kiểm tra kỹ đường dẫn file và trạng thái trước khi lưu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateTrack;
