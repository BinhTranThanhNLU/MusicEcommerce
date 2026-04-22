const SettingsTab = () => {
  return (
    <div className="tab-pane fade" id="settings">
      <div className="section-header" data-aos="fade-up">
        <h2>Cài đặt tài khoản</h2>
      </div>

      <div className="settings-content">
        {/* Thông tin cá nhân */}
        <div className="settings-section mb-5" data-aos="fade-up">
          <h4 className="mb-4">Thông tin hồ sơ</h4>
          <form className="php-email-form settings-form">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="fullName" className="form-label">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  defaultValue="Trần Thanh Bình"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email định danh (nhận hóa đơn/bản quyền)
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  defaultValue="binh.tran@student.edu.vn"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  defaultValue="0347318239"
                />
              </div>
            </div>
            <div className="form-buttons mt-4">
              <button type="submit" className="btn btn-dark">
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>

        {/* Cài đặt bảo mật */}
        <div
          className="settings-section"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h4 className="mb-4">Bảo mật mật khẩu</h4>
          <form className="php-email-form settings-form">
            <div className="row g-3">
              <div className="col-md-12">
                <label htmlFor="currentPassword" className="form-label">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="currentPassword"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="newPassword" className="form-label">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="confirmPassword" className="form-label">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  required
                />
              </div>
            </div>
            <div className="form-buttons mt-4">
              <button type="submit" className="btn btn-dark">
                Cập nhật mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
