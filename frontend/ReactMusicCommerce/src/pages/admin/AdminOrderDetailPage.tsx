import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminOrderDetail, updateAdminOrderStatus } from "../../apis/adminApi";
import type { AdminOrderWithDetailsDTO } from "../../responsemodel/AdminOrderWithDetailsDTO";
import { parseApiError } from "../../utils/apiError";
import Swal from "sweetalert2";
import AdminOrderInfoCard from "../../components/AdminOrderComponent/AdminOrderInfoCard";
import AdminOrderItemsTable from "../../components/AdminOrderComponent/AdminOrderItemsTable";

const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<AdminOrderWithDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const orderId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [id]);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) {
      setErrorMessage("ID đơn hàng không hợp lệ.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const detail = await getAdminOrderDetail(orderId);
      setOrder(detail);
    } catch (error) {
      setErrorMessage(parseApiError(error, "Không thể tải chi tiết đơn hàng.").message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrderDetail(); }, [fetchOrderDetail]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    const result = await Swal.fire({
      title: "Cập nhật trạng thái",
      input: "select",
      inputOptions: { PENDING: "Chờ xử lý", COMPLETED: "Hoàn thành", FAILED: "Thất bại", REFUNDED: "Hoàn tiền" },
      inputValue: order.paymentStatus,
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed || !result.value) return;

    setUpdatingStatus(true);
    try {
      await updateAdminOrderStatus(order.orderId, result.value);
      setOrder((prev) => (prev ? { ...prev, paymentStatus: result.value } : prev));
      await Swal.fire({ icon: "success", title: "Thành công", text: "Đã cập nhật trạng thái đơn hàng." });
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Thất bại", text: parseApiError(error, "Không thể cập nhật trạng thái.").message });
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="p-5 d-flex justify-content-center"><div className="spinner-border text-primary" role="status" /></div>;
  }

  if (errorMessage || !order) {
    return (
      <div className="container-fluid py-4 px-lg-4">
        <div className="alert alert-danger rounded-4 mb-0" role="alert">{errorMessage || "Không tìm thấy đơn hàng."}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-light rounded-circle me-3 shadow-sm" onClick={() => navigate(-1)} style={{ width: "40px", height: "40px" }}>
          <i className="bi bi-arrow-left" />
        </button>
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Chi tiết đơn hàng #{order.orderId}</h3>
          <p className="text-muted mb-0">Xem và quản lý thông tin đơn hàng</p>
        </div>
      </div>

      <AdminOrderInfoCard order={order} updatingStatus={updatingStatus} onUpdateStatus={handleUpdateStatus} />
      <AdminOrderItemsTable items={order.items} totalItems={order.totalItems} />
    </div>
  );
};

export default AdminOrderDetailPage;