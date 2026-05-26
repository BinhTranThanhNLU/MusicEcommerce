import { SpinningLoading } from "../utils/SpinningLoading";
import type { AdminLicenseModel } from "../../models/AdminLicenseModel";

interface Props {
    licenses: AdminLicenseModel[];
    loading: boolean;
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onView: (orderDetailId: number) => void;
    onRevoke: (orderDetailId: number) => void;
    onPageChange: (page: number | ((current: number) => number)) => void;
}

const formatDateTime = (value: string | null) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("vi-VN");
};

const formatMoney = (value: number | null) => {
    if (value === null || value === undefined) {
        return "-";
    }

    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const getStatusClass = (status: string | null) => {
    switch (status?.toUpperCase()) {
        case "ACTIVE":
            return "bg-success bg-opacity-10 text-success border border-success border-opacity-25";
        case "EXPIRED":
            return "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25";
        case "REVOKED":
            return "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25";
        default:
            return "bg-light text-dark border";
    }
};

const getLicenseTypeClass = (licenseType: string | null) => {
    const value = licenseType?.toLowerCase() ?? "";

    if (value.includes("commercial")) {
        return "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25";
    }

    if (value.includes("exclusive") || value.includes("extended")) {
        return "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25";
    }

    return "bg-info bg-opacity-10 text-info border border-info border-opacity-25";
};

const getLicenseTypeLabel = (licenseType: string | null) => {
    if (!licenseType) {
        return "-";
    }

    const value = licenseType.toLowerCase();

    if (value.includes("personal")) {
        return "Cá nhân";
    }

    if (value.includes("commercial")) {
        return "Thương mại";
    }

    if (value.includes("exclusive") || value.includes("extended")) {
        return "Độc quyền";
    }

    return licenseType;
};

const AdminLicenseTable = ({
    licenses,
    loading,
    page,
    totalPages,
    totalItems,
    pageSize,
    onView,
    onRevoke,
    onPageChange,
}: Props) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
            {loading && (
                <div
                    className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
                    style={{ zIndex: 10 }}
                >
                    <SpinningLoading />
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small text-uppercase">
                        <tr>
                            <th className="ps-4">Giấy phép</th>
                            <th>Bài hát / Nghệ sĩ</th>
                            <th>Khách hàng</th>
                            <th>Loại</th>
                            <th>Trạng thái</th>
                            <th>Thời gian</th>
                            <th>Giá</th>
                            <th className="text-center pe-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {licenses.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4 text-muted">
                                    Không tìm thấy giấy phép nào
                                </td>
                            </tr>
                        ) : (
                            licenses.map((license) => (
                                <tr key={license.orderDetailId}>
                                    <td className="ps-4">
                                        <div className="fw-semibold text-primary">#{license.orderDetailId}</div>
                                        <small className="text-muted">Order #{license.orderId ?? "-"}</small>
                                    </td>
                                    <td>
                                        <div className="fw-semibold text-dark">{license.trackName ?? "-"}</div>
                                        <small className="text-muted">{license.artistName ?? "-"}</small>
                                    </td>
                                    <td>
                                        <div className="fw-semibold">{license.customerName ?? "-"}</div>
                                        <small className="text-muted">{license.customerEmail ?? "-"}</small>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill px-3 py-2 ${getLicenseTypeClass(license.licenseType)}`}>
                                            {getLicenseTypeLabel(license.licenseType)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill px-3 py-2 ${getStatusClass(license.licenseStatus)}`}>
                                            {license.licenseStatus ?? "-"}
                                        </span>
                                    </td>
                                    <td className="small text-muted">
                                        <div>Cấp: {formatDateTime(license.issuedAt)}</div>
                                        <div>Hết hạn: {formatDateTime(license.expiredAt)}</div>
                                    </td>
                                    <td className="fw-semibold text-success">{formatMoney(license.price)}</td>
                                    <td className="text-center pe-4">
                                        <div className="btn-group btn-group-sm" role="group">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => onView(license.orderDetailId)}
                                            >
                                                <i className="bi bi-eye me-1"></i> Xem
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => onRevoke(license.orderDetailId)}
                                            >
                                                <i className="bi bi-shield-x me-1"></i> Thu hồi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="card-footer bg-white p-3 d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center border-top">
                <span className="text-muted small">
                    Hiển thị {licenses.length > 0 ? page * pageSize + 1 : 0}-
                    {Math.min((page + 1) * pageSize, totalItems)} của {totalItems} giấy phép
                </span>
                <nav>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                            <button
                                className="page-link text-dark"
                                onClick={() => onPageChange((current) => Math.max(0, current - 1))}
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
                                onClick={() => onPageChange((current) => current + 1)}
                            >
                                Sau
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AdminLicenseTable;