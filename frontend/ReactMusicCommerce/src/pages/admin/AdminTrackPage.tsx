import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SpinningLoading } from "../../components/utils/SpinningLoading";
import AdminTrackFilter from "../../components/AdminTrackPage/AdminTrackFilter";
import AdminTrackTable from "../../components/AdminTrackPage/AdminTrackTable";
import { getAdminAudioTracks, softDeleteAdminAudioTrack } from "../../apis/adminApi";
import type { AudioTrackDTO } from "../../responsemodel/AudioTrackDTO";
import type { AdminAudioTrackPageResponse } from "../../responsemodel/AdminAudioTrackPageResponse";
import { parseApiError } from "../../utils/apiError";

const PAGE_SIZE = 10;

const AdminTrackPage = () => {
  const navigate = useNavigate();
    const [tracks, setTracks] = useState<AudioTrackDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [audioType, setAudioType] = useState("");
    const [status, setStatus] = useState("all");

    useEffect(() => {
      const timerId = window.setTimeout(() => {
        setDebouncedKeyword(keyword);
      }, 400);

      return () => window.clearTimeout(timerId);
    }, [keyword]);

    useEffect(() => {
      setPage(0);
    }, [debouncedKeyword, audioType, status]);

    const fetchTracks = useCallback(async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const data: AdminAudioTrackPageResponse = await getAdminAudioTracks(
          page,
          PAGE_SIZE,
          debouncedKeyword.trim() || undefined,
          audioType.trim() || undefined,
          status,
        );

        setTracks(data.tracks ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalItems(data.totalItems ?? 0);
      } catch (error) {
        setTracks([]);
        setTotalPages(0);
        setTotalItems(0);
        setErrorMessage(parseApiError(error, "Không thể tải danh sách audio track.").message);
      } finally {
        setLoading(false);
      }
    }, [page, debouncedKeyword, audioType, status]);

    useEffect(() => {
      void fetchTracks();
    }, [fetchTracks]);

    const handleDeleteTrack = async (track: AudioTrackDTO) => {
      try {
        await softDeleteAdminAudioTrack(track.id);

        await Swal.fire({
          icon: "success",
          title: "Đã xóa mềm",
          text: `Bài hát \"${track.title}\" đã được xóa khỏi danh sách quản trị.`,
          timer: 1800,
          showConfirmButton: false,
        });

        await fetchTracks();
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Không thể xóa",
          text: parseApiError(error, "Không thể xóa bài hát.").message,
        });
      }
    };

    const handleResetFilters = () => {
      setKeyword("");
      setAudioType("");
      setStatus("all");
    };

    return (
      <div className="container-fluid py-4 px-lg-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
              Quản lý Nhạc
            </h3>
            <p className="text-muted mb-0">
              Lọc, theo dõi trạng thái và xóa mềm các bài hát trong hệ thống.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-3"
              onClick={() => void fetchTracks()}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Làm mới
            </button>
          </div>
        </div>

        <AdminTrackFilter
          keyword={keyword}
          setKeyword={setKeyword}
          audioType={audioType}
          setAudioType={setAudioType}
          status={status}
          setStatus={setStatus}
          onReset={handleResetFilters}
        />

        {errorMessage && (
          <div className="alert alert-danger rounded-4 mb-4" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
          {loading && (
            <div
              className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
              style={{ zIndex: 10 }}
            >
              <SpinningLoading />
            </div>
          )}

          <AdminTrackTable
            tracks={tracks}
            loading={loading}
            onDeleteTrack={handleDeleteTrack}
            onViewDetail={(trackId) => navigate(`/admin/tracks/${trackId}`)}
          />

          <div className="card-footer bg-white p-3 d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center border-top">
            <span className="text-muted small">
              Hiển thị {tracks.length > 0 ? page * PAGE_SIZE + 1 : 0}-
              {Math.min((page + 1) * PAGE_SIZE, totalItems)} của {totalItems} bài hát
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                  <button
                    className="page-link text-dark"
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                  >
                    Trước
                  </button>
                </li>
                <li className="page-item active">
                  <span
                    className="page-link"
                    style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5" }}
                  >
                    {page + 1} / {totalPages || 1}
                  </span>
                </li>
                <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link text-dark"
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
};

export default AdminTrackPage;