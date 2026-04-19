const WhatWillYouReceive = () => {
  return (
    <div className="col-lg-4">
      <div className="package-contents bg-light p-4 rounded h-100">
        <h5 className="mb-4">Bạn sẽ nhận được gì?</h5>
        <ul className="list-unstyled">
          <li className="mb-3 d-flex align-items-start">
            <i className="bi bi-filetype-wav text-primary fs-5 me-3"></i>
            <div>
              <strong>File gốc WAV</strong>
              <div className="text-muted small">
                24-bit / 48kHz, không nén, chất lượng studio.
              </div>
            </div>
          </li>
          <li className="mb-3 d-flex align-items-start">
            <i className="bi bi-filetype-mp3 text-success fs-5 me-3"></i>
            <div>
              <strong>File nén MP3</strong>
              <div className="text-muted small">
                320kbps, tối ưu cho web và mobile.
              </div>
            </div>
          </li>
          <li className="mb-3 d-flex align-items-start">
            <i className="bi bi-file-earmark-check text-info fs-5 me-3"></i>
            <div>
              <strong>Chứng nhận bản quyền</strong>
              <div className="text-muted small">
                File PDF chứng nhận cấp phép sử dụng dựa trên gói bạn đã mua để
                tránh khiếu nại (Content ID).
              </div>
            </div>
          </li>
          <li className="d-flex align-items-start">
            <i className="bi bi-shield-slash text-danger fs-5 me-3"></i>
            <div>
              <strong>Hoàn toàn sạch (No Watermark)</strong>
              <div className="text-muted small">
                Các tệp tải về sẽ loại bỏ toàn bộ âm thanh watermark (tiếng
                bíp/giọng đọc) bảo vệ.
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WhatWillYouReceive;
