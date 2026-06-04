import { useCallback, useEffect, useMemo, useState } from "react";
import { parseApiError } from "../../utils/apiError";
import {
  approveTrack,
  getPendingTracks,
  getTrackModerationDetail,
  rejectTrack,
  requestTrackRevision,
  checkCopyright,
} from "../../apis/adminApi";
import type { AudioTrackDTO } from "../../responsemodel/AudioTrackDTO";
import type { ModerateAudioTrackRequest } from "../../requestmodel/ModerateAudioTrackRequest";
import type { AudioTrackSearchResponse } from "../../models/Search";
import Swal from "sweetalert2";
import AdminModerationHeader from "../../components/AdminModerationComponent/AdminModerationHeader";
import AdminModerationTable from "../../components/AdminModerationComponent/AdminModerationTable";
import AdminModerationDetailModal from "../../components/AdminModerationComponent/AdminModerationDetailModal";
import {
  type ModerationMode,
  type PendingTrackListItem,
  parseRevisionPoints,
} from "../../components/AdminModerationComponent/moderationUtils";

const PAGE_SIZE = 10;

const AdminModerationPage = () => {
  const [tracks, setTracks] = useState<PendingTrackListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<AudioTrackDTO | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [moderationMode, setModerationMode] = useState<ModerationMode | null>(null);
  const [reason, setReason] = useState("");
  const [revisionPointsText, setRevisionPointsText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copyrightCheckLoading, setCopyrightCheckLoading] = useState(false);
  const [copyrightCheckResults, setCopyrightCheckResults] = useState<AudioTrackSearchResponse | null>(null);
  const [copyrightCheckError, setCopyrightCheckError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await getPendingTracks(page, PAGE_SIZE);
      setTracks(response.tracks ?? []);
      setTotalPages(response.totalPages ?? 0);
      setTotalItems(response.totalItems ?? 0);

      if (page > 0 && response.totalPages > 0 && page >= response.totalPages) {
        setPage(response.totalPages - 1);
      }
    } catch (error) {
      setTracks([]);
      setTotalPages(0);
      setTotalItems(0);
      setErrorMessage(parseApiError(error, "Không thể tải danh sách bài hát chờ duyệt.").message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const filteredTracks = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return tracks;
    }

    return tracks.filter((track) => {
      const artistName = track.artist?.name || track.authorName || "";
      const genreText = track.tags?.genres?.join(" ") || "";
      const moodText = track.tags?.moods?.join(" ") || "";
      return [track.title, artistName, track.audioType, genreText, moodText]
        .join(" ")
        .toLowerCase()
        .includes(normalizedKeyword);
    });
  }, [keyword, tracks]);

  const openTrackDetail = useCallback(async (trackId: number) => {
    setSelectedTrack(null);
    setDetailError(null);
    setDetailLoading(true);

    try {
      const detail = await getTrackModerationDetail(trackId);
      setSelectedTrack(detail);
    } catch (error) {
      setDetailError(parseApiError(error, "Không thể tải chi tiết bài hát.").message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeTrackDetail = () => {
    setSelectedTrack(null);
    setDetailError(null);
    setModerationMode(null);
    setReason("");
    setRevisionPointsText("");
    setCopyrightCheckResults(null);
    setCopyrightCheckError(null);
  };

  const handleCheckCopyright = async (trackId: number) => {
    setCopyrightCheckLoading(true);
    setCopyrightCheckError(null);
    setCopyrightCheckResults(null);

    try {
      const results = await checkCopyright(trackId);
      setCopyrightCheckResults(results);
      
      if (results.results && results.results.length === 0) {
        await Swal.fire({
          icon: "info",
          title: "Không tìm thấy bài hát tương tự",
          text: "Bài hát này không có bản ghi âm nào tương tự trong hệ thống.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      const errorMsg = parseApiError(error, "Không thể kiểm tra bản quyền bằng Giai điệu.").message;
      setCopyrightCheckError(errorMsg);
      await Swal.fire({
        icon: "error",
        title: "Lỗi kiểm tra bản quyền",
        text: errorMsg,
      });
    } finally {
      setCopyrightCheckLoading(false);
    }
  };

  const handleApprove = async (trackId: number) => {
    const result = await Swal.fire({
      title: "Duyệt bài hát?",
      text: "Bài hát sẽ được chuyển sang trạng thái đã duyệt.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Duyệt",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#16a34a",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await approveTrack(trackId);
      await Swal.fire({
        icon: "success",
        title: "Đã duyệt",
        text: "Bài hát đã được duyệt thành công.",
        timer: 1800,
        showConfirmButton: false,
      });

      closeTrackDetail();
      await fetchTracks();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Không thể duyệt",
        text: parseApiError(error, "Không thể duyệt bài hát.").message,
      });
    }
  };

  const openModerationForm = (mode: ModerationMode) => {
    setModerationMode(mode);
    setReason(selectedTrack?.rejectionReason || "");
    setRevisionPointsText(selectedTrack?.revisionPoints?.join("\n") || "");
  };

  const submitModeration = async () => {
    if (!selectedTrack || !moderationMode) {
      return;
    }

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu lý do",
        text: "Vui lòng nhập lý do kiểm duyệt.",
      });
      return;
    }

    const request: ModerateAudioTrackRequest = {
      reason: trimmedReason,
      revisionPoints: moderationMode === "revision" ? parseRevisionPoints(revisionPointsText) : [],
    };

    setSubmitting(true);
    try {
      if (moderationMode === "reject") {
        await rejectTrack(selectedTrack.id, request);
      } else {
        await requestTrackRevision(selectedTrack.id, request);
      }

      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text:
          moderationMode === "reject"
            ? "Bài hát đã bị từ chối."
            : "Đã gửi yêu cầu chỉnh sửa cho nghệ sĩ.",
        timer: 1800,
        showConfirmButton: false,
      });

      closeTrackDetail();
      await fetchTracks();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: parseApiError(error, "Không thể cập nhật trạng thái kiểm duyệt.").message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-lg-4">
      <AdminModerationHeader
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        keyword={keyword}
        onKeywordChange={setKeyword}
        onClearKeyword={() => setKeyword("")}
        onRefresh={fetchTracks}
      />

      {errorMessage && (
        <div className="alert alert-danger rounded-4 mb-4" role="alert">
          {errorMessage}
        </div>
      )}

      <AdminModerationTable
        tracks={filteredTracks}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        keyword={keyword}
        onPageChange={setPage}
        onViewDetail={openTrackDetail}
        onApprove={handleApprove}
        onReject={async (trackId) => {
          await openTrackDetail(trackId);
          setModerationMode("reject");
        }}
      />

      <AdminModerationDetailModal
        selectedTrack={selectedTrack}
        detailLoading={detailLoading}
        detailError={detailError}
        moderationMode={moderationMode}
        reason={reason}
        revisionPointsText={revisionPointsText}
        submitting={submitting}
        copyrightCheckLoading={copyrightCheckLoading}
        copyrightCheckResults={copyrightCheckResults}
        copyrightCheckError={copyrightCheckError}
        onClose={closeTrackDetail}
        onReasonChange={setReason}
        onRevisionPointsChange={setRevisionPointsText}
        onOpenModerationForm={openModerationForm}
        onSubmitModeration={submitModeration}
        onApprove={handleApprove}
        onCheckCopyright={handleCheckCopyright}
      />
    </div>
  );
};

export default AdminModerationPage;