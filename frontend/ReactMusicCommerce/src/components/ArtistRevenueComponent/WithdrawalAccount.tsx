import React from "react";

const WithdrawalAccount = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Tài khoản nhận tiền</h5>
          <button className="btn btn-sm btn-light text-primary">
            <i className="bi bi-pencil-square"></i> Sửa
          </button>
        </div>

        <div className="border rounded-4 p-3 mb-3 bg-light position-relative overflow-hidden">
          <div className="position-absolute top-0 end-0 p-2 opacity-25">
            <i className="bi bi-bank fs-1"></i>
          </div>
          <p className="text-muted small mb-1">
            Ngân hàng TMCP Ngoại Thương (Vietcombank)
          </p>
          <h5 className="fw-bold tracking-wider mb-1">0123 4567 8910</h5>
          <p className="fw-medium text-dark mb-0 text-uppercase">
            NGUYEN THANH TUNG
          </p>
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
