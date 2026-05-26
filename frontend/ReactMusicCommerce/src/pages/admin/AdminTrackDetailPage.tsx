import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminAudioTrackDetail } from "../../apis/adminApi";
import type { AudioTrackDTO } from "../../responsemodel/AudioTrackDTO";
import { parseApiError } from "../../utils/apiError";

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("vi-VN");
};

const formatDate = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("vi-VN");
};

const formatDuration = (duration?: number | null) => {
    if (typeof duration !== "number" || Number.isNaN(duration) || duration <= 0) {
        return "00:00";
    }

    const totalSeconds = Math.floor(duration);
    const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};

const formatCurrency = (value?: number | null) => {
    if (typeof value !== "number") {
        return "Chưa thiết lập";
    }

    return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
};

const getStatusMeta = (status?: string | null) => {
    const normalizedStatus = status?.trim().toUpperCase() || "PENDING";

    if (normalizedStatus === "APPROVED") {
        return {
            label: "Đã duyệt",
            className: "bg-success bg-opacity-10 text-success border border-success border-opacity-25",
            icon: "bi-check-circle-fill",
        };
    }

    if (normalizedStatus === "PENDING") {
        return {
            label: "Đang chờ duyệt",
            className: "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25",
            icon: "bi-hourglass-split",
        };
    }

    if (normalizedStatus === "NEED REVISION") {
        return {
            label: "Cần chỉnh sửa",
            className: "bg-info bg-opacity-10 text-info border border-info border-opacity-25",
            icon: "bi-pencil-fill",
        };
    }

    if (normalizedStatus === "REJECTED") {
        return {
            label: "Bị từ chối",
            className: "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25",
            icon: "bi-x-circle-fill",
        };
    }

    return {
        label: status || "Không xác định",
        className: "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25",
        icon: "bi-question-circle-fill",
    };
};

const AdminTrackDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [track, setTrack] = useState<AudioTrackDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const trackId = useMemo(() => {
        if (!id) {
            return null;
        }

        const parsed = Number(id);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            return null;
        }

        return parsed;
    }, [id]);

    const fetchTrackDetail = useCallback(async () => {
        if (!trackId) {
            setErrorMessage("ID bài hát không hợp lệ.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const data = await getAdminAudioTrackDetail(trackId);
            setTrack(data);
        } catch (error) {
            setTrack(null);
            setErrorMessage(parseApiError(error, "Không thể tải chi tiết bài hát.").message);
        } finally {
            setLoading(false);
        }
    }, [trackId]);

    useEffect(() => {
        void fetchTrackDetail();
    }, [fetchTrackDetail]);

    if (loading) {
        return (
            <div className="container-fluid py-4 px-lg-4 text-center text-muted">
                <div className="spinner-border text-primary" role="status" aria-hidden="true" />
            </div>
        );
    }

    if (!track) {
        return (
            <div className="container-fluid py-4 px-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
                    <h5 className="text-danger fw-bold mb-2">Không thể tải chi tiết bài hát</h5>
                    <p className="text-muted mb-3">{errorMessage || "Không tìm thấy bài hát."}</p>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button className="btn btn-light" onClick={() => navigate(-1)}>
                            Quay lại
                        </button>
                        <button className="btn btn-primary" onClick={fetchTrackDetail}>
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusMeta = getStatusMeta(track.status);
    const artistName = track.artist?.name || track.authorName || "-";
    const genres = track.tags?.genres?.length ? track.tags.genres : [];
    const moods = track.tags?.moods?.length ? track.tags.moods : [];

    return (
        <div className="container-fluid py-4 px-lg-4">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                        Chi tiết bài hát
                    </h3>
                    <p className="text-muted mb-0">Xem đầy đủ thông tin, bản quyền và trạng thái kiểm duyệt.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left me-2" />
                        Quay lại
                    </button>
                    <button className="btn btn-outline-primary rounded-pill px-4" onClick={fetchTrackDetail}>
                        <i className="bi bi-arrow-clockwise me-2" />
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div className="position-relative">
                            <img
                                src={track.coverImage || "https://placehold.co/800x800?text=Track"}
                                alt={track.title}
                                className="w-100"
                                style={{ aspectRatio: "1 / 1", objectFit: "cover", backgroundColor: "#e2e8f0" }}
                            />
                            <span className={`badge rounded-pill px-3 py-2 position-absolute top-0 end-0 m-3 ${statusMeta.className}`}>
                                <i className={`bi ${statusMeta.icon} me-1`} />
                                {statusMeta.label}
                            </span>
                        </div>

                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                                {track.title}
                            </h4>
                            <p className="text-muted mb-3">{track.description || "Chưa có mô tả cho bài hát này."}</p>

                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                                    {track.audioType || "Chưa xác định"}
                                </span>
                                <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                                    {formatDuration(track.duration)}
                                </span>
                                <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                                    {track.playCount ?? 0} lượt nghe
                                </span>
                            </div>

                            <div className="list-group list-group-flush">
                                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Nghệ sĩ</span>
                                    <strong>{artistName}</strong>
                                </div>
                                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Giá khởi điểm</span>
                                    <strong>{formatCurrency(track.startingPrice)}</strong>
                                </div>
                                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Đánh giá</span>
                                    <strong>
                                        {track.averageRating ?? 0}/5 · {track.reviewCount ?? 0} đánh giá
                                    </strong>
                                </div>
                                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Ngày tải lên</span>
                                    <strong>{formatDate(track.uploadDate)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                                        Thông tin tổng quan
                                    </h5>
                                    <p className="text-muted mb-0">Các thuộc tính chính của bài hát trong hệ thống.</p>
                                </div>
                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2">
                                    ID #{track.id}
                                </span>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-4 h-100">
                                        <div className="text-muted small mb-1">Tệp watermark</div>
                                        <div className="fw-medium text-break" style={{ overflowWrap: "anywhere" }}>
                                            {track.watermarkedFileUrl || "-"}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-4 h-100">
                                        <div className="text-muted small mb-1">Tác giả hiển thị</div>
                                        <div className="fw-medium text-break" style={{ overflowWrap: "anywhere" }}>
                                            {track.authorName || "-"}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-4 h-100">
                                        <div className="text-muted small mb-1">Trạng thái</div>
                                        <div>
                                            <span className={`badge rounded-pill px-3 py-2 ${statusMeta.className}`}>
                                                <i className={`bi ${statusMeta.icon} me-1`} />
                                                {statusMeta.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-4 h-100">
                                        <div className="text-muted small mb-1">Kiểm duyệt bởi / lúc</div>
                                        <div className="fw-medium text-break" style={{ overflowWrap: "anywhere" }}>
                                            {track.moderatedBy || "-"} · {formatDateTime(track.moderatedAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 h-100">
                                <div className="card-body p-4">
                                    <h6 className="fw-bold mb-3">Thể loại</h6>
                                    {genres.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {genres.map((genre) => (
                                                <span key={genre} className="badge bg-dark bg-opacity-10 text-dark rounded-pill px-3 py-2">
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">Chưa gắn thể loại.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 h-100">
                                <div className="card-body p-4">
                                    <h6 className="fw-bold mb-3">Cảm xúc / Mood</h6>
                                    {moods.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {moods.map((mood) => (
                                                <span key={mood} className="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2">
                                                    {mood}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">Chưa gắn mood.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                                Mô tả bài hát
                            </h5>
                            <p className="mb-0 text-body-secondary" style={{ whiteSpace: "pre-wrap" }}>
                                {track.description || "Chưa có mô tả."}
                            </p>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                                Giấy phép
                            </h5>
                            {track.licenses && track.licenses.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead className="table-light text-muted small text-uppercase">
                                            <tr>
                                                <th>Loại giấy phép</th>
                                                <th>Mô tả</th>
                                                <th className="text-end">Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {track.licenses.map((license) => (
                                                <tr key={license.licenseId}>
                                                    <td className="fw-medium">{license.licenseType}</td>
                                                    <td className="text-muted">{license.description}</td>
                                                    <td className="text-end fw-medium">{formatCurrency(license.price)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted mb-0">Chưa có thông tin giấy phép.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTrackDetailPage;