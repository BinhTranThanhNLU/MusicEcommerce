import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTracksByArtist } from "../../apis/audioTrackApi";
import { ErrorMessage } from "../../components/utils/ErrorMessage";
import { AuthContext } from "../../context/AuthContext";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import "../../assets/css/artistDashboard.css";

const PAGE_SIZE = 8;

const ArtistTracksPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [tracks, setTracks] = useState<AudioTrackModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [hoveredPriceTrackId, setHoveredPriceTrackId] = useState<number | null>(null);
  const [pinnedPriceTrackId, setPinnedPriceTrackId] = useState<number | null>(null);

  useEffect(() => {
    const fetchArtistTracks = async () => {
      if (!authContext?.user) {
        setHttpError("Bạn cần đăng nhập để xem kho nhạc nghệ sĩ.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setHttpError(null);

        const data = await getTracksByArtist(authContext.user.id, {
          page,
          size: PAGE_SIZE,
        });

        setTracks(data.tracks ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalItems(data.totalItems ?? 0);
      } catch (error: any) {
        setHttpError(error?.message || "Không thể tải kho nhạc của nghệ sĩ.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchArtistTracks();
  }, [authContext?.user, page]);

  const formatCurrency = (value?: number) => {
    if (typeof value !== "number") {
      return "Chưa thiết lập";
    }

    return new Intl.NumberFormat("vi-VN").format(value) + "₫";
  };

  const normalizeLicenseType = (licenseType: string) => licenseType.toLowerCase();

  const getLicenseLabel = (licenseType: string) => {
    const normalized = normalizeLicenseType(licenseType);

    if (
      normalized.includes("personal") ||
      normalized.includes("cá nhân") ||
      normalized.includes("standard")
    ) {
      return "Cá nhân";
    }

    if (
      normalized.includes("commercial") ||
      normalized.includes("thương mại") ||
      normalized.includes("pro")
    ) {
      return "Thương mại";
    }

    if (
      normalized.includes("exclusive") ||
      normalized.includes("độc quyền") ||
      normalized.includes("buyout")
    ) {
      return "Độc quyền";
    }

    return licenseType;
  };

  const getLicenseTone = (licenseType: string) => {
    const normalized = normalizeLicenseType(licenseType);

    if (
      normalized.includes("personal") ||
      normalized.includes("cá nhân") ||
      normalized.includes("standard")
    ) {
      return "info";
    }

    if (
      normalized.includes("commercial") ||
      normalized.includes("thương mại") ||
      normalized.includes("pro")
    ) {
      return "danger";
    }

    if (
      normalized.includes("exclusive") ||
      normalized.includes("độc quyền") ||
      normalized.includes("buyout")
    ) {
      return "warning";
    }

    return "secondary";
  };

  const getLicenseSummary = (licenses: AudioTrackModel["licenses"]) => {
    const labels = (licenses ?? []).map((license) => getLicenseLabel(license.licenseType));
    return Array.from(new Set(labels));
  };

  const genres = useMemo(() => {
    const allGenres = tracks.flatMap((track) => track.tags?.genres ?? []);
    return Array.from(
      new Set(allGenres.map((item) => item.trim()).filter(Boolean)),
    );
  }, [tracks]);

  const displayedTracks = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return tracks.filter((track) => {
      const matchesKeyword =
        !normalizedKeyword ||
        track.title.toLowerCase().includes(normalizedKeyword) ||
        (track.tags?.genres ?? []).some((genre) =>
          genre.toLowerCase().includes(normalizedKeyword),
        ) ||
        (track.tags?.moods ?? []).some((mood) =>
          mood.toLowerCase().includes(normalizedKeyword),
        );

      const matchesGenre =
        genreFilter === "all" ||
        (track.tags?.genres ?? []).some(
          (genre) => genre.toLowerCase() === genreFilter.toLowerCase(),
        );

      return matchesKeyword && matchesGenre;
    });
  }, [tracks, keyword, genreFilter]);

  if (httpError) {
    return <ErrorMessage message={httpError} />;
  }

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3
            className="fw-bold mb-1"
            style={{ color: "var(--heading-color)" }}
          >
            Kho nhạc của tôi
          </h3>
          <p className="text-muted mb-0">
            Quản lý toàn bộ tác phẩm, chỉnh sửa metadata và theo dõi lượt mua.
          </p>
        </div>
        <div>
          <button
            className="btn rounded-pill px-4 shadow-sm text-white"
            style={{ backgroundColor: "var(--accent-color)" }}
            type="button"
            onClick={() => navigate("/artist/upload")}
          >
            <i className="bi bi-cloud-arrow-up-fill me-2"></i> Tải nhạc lên
          </button>
        </div>
      </div>

      {/* ================= BỘ LỌC & TÌM KIẾM ================= */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          {/* Thanh tìm kiếm */}
          <div className="input-group" style={{ maxWidth: "350px" }}>
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0 ps-0"
              placeholder="Tìm theo tên bài, tag, thể loại..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Lọc theo Trạng thái & Thể loại */}
          <div className="d-flex gap-2">
            <select
              className="form-select bg-light border-0"
              style={{ minWidth: "150px" }}
              disabled
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đang xuất bản</option>
              <option value="pending">Đang chờ duyệt</option>
              <option value="draft">Bản nháp</option>
            </select>

            <select
              className="form-select bg-light border-0"
              style={{ minWidth: "150px" }}
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="all">Mọi thể loại</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ================= BẢNG DANH SÁCH BÀI HÁT ================= */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
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
                      aria-hidden="true"
                    ></div>
                    <p className="mb-0 text-muted">
                      Đang tải kho nhạc của bạn...
                    </p>
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
                            src={
                              track.coverImage || "https://placehold.co/60x60"
                            }
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
                              {(track.tags?.moods ?? [])
                                .slice(0, 1)
                                .map((mood) => (
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
                          onMouseLeave={() => setHoveredPriceTrackId((current) => (current === track.id ? null : current))}
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
                                  <i className="bi bi-info-circle me-1"></i>
                                  Xem giá
                                </button>
                              </div>

                              {((hoveredPriceTrackId === track.id) || (pinnedPriceTrackId === track.id)) && (
                                <div
                                  className="position-absolute start-0 mt-2 p-3 bg-white border rounded-3 shadow-sm"
                                  style={{ minWidth: "290px", zIndex: 5, top: "100%" }}
                                >
                                  <div className="d-flex flex-column gap-2">
                                    {track.licenses.map((license) => {
                                      const tone = getLicenseTone(license.licenseType);
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
                          <div
                            className="text-muted small"
                            title="Lượt nghe thử"
                          >
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
                          to={`/detail-product/${track.id}`}
                          title="Xem chi tiết"
                        >
                          <i className="bi bi-eye text-primary"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-light"
                          title="Tính năng sẽ cập nhật"
                          type="button"
                          disabled
                        >
                          <i className="bi bi-pencil-square text-secondary"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (Pagination) */}
        <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
          <span className="text-muted small">
            Hiển thị {displayedTracks.length > 0 ? page * PAGE_SIZE + 1 : 0} -{" "}
            {page * PAGE_SIZE + displayedTracks.length} của {totalItems} tác
            phẩm
          </span>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  type="button"
                  tabIndex={-1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                >
                  Trước
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, idx) => idx).map(
                (idx) => (
                  <li
                    key={idx}
                    className={`page-item ${idx === page ? "active" : ""}`}
                  >
                    <button
                      className={`page-link ${idx === page ? "" : "text-dark"}`}
                      type="button"
                      style={
                        idx === page
                          ? {
                              backgroundColor: "var(--accent-color)",
                              borderColor: "var(--accent-color)",
                            }
                          : undefined
                      }
                      onClick={() => setPage(idx)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ),
              )}
              <li
                className={`page-item ${page >= totalPages - 1 || totalPages === 0 ? "disabled" : ""}`}
              >
                <button
                  className="page-link text-dark"
                  type="button"
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, Math.max(totalPages - 1, 0)),
                    )
                  }
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

export default ArtistTracksPage;
