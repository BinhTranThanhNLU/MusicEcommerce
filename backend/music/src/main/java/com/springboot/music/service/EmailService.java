package com.springboot.music.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.net.URLEncoder;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.frontend.reset-password-url}")
    private String resetPasswordUrl;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    // Gửi mail đặt lại mật khẩu
    public void sendResetPasswordEmail(String toEmail, String resetToken) {
        try {
            String encodedToken = URLEncoder.encode(resetToken, StandardCharsets.UTF_8);
            String resetLink = resetPasswordUrl + "?token=" + encodedToken;

            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) {
                log.warn("Mail sender is not configured, skip sending reset password email");
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset mật khẩu MusicCommerce");
            helper.setText(buildResetPasswordHtml(resetLink), true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset password email: " + e.getMessage());
        }
    }

    public void sendTrackApprovedEmail(String toEmail, String artistName, String trackTitle) {
        sendModerationEmail(toEmail,
                "Bài hát đã được duyệt",
                buildApprovedHtml(artistName, trackTitle));
    }

    public void sendTrackRejectedEmail(String toEmail, String artistName, String trackTitle, String reason) {
        sendModerationEmail(toEmail,
                "Bài hát bị từ chối",
                buildRejectedHtml(artistName, trackTitle, reason));
    }

    public void sendTrackRevisionEmail(String toEmail, String artistName, String trackTitle, List<String> revisionPoints) {
        sendModerationEmail(toEmail,
                "Bài hát cần chỉnh sửa",
                buildRevisionHtml(artistName, trackTitle, revisionPoints));
    }

    private void sendModerationEmail(String toEmail, String subject, String htmlBody) {
        try {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) {
                log.warn("Mail sender is not configured, skip sending email: {}", subject);
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send moderation email: " + e.getMessage(), e);
        }
    }

    private String buildApprovedHtml(String artistName, String trackTitle) {
        return buildBaseHtml("Bài hát đã được duyệt", String.format(
                "Chào %s,<br/><br/>Bài hát <strong>%s</strong> của bạn đã được admin duyệt thành công và sẽ được publish trên hệ thống.",
                escapeHtml(artistName), escapeHtml(trackTitle)));
    }

    private String buildRejectedHtml(String artistName, String trackTitle, String reason) {
        return buildBaseHtml("Bài hát bị từ chối", String.format(
                "Chào %s,<br/><br/>Bài hát <strong>%s</strong> của bạn đã bị từ chối.<br/><br/><strong>Lý do:</strong><br/>%s",
                escapeHtml(artistName), escapeHtml(trackTitle), escapeHtml(reason)));
    }

    private String buildRevisionHtml(String artistName, String trackTitle, List<String> revisionPoints) {
        StringBuilder pointsHtml = new StringBuilder();
        if (revisionPoints != null && !revisionPoints.isEmpty()) {
            pointsHtml.append("<ul>");
            for (String point : revisionPoints) {
                pointsHtml.append("<li>").append(escapeHtml(point)).append("</li>");
            }
            pointsHtml.append("</ul>");
        } else {
            pointsHtml.append("<p>Không có mô tả chi tiết.</p>");
        }

        return buildBaseHtml("Bài hát cần chỉnh sửa", String.format(
                "Chào %s,<br/><br/>Bài hát <strong>%s</strong> của bạn cần chỉnh sửa trước khi được duyệt lại.<br/><br/><strong>Các điểm cần sửa:</strong>%s",
                escapeHtml(artistName), escapeHtml(trackTitle), pointsHtml));
    }

    private String buildBaseHtml(String heading, String body) {
        return String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 24px;">
                    <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e5e7eb;">
                        <h2 style="margin-top: 0; color: #111827;">%s</h2>
                        <p style="color: #374151; line-height: 1.7;">%s</p>
                    </div>
                </body>
                </html>
                """, escapeHtml(heading), body);
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private String buildResetPasswordHtml(String resetLink) {
        return String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 24px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e5e7eb;">
                        <h2 style="margin-top: 0; color: #111827;">Đặt lại mật khẩu</h2>
                        <p style="color: #374151; line-height: 1.6;">
                            Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản MusicCommerce.
                            Nhấn nút bên dưới để tạo mật khẩu mới.
                        </p>
                        <p style="margin: 32px 0;">
                            <a href="%s" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px;">
                                Đặt lại mật khẩu
                            </a>
                        </p>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                            Link này sẽ hết hạn sau 15 phút.
                            Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
                        </p>
                    </div>
                </body>
                </html>
                """, resetLink);
    }
}



