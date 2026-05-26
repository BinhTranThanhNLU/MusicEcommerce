import { useEffect, useState, type KeyboardEvent } from "react";

interface Props {
    filters: {
        search: string;
        licenseType: string;
        status: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onRefresh: () => void;
}

const AdminLicenseFilter = ({ filters, onFilterChange, onRefresh }: Props) => {
    const [searchInput, setSearchInput] = useState(filters.search);

    useEffect(() => {
        setSearchInput(filters.search);
    }, [filters.search]);

    const handleSearch = () => {
        onFilterChange("search", searchInput.trim());
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleReset = () => {
        setSearchInput("");
        onFilterChange("search", "");
        onFilterChange("licenseType", "all");
        onFilterChange("status", "all");
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3 d-flex flex-column flex-xl-row gap-3 align-items-stretch align-items-xl-end justify-content-between">
                <div className="flex-grow-1" style={{ maxWidth: "480px" }}>
                    <label className="form-label fw-semibold small text-muted text-uppercase">
                        Tìm kiếm
                    </label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control bg-light border-start-0 ps-0"
                            placeholder="Mã giấy phép, đơn hàng, khách hàng, bài hát..."
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <div>
                        <label className="form-label fw-semibold small text-muted text-uppercase">
                            Loại giấy phép
                        </label>
                        <select
                            className="form-select bg-light border-0"
                            style={{ minWidth: "180px" }}
                            value={filters.licenseType}
                            onChange={(event) => onFilterChange("licenseType", event.target.value)}
                        >
                            <option value="all">Tất cả loại</option>
                            <option value="personal">Cá nhân</option>
                            <option value="commercial">Thương mại</option>
                            <option value="exclusive">Độc quyền</option>
                        </select>
                    </div>

                    <div>
                        <label className="form-label fw-semibold small text-muted text-uppercase">
                            Trạng thái
                        </label>
                        <select
                            className="form-select bg-light border-0"
                            style={{ minWidth: "160px" }}
                            value={filters.status}
                            onChange={(event) => onFilterChange("status", event.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hiệu lực</option>
                            <option value="expired">Đã hết hạn</option>
                            <option value="revoked">Đã thu hồi</option>
                        </select>
                    </div>

                    <div className="d-flex gap-2 align-items-end">
                        <button type="button" className="btn btn-primary px-4" onClick={handleSearch}>
                            <i className="bi bi-search me-2"></i>
                            Tìm
                        </button>
                        <button type="button" className="btn btn-light px-4" onClick={handleReset}>
                            Đặt lại
                        </button>
                        <button type="button" className="btn btn-outline-secondary px-4" onClick={onRefresh}>
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Làm mới
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLicenseFilter;