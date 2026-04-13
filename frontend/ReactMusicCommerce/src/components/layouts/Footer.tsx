const Footer = () => {
  return (
    <footer id="footer" className="footer dark-background">
      <div className="footer-main">
        <div className="container">
          <div className="row gy-4">
            {/* Cột 1: Giới thiệu & Mạng xã hội */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget footer-about">
                <a href="/" className="logo">
                  <span className="sitename">Music Market</span>
                </a>
                <p>
                  Nền tảng thương mại âm nhạc số bản quyền hàng đầu. Kết nối
                  nghệ sĩ và thính giả với kho nhạc chất lượng cao, minh bạch và
                  bảo vệ quyền sở hữu trí tuệ tuyệt đối.
                </p>

                <div className="social-links mt-4">
                  <h5>Kết nối với chúng tôi</h5>
                  <div className="social-icons">
                    <a href="#" aria-label="Facebook">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" aria-label="Instagram">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" aria-label="Twitter">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#" aria-label="YouTube">
                      <i className="bi bi-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột 2: Khám phá (Thay cho Shop quần áo) */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h4>Khám phá</h4>
                <ul className="footer-links">
                  <li>
                    <a href="/chart/trending">Bảng xếp hạng</a>
                  </li>
                  <li>
                    <a href="/chart/new-release">Mới phát hành</a>
                  </li>
                  <li>
                    <a href="/genres">Thể loại âm nhạc</a>
                  </li>
                  <li>
                    <a href="/mood">Tìm theo tâm trạng</a>
                  </li>
                  <li>
                    <a href="/artists">Nghệ sĩ nổi bật</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Cột 3: Hỗ trợ & Chính sách (Quan trọng cho đề tài bản quyền) */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h4>Hỗ trợ & Bản quyền</h4>
                <ul className="footer-links">
                  <li>
                    <a href="/support">Trung tâm trợ giúp</a>
                  </li>
                  <li>
                    <a href="/license/policy">Chính sách bản quyền</a> {/* Quan trọng */}
                  </li>
                  <li>
                    <a href="/guide/buying">Hướng dẫn mua nhạc</a>
                  </li>
                  <li>
                    <a href="/guide/download">Quy định tải xuống</a>
                  </li>
                  <li>
                    <a href="/artist/register">Dành cho Nghệ sĩ</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Cột 4: Thông tin liên hệ */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h4>Thông tin liên hệ</h4>
                <div className="footer-contact">
                  <div className="contact-item">
                    <i className="bi bi-geo-alt"></i>
                    <span>Trường Đại học</span>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-telephone"></i>
                    <span>0909000000</span>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-envelope"></i>
                    <span>contact@musicmarket.vn</span>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-clock"></i>
                    <span>Hỗ trợ trực tuyến: 24/7</span>
                  </div>
                </div>

                <div className="app-buttons mt-4">
                  <a href="#" className="app-btn">
                    <i className="bi bi-apple"></i>
                    <span>App Store</span>
                  </a>
                  <a href="#" className="app-btn">
                    <i className="bi bi-google-play"></i>
                    <span>Google Play</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row gy-3 align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="copyright">
                <p>
                  © 2025 <span>Copyright</span>{" "}
                  <strong className="sitename">Music Market</strong>. Phát triển bởi{" "}
                  <strong>Sinh viên năm cuối</strong>
                </p>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="d-flex flex-wrap justify-content-lg-end justify-content-center align-items-center gap-4">
                <div className="payment-methods">
                  {/* Icon thanh toán phù hợp cho Digital: Visa, Paypal, Momo... */}
                  <div className="payment-icons text-white fs-4">
                    <i className="bi bi-credit-card me-2" title="Visa/Mastercard"></i>
                    <i className="bi bi-paypal me-2" title="PayPal"></i>
                    <i className="bi bi-wallet2 me-2" title="Ví điện tử"></i>
                    <i className="bi bi-qr-code-scan" title="QR Code"></i>
                  </div>
                </div>

                <div className="legal-links">
                  <a href="/terms">Điều khoản</a>
                  <a href="/privacy">Bảo mật</a>
                  <a href="/cookies">Cookies</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;