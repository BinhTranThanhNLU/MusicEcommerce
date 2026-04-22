package com.springboot.music.service;

import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.CopyrightInfo;
import com.springboot.music.entity.License;
import com.springboot.music.entity.OrderDetail;
import com.springboot.music.entity.PaymentTransaction;
import com.springboot.music.entity.User;
import com.springboot.music.repository.OrderDetailRepository;
import com.springboot.music.repository.PaymentTransactionRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class CertificateService {

    private static final String FONT_REGULAR_PATH = "/fonts/Roboto-Regular.ttf";
    private static final String FONT_BOLD_PATH = "/fonts/Roboto-Bold.ttf";

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();
    private static final float LEFT_MARGIN = 50f;
    private static final float RIGHT_MARGIN = 50f;
    private static final float TOP_MARGIN = 60f;
    private static final float BOTTOM_MARGIN = 55f;
    private static final float CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN;

    private final OrderDetailRepository orderDetailRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    public CertificateService(OrderDetailRepository orderDetailRepository,
                              PaymentTransactionRepository paymentTransactionRepository) {
        this.orderDetailRepository = orderDetailRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    @Transactional(readOnly = true)
    public GeneratedCertificate generateCertificate(User user, Integer orderDetailId) {
        OrderDetail detail = orderDetailRepository.findCertificateItemForUser(orderDetailId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Bạn không có quyền tải chứng nhận này hoặc chứng nhận không tồn tại"));

        try {
            byte[] pdfBytes = buildCertificatePdf(user, detail);
            String fileName = buildFileName(detail.getAudioTrack());
            return new GeneratedCertificate(pdfBytes, fileName);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể tạo file chứng nhận PDF", ex);
        }
    }

    private byte[] buildCertificatePdf(User user, OrderDetail detail) throws IOException {
        AudioTrack audioTrack = detail.getAudioTrack();
        License license = detail.getLicense();
        User artist = audioTrack.getArtist();
        CopyrightInfo copyrightInfo = audioTrack.getCopyrightInfo();
        PaymentTransaction paymentTransaction = paymentTransactionRepository.findByOrder_Id(detail.getOrder().getId()).orElse(null);

        String licenseeName = safeText(user.getName(), user.getEmail());
        String licenseeEmail = safeText(user.getEmail(), "N/A");
        String licensorName = resolveLicensorName(artist, copyrightInfo);
        String issueDate = formatIssueDate(paymentTransaction, detail.getOrder().getCreatedAt());
        String certificateId = buildCertificateId(detail, user, issueDate);
        String certificateReference = resolveCertificateReference(copyrightInfo, detail.getId());
        String licenseType = safeText(license != null ? license.getLicenseType() : null, "Chưa xác định");
        String assetTitle = safeText(audioTrack.getTitle(), "Untitled");
        String audioSku = "AUDIO-" + audioTrack.getId();
        String usageTerms = buildUsageTerms(licenseType);

        try (PDDocument document = new PDDocument(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            FontPack fontPack = loadFonts(document);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                float y = PAGE_HEIGHT - TOP_MARGIN;

                y = drawCenteredText(contentStream, "GIAY CHUNG NHAN QUYEN SU DUNG AM NHAC", fontPack.bold(), 18f, y, fontPack.supportsUnicode());
                y = drawCenteredText(contentStream, "Music License Certificate", fontPack.regular(), 11f, y - 6, fontPack.supportsUnicode());
                y -= 10;

                y = drawSectionHeader(contentStream, "Thong tin chung nhan", fontPack.bold(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Ma chung nhan", certificateId, fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Ngay cap", issueDate, fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Trang thai don hang", "COMPLETED", fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y -= 4;

                y = drawSectionHeader(contentStream, "Thong tin cac ben", fontPack.bold(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Licensee", licenseeName, fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Email", licenseeEmail, fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Licensor", licensorName, fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y -= 4;

                y = drawSectionHeader(contentStream, "Chi tiet tai nguyen", fontPack.bold(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Ten tai nguyen", assetTitle, fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Item ID / SKU", audioSku, fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Loai giay phep", licenseType, fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y = drawKeyValue(contentStream, "Ma don hang", "#" + detail.getOrder().getId(), fontPack.bold(), fontPack.regular(), y, fontPack.supportsUnicode());
                y -= 4;

                y = drawSectionHeader(contentStream, "Quyen su dung", fontPack.bold(), y, fontPack.supportsUnicode());
                y = drawWrappedParagraph(contentStream, usageTerms, fontPack.regular(), y, 11f, fontPack.supportsUnicode());
                y -= 8;

                y = drawSectionHeader(contentStream, "Xac thuc", fontPack.bold(), y, fontPack.supportsUnicode());
                y = drawWrappedParagraph(contentStream,
                        "Duoc cap tu dong boi He thong thuong mai am nhac so. Chung nhan nay chi hop le cho nguoi mua va don hang da thanh toan thanh cong.",
                        fontPack.regular(), y, 11f, fontPack.supportsUnicode());
                drawWrappedParagraph(contentStream, certificateReference, fontPack.regular(), y - 2, 10f, fontPack.supportsUnicode());
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private FontPack loadFonts(PDDocument document) throws IOException {
        try (InputStream regularStream = getClass().getResourceAsStream(FONT_REGULAR_PATH);
             InputStream boldStream = getClass().getResourceAsStream(FONT_BOLD_PATH)) {
            if (regularStream != null && boldStream != null) {
                return new FontPack(
                        PDType0Font.load(document, regularStream),
                        PDType0Font.load(document, boldStream),
                        true
                );
            }
        }

        return new FontPack(PDType1Font.HELVETICA, PDType1Font.HELVETICA_BOLD, false);
    }

    private float drawCenteredText(PDPageContentStream contentStream,
                                   String text,
                                   PDFont font,
                                   float fontSize,
                                   float y,
                                   boolean supportsUnicode) throws IOException {
        String printable = printableText(text, supportsUnicode);
        float textWidth = font.getStringWidth(printable) / 1000f * fontSize;
        float x = Math.max(LEFT_MARGIN, (PAGE_WIDTH - textWidth) / 2f);

        contentStream.beginText();
        contentStream.setFont(font, fontSize);
        contentStream.newLineAtOffset(x, y);
        contentStream.showText(printable);
        contentStream.endText();
        return y - fontSize - 4;
    }

    private float drawSectionHeader(PDPageContentStream contentStream,
                                    String text,
                                    PDFont font,
                                    float y,
                                    boolean supportsUnicode) throws IOException {
        y = ensureSpace(y, 24f);
        contentStream.setLineWidth(1f);
        contentStream.moveTo(LEFT_MARGIN, y + 8f);
        contentStream.lineTo(PAGE_WIDTH - RIGHT_MARGIN, y + 8f);
        contentStream.stroke();

        contentStream.beginText();
        contentStream.setFont(font, 13f);
        contentStream.newLineAtOffset(LEFT_MARGIN, y);
        contentStream.showText(printableText(text, supportsUnicode));
        contentStream.endText();
        return y - 18f;
    }

    private float drawKeyValue(PDPageContentStream contentStream,
                               String key,
                               String value,
                               PDFont boldFont,
                               PDFont regularFont,
                               float y,
                               boolean supportsUnicode) throws IOException {
        y = ensureSpace(y, 20f);
        contentStream.beginText();
        contentStream.setFont(boldFont, 10.5f);
        contentStream.newLineAtOffset(LEFT_MARGIN, y);
        contentStream.showText(printableText(key + ":", supportsUnicode));
        contentStream.endText();

        List<String> lines = wrapText(value, regularFont, 10.5f, CONTENT_WIDTH - 110f, supportsUnicode);
        float textY = y;
        for (String line : lines) {
            contentStream.beginText();
            contentStream.setFont(regularFont, 10.5f);
            contentStream.newLineAtOffset(160f, textY);
            contentStream.showText(line);
            contentStream.endText();
            textY -= 14f;
        }
        return textY - 2f;
    }

    private float drawWrappedParagraph(PDPageContentStream contentStream,
                                       String text,
                                       PDFont font,
                                       float y,
                                       float fontSize,
                                       boolean supportsUnicode) throws IOException {
        List<String> lines = wrapText(text, font, fontSize, CONTENT_WIDTH, supportsUnicode);
        for (String line : lines) {
            y = ensureSpace(y, fontSize + 8f);
            contentStream.beginText();
            contentStream.setFont(font, fontSize);
            contentStream.newLineAtOffset(LEFT_MARGIN, y);
            contentStream.showText(line);
            contentStream.endText();
            y -= fontSize + 5f;
        }
        return y;
    }

    private float ensureSpace(float y, float neededHeight) {
        return Math.max(y, BOTTOM_MARGIN + neededHeight);
    }

    private List<String> wrapText(String text,
                                  PDFont font,
                                  float fontSize,
                                  float maxWidth,
                                  boolean supportsUnicode) throws IOException {
        String safeText = printableText(text, supportsUnicode).trim();
        List<String> result = new ArrayList<>();
        if (safeText.isBlank()) {
            result.add("");
            return result;
        }

        String[] paragraphs = safeText.split("\\r?\\n");
        for (String paragraph : paragraphs) {
            String[] words = paragraph.trim().split("\\s+");
            StringBuilder line = new StringBuilder();
            for (String word : words) {
                String candidate = line.isEmpty() ? word : line + " " + word;
                if (font.getStringWidth(candidate) / 1000f * fontSize <= maxWidth) {
                    line.setLength(0);
                    line.append(candidate);
                } else {
                    if (!line.isEmpty()) {
                        result.add(line.toString());
                    }
                    line.setLength(0);
                    line.append(word);
                }
            }
            if (!line.isEmpty()) {
                result.add(line.toString());
            }
            result.add("");
        }

        if (!result.isEmpty() && result.get(result.size() - 1).isEmpty()) {
            result.remove(result.size() - 1);
        }
        return result;
    }

    private String printableText(String text, boolean supportsUnicode) {
        String value = text == null ? "" : text;
        if (supportsUnicode) {
            return value;
        }
        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .replace('đ', 'd')
                .replace('Đ', 'D');
    }

    private String buildUsageTerms(String licenseType) {
        String normalized = licenseType == null ? "" : licenseType.trim().toLowerCase(Locale.ROOT);
        if (normalized.contains("thuong mai") || normalized.contains("thương mại") || normalized.contains("commercial")) {
            return "Duoc phep: su dung lam nhac nen cho 1 du an video YouTube/Tiktok (duoc phep bat kiem tien), podcast, phim ngan indie, hoac quang cao digital co ngan sach nho. " +
                    "Khong duoc phep: dang ban lai file goc, dua vao album nhac cua rieng minh roi tu nhan la tac gia (claim Content ID).";
        }
        return "Duoc phep: nghe ca nhan, su dung lam nhac nen cho video gia dinh/ky niem khong dang tai cong khai. " +
                "Khong duoc phep: su dung trong video YouTube bat kiem tien, du an thuong mai, quang cao, phim anh hoac phan phoi lai.";
    }

    private String resolveLicensorName(User artist, CopyrightInfo copyrightInfo) {
        if (copyrightInfo != null && copyrightInfo.getOwnerName() != null && !copyrightInfo.getOwnerName().isBlank()) {
            return copyrightInfo.getOwnerName();
        }
        if (artist != null && artist.getName() != null && !artist.getName().isBlank()) {
            return artist.getName();
        }
        return "Unknown Licensor";
    }

    private String resolveCertificateReference(CopyrightInfo copyrightInfo, Integer orderDetailId) {
        if (copyrightInfo != null && copyrightInfo.getCertificateFileUrl() != null && !copyrightInfo.getCertificateFileUrl().isBlank()) {
            return "Tai lieu tham chieu / Certificate source: " + copyrightInfo.getCertificateFileUrl();
        }
        return "Ma tra cuu noi bo: ORDER-DETAIL-" + orderDetailId + " | Chung nhan duoc cap dong tu du lieu don hang da thanh toan.";
    }

    private String formatIssueDate(PaymentTransaction paymentTransaction, LocalDateTime fallback) {
        LocalDateTime dateTime = paymentTransaction != null && paymentTransaction.getTransactionDate() != null
                ? paymentTransaction.getTransactionDate()
                : fallback;
        if (dateTime == null) {
            dateTime = LocalDateTime.now();
        }
        return DATE_TIME_FORMATTER.format(dateTime);
    }

    private String buildCertificateId(OrderDetail detail, User user, String issueDate) {
        String seed = detail.getId() + "|" + detail.getOrder().getId() + "|" + user.getId() + "|" + issueDate;
        String token = UUID.nameUUIDFromBytes(seed.getBytes(StandardCharsets.UTF_8))
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase(Locale.ROOT);
        return "LIC-" + detail.getOrder().getCreatedAt().getYear() + "-" + token;
    }

    private String buildFileName(AudioTrack audioTrack) {
        String title = audioTrack != null ? audioTrack.getTitle() : null;
        String safeTitle = title == null ? "chung-nhan" : title
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\u00C0-\\u1EF9]+", "-")
                .replaceAll("^-+|-+$", "");
        if (safeTitle.isBlank()) {
            safeTitle = "chung-nhan";
        }
        return "chung-nhan-ban-quyen-" + safeTitle + ".pdf";
    }

    private String safeText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private record FontPack(PDFont regular, PDFont bold, boolean supportsUnicode) {
    }

    public record GeneratedCertificate(byte[] content, String filename) {
    }
}

