import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader/AdminHeader";
import AdminSidebar from "../components/AdminHeader/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="admin-layout d-flex" style={{ backgroundColor: "#f8fafc", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: "0 0 260px", flexShrink: 0 }}>
        <AdminSidebar />
      </div>
      
      <div className="main-content flex-grow-1 d-flex flex-column min-vh-100" style={{ minWidth: 0 }}>
        <AdminHeader />
        
        <main className="p-0" style={{ overflowY: "auto", minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;