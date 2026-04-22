const DigitalBenefitsList = () => {
  return (
    <div className="benefits-list bg-light p-3 rounded">
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-cloud-arrow-down text-success me-2 fs-5"></i>
        <span className="small">
          Tải xuống tức thì sau khi thanh toán thành công
        </span>
      </div>
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-file-earmark-music text-primary me-2 fs-5"></i>
        <span className="small">
          Nhận file gốc chất lượng cao (WAV, MP3 320kbps) hoàn toàn sạch (Không
          watermark)
        </span>
      </div>
      <div className="d-flex align-items-center">
        <i className="bi bi-patch-check text-info me-2 fs-5"></i>
        <span className="small">
          Được cấp giấy chứng nhận bản quyền số hợp lệ
        </span>
      </div>
    </div>
  );
};

export default DigitalBenefitsList;
