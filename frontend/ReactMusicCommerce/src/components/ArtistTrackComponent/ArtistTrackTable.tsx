import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteAudioTrack } from "../../apis/audioTrackApi";
import type { AudioTrackModel } from "../../models/AudioTrackModel";

const formatCurrency = (value?: number) => {
  if (typeof value !== "number") return "Chưa thiết lập";
  return new Intl.NumberFormat("vi-VN").format(value) + "₫";
};

const normalizeLicenseType = (licenseType: string) => licenseType.toLowerCase();

const getLicenseLabel = (licenseType: string) => {
  const normalized = normalizeLicenseType(licenseType);
  if (
    normalized.includes("personal") ||
    normalized.includes("cá nhân") ||
    normalized.includes("standard")
  )
    return "Cá nhân";
  if (
    normalized.includes("commercial") ||
    normalized.includes("thương mại") ||
    normalized.includes("pro")
  )
    return "Thương mại";
  if (
    normalized.includes("exclusive") ||
    normalized.includes("độc quyền") ||
    normalized.includes("buyout")
  )
    return "Độc quyền";
  return licenseType;
};

const getLicenseTone = (licenseType: string) => {
  const normalized = normalizeLicenseType(licenseType);
  if (
    normalized.includes("personal") ||
    normalized.includes("cá nhân") ||
    normalized.includes("standard")
  )
    return "info";
  if (
    normalized.includes("commercial") ||
    normalized.includes("thương mại") ||
    normalized.includes("pro")
  )
    return "danger";
  if (
    normalized.includes("exclusive") ||
    normalized.includes("độc quyền") ||
    normalized.includes("buyout")
  )
    return "warning";
  return "secondary";
};

const getLicenseSummary = (licenses: AudioTrackModel["licenses"]) => {
  const labels = (licenses ?? []).map((license) =>
    getLicenseLabel(license.licenseType),
  );
  return Array.from(new Set(labels));
};

interface ArtistTrackTableProps {
  isLoading: boolean;
  displayedTracks: AudioTrackModel[];
  onTrackDeleted?: () => Promise<void> | void;
}

const ArtistTrackTable = ({
  isLoading,
  displayedTracks,
  onTrackDeleted,
}: ArtistTrackTableProps) => {
  const [hoveredPriceTrackId, setHoveredPriceTrackId] = useState<number | null>(
    null,
  );
  const [pinnedPriceTrackId, setPinnedPriceTrackId] = useState<number | null>(
    null,
  );
  const [deletingTrackId, setDeletingTrackId] = useState<number | null>(null);

  const handleDeleteTrack = async (track: AudioTrackModel) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Xóa tác phẩm này?",
      text: `Tác phẩm \"${track.title}\" sẽ bị xóa vĩnh viễn và không thể khôi phục.`,
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingTrackId(track.id);
      await deleteAudioTrack(track.id);

      await Swal.fire({
        icon: "success",
        title: "Đã xóa tác phẩm",
        text: `Tác phẩm \"${track.title}\" đã được xóa thành công.`,
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      await onTrackDeleted?.();
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Xóa tác phẩm thất bại",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể xóa tác phẩm. Vui lòng thử lại.",
      });
    } finally {
      setDeletingTrackId(null);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-muted small text-uppercase">
          <tr>
            <th className="ps-4 py-3" style={{ width: "35%" }}>
              Tác phẩm & Metadata
            </th>
            <th className="py-3">Giá bán</th>
            <th className="py-3 text-center">Thống kê</th>
            <th className="py-3 text-center">Trạng thái</th>
            <th className="pe-4 py-3 text-end">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white border-top-0">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center py-5">
                <div
                  className="spinner-border text-dark mb-3"
                  role="status"
                ></div>
                <p className="mb-0 text-muted">Đang tải kho nhạc của bạn...</p>
              </td>
            </tr>
          ) : displayedTracks.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-5 text-muted">
                Không có tác phẩm nào phù hợp bộ lọc hiện tại.
              </td>
            </tr>
          ) : (
            displayedTracks.map((track) => {
              const statusLabel = track.uploadDate
                ? "Đang xuất bản"
                : "Đang chờ duyệt";
              const statusClass = track.uploadDate
                ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                : "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25";

              return (
                <tr key={track.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={track.coverImage || "https://placehold.co/60x60"}
                        alt={track.title}
                        className="rounded-3 me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 className="mb-1 fw-bold text-dark">
                          {track.title}
                        </h6>
                        <div className="d-flex gap-1 flex-wrap mt-1">
                          {(track.tags?.genres ?? [])
                            .slice(0, 2)
                            .map((genre) => (
                              <span
                                key={`genre-${track.id}-${genre}`}
                                className="badge bg-secondary bg-opacity-10 text-secondary border fw-normal"
                              >
                                {genre}
                              </span>
                            ))}
                          {(track.tags?.moods ?? []).slice(0, 1).map((mood) => (
                            <span
                              key={`mood-${track.id}-${mood}`}
                              className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 fw-normal"
                            >
                              {mood}
                            </span>
                          ))}
                          {!track.tags?.genres?.length &&
                            !track.tags?.moods?.length && (
                              <span className="badge bg-light text-muted border fw-normal">
                                Chưa có metadata
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div
                      className="position-relative d-inline-flex flex-column gap-1"
                      onMouseEnter={() => setHoveredPriceTrackId(track.id)}
                      onMouseLeave={() =>
                        setHoveredPriceTrackId((current) =>
                          current === track.id ? null : current,
                        )
                      }
                    >
                      {(track.licenses ?? []).length > 0 ? (
                        <>
                          <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="small text-muted fw-medium">
                              {getLicenseSummary(track.licenses).join(" • ")}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-light border rounded-pill py-0 px-2"
                              onClick={() =>
                                setPinnedPriceTrackId((current) =>
                                  current === track.id ? null : track.id,
                                )
                              }
                            >
                              <i className="bi bi-info-circle me-1"></i> Xem giá
                            </button>
                          </div>
                          {(hoveredPriceTrackId === track.id ||
                            pinnedPriceTrackId === track.id) && (
                            <div
                              className="position-absolute start-0 mt-2 p-3 bg-white border rounded-3 shadow-sm"
                              style={{
                                minWidth: "290px",
                                zIndex: 5,
                                top: "100%",
                              }}
                            >
                              <div className="d-flex flex-column gap-2">
                                {track.licenses.map((license) => {
                                  const tone = getLicenseTone(
                                    license.licenseType,
                                  );
                                  return (
                                    <div
                                      key={license.licenseId}
                                      className="d-flex justify-content-between align-items-start gap-3"
                                    >
                                      <div>
                                        <div
                                          className={`badge bg-${tone} bg-opacity-10 text-${tone} border border-${tone} border-opacity-25 rounded-pill mb-1`}
                                        >
                                          {getLicenseLabel(license.licenseType)}
                                        </div>
                                        <div className="small text-muted">
                                          {license.description || "Giá license"}
                                        </div>
                                      </div>
                                      <strong className="small text-dark">
                                        {formatCurrency(license.price)}
                                      </strong>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-muted">Chưa thiết lập</span>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-3">
                      <div className="text-muted small" title="Lượt nghe thử">
                        <i className="bi bi-play-circle me-1"></i>{" "}
                        {track.playCount ?? 0}
                      </div>
                      <div
                        className="text-success small fw-medium"
                        title="Số lượt đánh giá"
                      >
                        <i className="bi bi-star me-1"></i>{" "}
                        {track.reviewCount ?? 0}
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge rounded-pill px-3 py-2 ${statusClass}`}
                    >
                      <i className="bi bi-check-circle-fill me-1"></i>{" "}
                      {statusLabel}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <Link
                      className="btn btn-sm btn-light me-2"
                      to={`/artist/tracks/view/${track.id}`}
                      title="Xem chi tiết"
                    >
                      <i className="bi bi-eye text-primary"></i>
                    </Link>
                    <Link
                      className="btn btn-sm btn-light"
                      to={`/artist/tracks/update/${track.id}`}
                      title="Cập nhật"
                    >
                      <i className="bi bi-pencil-square text-secondary"></i>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-light ms-2"
                      title="Xóa"
                      onClick={() => void handleDeleteTrack(track)}
                      disabled={deletingTrackId === track.id}
                    >
                      {deletingTrackId === track.id ? (
                        <span className="spinner-border spinner-border-sm text-danger" />
                      ) : (
                        <i className="bi bi-trash text-danger"></i>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArtistTrackTable;
