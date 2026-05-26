import { useEffect, useState } from "react";
import { getAdminCopyrights } from "../../apis/adminApi";
import type { CopyrightInfoDTO } from "../../models/CopyrightInfoDTO";
import { parseApiError } from "../../utils/apiError";
import AdminCopyrightFilter from "../../components/AdminCopyrightComponent/AdminCopyrightFilter";
import AdminCopyrightTable from "../../components/AdminCopyrightComponent/AdminCopyrightTable";
import AdminCopyrightModal from "../../components/AdminCopyrightComponent/AdminCopyrightModal";

const AdminCopyrightPage = () => {
  const pageSize = 10;
  const [items, setItems] = useState<CopyrightInfoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [audioIdFilter, setAudioIdFilter] = useState<number | undefined>(undefined);
  const [ownerNameFilter, setOwnerNameFilter] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCopyrightId, setSelectedCopyrightId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const fetchCopyrights = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await getAdminCopyrights(page, pageSize, audioIdFilter, ownerNameFilter);
      setItems(data.items ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalItems(data.totalItems ?? 0);
    } catch (error) {
      setErrorMessage(parseApiError(error, "Không thể tải danh sách bản quyền.").message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCopyrights();
  }, [page, audioIdFilter, ownerNameFilter]);

  const handleApplyFilters = (filters: { audioId?: number; ownerName?: string }) => {
    setPage(0);
    setAudioIdFilter(filters.audioId);
    setOwnerNameFilter(filters.ownerName);
  };

  const handleViewCopyright = (id: number) => {
    setSelectedCopyrightId(id);
    setModalMode("view");
  };

  const handleEditCopyright = (id: number) => {
    setSelectedCopyrightId(id);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setSelectedCopyrightId(null);
  };

  const handleSaved = async () => {
    setSelectedCopyrightId(null);
    await fetchCopyrights();
  };

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            Quản lý Bản quyền
          </h3>
          <p className="text-muted mb-0">
            Tra cứu thông tin bản quyền, chủ sở hữu và chỉnh sửa dữ liệu chứng nhận.
          </p>
        </div>
      </div>

      <AdminCopyrightFilter
        initialAudioId={audioIdFilter?.toString()}
        initialOwnerName={ownerNameFilter ?? ""}
        onApply={handleApplyFilters}
      />

      {errorMessage && (
        <div className="alert alert-danger rounded-4 mb-4" role="alert">
          {errorMessage}
        </div>
      )}

      <AdminCopyrightTable
        items={items}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onView={handleViewCopyright}
        onEdit={handleEditCopyright}
        onPageChange={setPage}
      />

      <AdminCopyrightModal
        copyrightId={selectedCopyrightId}
        isOpen={selectedCopyrightId !== null}
        mode={modalMode}
        onClose={handleCloseModal}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default AdminCopyrightPage;