import { useEffect, useState } from "react";
import { getAdminOrders } from "../../apis/adminApi";
import type { AdminOrderDTO } from "../../models/AdminOrderDTO";
import { parseApiError } from "../../utils/apiError";
import AdminOrderFilter from "../../components/AdminOrderComponent/AdminOrderFilter";
import AdminOrderTable from "../../components/AdminOrderComponent/AdminOrderTable";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<AdminOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const status = paymentStatus === "all" ? undefined : paymentStatus;
      const data = await getAdminOrders(page, 10, status);
      setOrders(data.orders ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalItems(data.totalItems ?? 0);
    } catch (error) {
      setErrorMessage(parseApiError(error, "Không thể tải danh sách đơn hàng.").message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPage(0); }, [paymentStatus]);
  useEffect(() => { fetchOrders(); }, [page, paymentStatus]);

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Quản lý đơn hàng</h3>
          <p className="text-muted mb-0">Xem và quản lý tất cả đơn hàng của khách hàng</p>
        </div>
      </div>

      <AdminOrderFilter paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} />

      {errorMessage && (
        <div className="alert alert-danger rounded-4 mb-4" role="alert">{errorMessage}</div>
      )}

      <AdminOrderTable 
        orders={orders} loading={loading} page={page} 
        totalPages={totalPages} totalItems={totalItems} setPage={setPage} 
      />
    </div>
  );
};

export default AdminOrdersPage;