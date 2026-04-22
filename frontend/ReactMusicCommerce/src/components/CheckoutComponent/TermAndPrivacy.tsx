const TermAndPrivacy = () => {
  return (
    <>
      {/* Modal Điều khoản bản quyền */}
      <div
        className="modal fade"
        id="termsModal"
        tabIndex={-1}
        aria-labelledby="termsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="termsModalLabel">
                Điều khoản Mua & Sử dụng Bản quyền
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h6>1. Quyền sở hữu trí tuệ</h6>
              <p>
                Mọi nội dung âm thanh trên hệ thống đều thuộc quyền sở hữu của
                nghệ sĩ sáng tác. Việc mua tài nguyên âm thanh không đồng nghĩa
                với việc bạn sở hữu toàn quyền tác giả của sản phẩm đó.
              </p>

              <h6>2. Quy định về Giấy phép (License)</h6>
              <ul>
                <li>
                  <strong>Giấy phép cá nhân:</strong> Chỉ được phép sử dụng cho
                  mục đích nghe cá nhân hoặc các dự án phi thương mại. Tuyệt đối
                  không đăng tải lại trên các nền tảng kiếm tiền (Youtube,
                  Spotify...).
                </li>
                <li>
                  <strong>Giấy phép thương mại:</strong> Cho phép sử dụng làm
                  nhạc nền cho video Youtube, quảng cáo, phim ảnh tùy theo giới
                  hạn lượt xem được quy định chi tiết trong giấy chứng nhận kèm
                  theo.
                </li>
              </ul>

              <h6>3. Chính sách hoàn tiền</h6>
              <p>
                Do đặc thù của sản phẩm nội dung số, chúng tôi{" "}
                <strong>không hỗ trợ hoàn tiền</strong> sau khi giao dịch đã
                thành công và file âm thanh gốc đã được mở khóa tải về máy của
                bạn.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Tôi đã hiểu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Chính sách bảo mật */}
      <div
        className="modal fade"
        id="privacyModal"
        tabIndex={-1}
        aria-labelledby="privacyModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="privacyModalLabel">
                Chính sách Bảo mật Giao dịch
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân và dữ liệu
                thanh toán của bạn. Các thông tin giao dịch sẽ chỉ được sử dụng
                để xác minh tính hợp lệ của việc mua bán giấy phép bản quyền âm
                thanh.
              </p>
              <p>
                Hệ thống có quyền lưu trữ lịch sử giao dịch và định danh người
                dùng nhằm mục đích cung cấp chứng cứ pháp lý (Giấy chứng nhận
                bản quyền) trong trường hợp có tranh chấp tác quyền xảy ra trong
                tương lai.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Tôi đồng ý
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermAndPrivacy;
