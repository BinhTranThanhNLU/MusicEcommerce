import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const WithdrawalAccount = () => {
  const auth = useContext(AuthContext);
  const userName = auth && auth.user ? auth.user.name.toUpperCase() : "NGUYEN THANH TUNG";

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Tài khoản nhận tiền</h5>
          <button className="btn btn-sm btn-light text-primary">
            <i className="bi bi-pencil-square"></i> Sửa
          </button>
        </div>

        <div className="border rounded-4 p-3 mb-3 bg-white d-flex align-items-center" style={{ gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: "linear-gradient(135deg,var(--accent-color),#36b6ff)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 }}>
            {userName.split(" ").map(s=>s[0]).slice(0,2).join("")}
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted small mb-1">Ngân hàng TMCP Ngoại Thương (Vietcombank)</p>
                <h5 className="fw-bold tracking-wider mb-1" style={{ fontFamily: "monospace" }}>0123 4567 8910</h5>
              </div>
              <div className="text-end">
                <button className="btn btn-sm btn-outline-secondary">Sửa</button>
              </div>
            </div>

            <p className="fw-semibold text-dark mb-0 text-uppercase">{userName}</p>
          </div>
        </div>

        <div className="alert alert-info bg-info bg-opacity-10 border-0 small mb-0">
          <i className="bi bi-info-circle-fill me-2"></i>
          Lệnh rút tiền sẽ được xử lý vào ngày 15 và 30 hàng tháng. Mức rút tối
          thiểu là 500.000 ₫.
        </div>
      </div>
    </div>
  );
};

export default WithdrawalAccount;
