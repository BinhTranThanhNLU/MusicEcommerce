package com.springboot.music.service;

import com.springboot.music.dto.AccountOrderDTO;
import com.springboot.music.dto.AccountOrderItemDTO;
import com.springboot.music.dto.AdminUserDTO;
import com.springboot.music.dto.AdminUserDetailDTO;
import com.springboot.music.dto.AdminOrderDTO;
import com.springboot.music.dto.AdminOrderDetailDTO;
import com.springboot.music.dto.AdminOrderWithDetailsDTO;
import com.springboot.music.dto.AdminDashboardOverviewDTO;
import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.AudioTrackModeration;
import com.springboot.music.entity.License;
import com.springboot.music.entity.OrderDetail;
import com.springboot.music.entity.OrderEntity;
import com.springboot.music.entity.PaymentTransaction;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackModerationRepository;
import com.springboot.music.repository.CopyrightInfoRepository;
import com.springboot.music.repository.OrderDetailRepository;
import com.springboot.music.entity.CopyrightInfo;
import com.springboot.music.requestmodel.ModerateAudioTrackRequest;
import com.springboot.music.requestmodel.UpdateCopyrightRequest;
import com.springboot.music.dto.CopyrightInfoDTO;
import com.springboot.music.responsemodel.CopyrightPageResponse;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.mapper.UserMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.OrderRepository;
import com.springboot.music.repository.PaymentTransactionRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.responsemodel.AdminUserPageResponse;
import com.springboot.music.responsemodel.AdminUserOrderPageResponse;
import com.springboot.music.responsemodel.AdminUserTrackPageResponse;
import com.springboot.music.responsemodel.AdminOrderPageResponse;
import com.springboot.music.requestmodel.UpdateOrderStatusRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private static final String ROLE_ARTIST = "artist";
    private static final String ROLE_USER = "user";
    private static final String ORDER_STATUS_PENDING = "PENDING";
    private static final String ORDER_STATUS_COMPLETED = "COMPLETED";
    private static final String ORDER_STATUS_FAILED = "FAILED";
    private static final String TRACK_STATUS_PENDING = "Pending";
    private static final String TRACK_STATUS_APPROVED = "Approved";
    private static final String TRACK_STATUS_REJECTED = "Rejected";
    private static final String TRACK_STATUS_NEED_REVISION = "Need Revision";

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackModerationRepository audioTrackModerationRepository;
    private final CopyrightInfoRepository copyrightInfoRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final AudioTrackMapper audioTrackMapper;
    private final EmailService emailService;

    public AdminService(UserRepository userRepository,
                        UserMapper userMapper,
                        OrderRepository orderRepository,
                        PaymentTransactionRepository paymentTransactionRepository,
                        AudioTrackRepository audioTrackRepository,
                        AudioTrackModerationRepository audioTrackModerationRepository,
                        CopyrightInfoRepository copyrightInfoRepository,
                        OrderDetailRepository orderDetailRepository,
                        AudioTrackMapper audioTrackMapper,
                        EmailService emailService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.orderRepository = orderRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackModerationRepository = audioTrackModerationRepository;
        this.copyrightInfoRepository = copyrightInfoRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.audioTrackMapper = audioTrackMapper;
        this.emailService = emailService;
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getPendingTracks(int page, int size) {
        validatePagination(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("uploadDate").descending());

        Page<AudioTrack> trackPage = audioTrackRepository.findByStatusIgnoreCase(TRACK_STATUS_PENDING, pageable);
        List<AudioTrackDTO> tracks = audioTrackMapper.toDtoList(trackPage.getContent());

        return AudioTrackPageResponse.builder()
                .tracks(tracks)
                .currentPage(trackPage.getNumber())
                .totalPages(trackPage.getTotalPages())
                .totalItems(trackPage.getTotalElements())
                .build();
    }

    @Transactional(readOnly = true)
    public AudioTrackDTO getTrackModerationDetail(Integer audioId) {
        AudioTrack audioTrack = getAudioTrackByIdOrThrow(audioId);
        return audioTrackMapper.toDto(audioTrack);
    }

    @Transactional
    public AudioTrackDTO approveTrack(Integer audioId) {
        return applyModerationDecision(audioId, TRACK_STATUS_APPROVED, null, Collections.emptyList());
    }

    @Transactional
    public AudioTrackDTO rejectTrack(Integer audioId, ModerateAudioTrackRequest request) {
        String reason = normalizeModerationReason(request != null ? request.getReason() : null);
        return applyModerationDecision(audioId, TRACK_STATUS_REJECTED, reason, Collections.emptyList());
    }

    @Transactional
    public AudioTrackDTO requestRevision(Integer audioId, ModerateAudioTrackRequest request) {
        List<String> revisionPoints = normalizeRevisionPoints(request != null ? request.getRevisionPoints() : null);
        String reason = request != null ? normalizeOptionalText(request.getReason()) : null;
        if ((reason == null || reason.isBlank()) && revisionPoints.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần ít nhất một điểm cần sửa hoặc mô tả lý do");
        }
        return applyModerationDecision(audioId, TRACK_STATUS_NEED_REVISION, reason, revisionPoints);
    }

    @Transactional(readOnly = true)
    public CopyrightPageResponse getCopyrights(int page, int size, Integer audioId, String ownerName) {
        validatePagination(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("registeredAt").descending());

        Page<CopyrightInfo> pageResult;
        if (audioId != null && ownerName != null && !ownerName.isBlank()) {
            pageResult = copyrightInfoRepository.findByAudioTrack_IdAndOwnerNameContainingIgnoreCase(audioId, ownerName.trim(), pageable);
        } else if (audioId != null) {
            pageResult = copyrightInfoRepository.findByAudioTrack_Id(audioId, pageable);
        } else if (ownerName != null && !ownerName.isBlank()) {
            pageResult = copyrightInfoRepository.findByOwnerNameContainingIgnoreCase(ownerName.trim(), pageable);
        } else {
            pageResult = copyrightInfoRepository.findAll(pageable);
        }

        List<CopyrightInfoDTO> items = pageResult.getContent().stream().map(this::mapCopyright).toList();

        return CopyrightPageResponse.builder()
                .items(items)
                .currentPage(pageResult.getNumber())
                .totalPages(pageResult.getTotalPages())
                .totalItems(pageResult.getTotalElements())
                .build();
    }

    private AudioTrackDTO applyModerationDecision(Integer audioId, String decision, String reason, List<String> revisionPoints) {
        AudioTrack audioTrack = getAudioTrackByIdOrThrow(audioId);
        String moderatedBy = resolveCurrentModeratorName();

        ensureModerationTransitionAllowed(audioTrack, decision);

        audioTrack.setStatus(decision);
        audioTrackRepository.save(audioTrack);

        AudioTrackModeration moderation = AudioTrackModeration.builder()
                .audioTrack(audioTrack)
                .decision(decision)
                .rejectionReason(reason)
                .revisionPointsJson(serializeRevisionPoints(revisionPoints))
                .moderatedBy(moderatedBy)
                .moderatedAt(LocalDateTime.now())
                .build();
        audioTrackModerationRepository.save(moderation);

        if (audioTrack.getModerationHistory() != null) {
            audioTrack.getModerationHistory().add(moderation);
        }

        notifyArtist(audioTrack, decision, reason, revisionPoints);
        log.info("Admin {} updated moderation for track {} -> {}", moderatedBy, audioId, decision);

        return audioTrackMapper.toDto(audioTrack);
    }

    private void ensureModerationTransitionAllowed(AudioTrack audioTrack, String decision) {
        String currentStatus = normalizeOptionalText(audioTrack.getStatus());
        if (currentStatus == null) {
            return;
        }

        boolean openForModeration = TRACK_STATUS_PENDING.equalsIgnoreCase(currentStatus)
                || TRACK_STATUS_NEED_REVISION.equalsIgnoreCase(currentStatus);
        if (!openForModeration) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Chỉ có thể kiểm duyệt bài hát ở trạng thái Pending hoặc Need Revision");
        }

        if (decision == null || decision.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái kiểm duyệt không được để trống");
        }
    }

    private void notifyArtist(AudioTrack audioTrack, String decision, String reason, List<String> revisionPoints) {
        if (audioTrack.getArtist() == null || audioTrack.getArtist().getEmail() == null || audioTrack.getArtist().getEmail().isBlank()) {
            return;
        }

        try {
            String artistName = audioTrack.getArtist().getName();
            if (TRACK_STATUS_APPROVED.equalsIgnoreCase(decision)) {
                emailService.sendTrackApprovedEmail(audioTrack.getArtist().getEmail(), artistName, audioTrack.getTitle());
            } else if (TRACK_STATUS_REJECTED.equalsIgnoreCase(decision)) {
                emailService.sendTrackRejectedEmail(audioTrack.getArtist().getEmail(), artistName, audioTrack.getTitle(), reason);
            } else if (TRACK_STATUS_NEED_REVISION.equalsIgnoreCase(decision)) {
                emailService.sendTrackRevisionEmail(audioTrack.getArtist().getEmail(), artistName, audioTrack.getTitle(), reason, revisionPoints);
            }
        } catch (RuntimeException ex) {
            log.warn("Không thể gửi email moderation cho track {}: {}", audioTrack.getId(), ex.getMessage());
        }
    }

    private AudioTrack getAudioTrackByIdOrThrow(Integer audioId) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id khong hop le");
        }

        return audioTrackRepository.findById(audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài hát"));
    }

    private String resolveCurrentModeratorName() {
        try {
            if (org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() != null
                    && org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName() != null
                    && !org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName().isBlank()) {
                return org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            }
        } catch (Exception ignored) {
        }
        return "system";
    }

    private String normalizeModerationReason(String reason) {
        String normalized = normalizeOptionalText(reason);
        if (normalized == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lý do từ chối không được để trống");
        }
        return normalized;
    }

    private List<String> normalizeRevisionPoints(List<String> revisionPoints) {
        if (revisionPoints == null || revisionPoints.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> normalized = new ArrayList<>();
        for (String point : revisionPoints) {
            String value = normalizeOptionalText(point);
            if (value != null) {
                normalized.add(value);
            }
        }
        return normalized;
    }

    private String serializeRevisionPoints(List<String> revisionPoints) {
        if (revisionPoints == null || revisionPoints.isEmpty()) {
            return null;
        }

        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(revisionPoints);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể lưu danh sách điểm cần sửa");
        }
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isBlank() ? null : normalized;
    }

    @Transactional(readOnly = true)
    public CopyrightInfoDTO getCopyrightDetail(Integer id) {
        CopyrightInfo info = copyrightInfoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin bản quyền"));
        return mapCopyright(info);
    }

    @Transactional
    public CopyrightInfoDTO updateCopyright(Integer id, UpdateCopyrightRequest request) {
        CopyrightInfo info = copyrightInfoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin bản quyền"));

        if (request.getOwnerName() != null) info.setOwnerName(request.getOwnerName().trim());
        if (request.getIsrcCode() != null) info.setIsrcCode(request.getIsrcCode().trim());
        if (request.getCertificateFileUrl() != null) info.setCertificateFileUrl(request.getCertificateFileUrl().trim());

        CopyrightInfo saved = copyrightInfoRepository.save(info);
        return mapCopyright(saved);
    }

    @Transactional
    public String revokeLicense(Integer orderDetailId) {
        OrderDetail od = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy order detail"));
        od.setLicenseStatus("REVOKED");
        orderDetailRepository.save(od);
        return "Đã thu hồi giấy phép (orderDetailId=" + orderDetailId + ")";
    }

    @Transactional(readOnly = true)
    public AdminDashboardOverviewDTO getDashboardOverview(String period, int points) {
        String normalizedPeriod = normalizePeriod(period);
        int normalizedPoints = normalizePoints(points);
        LocalDateTime startAt = buildStartAt(normalizedPeriod, normalizedPoints);

        long totalTracks = audioTrackRepository.count();
        long totalArtists = userRepository.countByRole_NameIgnoreCase(ROLE_ARTIST);
        long totalUsers = userRepository.countByRole_NameIgnoreCase(ROLE_USER);
        double totalRevenue = defaultDouble(orderDetailRepository.sumTotalAdminRevenue());

        List<AdminDashboardOverviewDTO.AdminRevenuePointDTO> revenueTrend = buildRevenueTrend(normalizedPeriod, normalizedPoints, startAt);
        List<AdminDashboardOverviewDTO.AdminGrowthPointDTO> growthTrend = buildGrowthTrend(normalizedPeriod, normalizedPoints, startAt);
        List<AdminDashboardOverviewDTO.AdminContentDistributionDTO> contentDistribution = buildContentDistribution(totalTracks);

        return AdminDashboardOverviewDTO.builder()
                .period(normalizedPeriod)
                .points(normalizedPoints)
                .totalAudioTracks(totalTracks)
                .totalArtists(totalArtists)
                .totalUsers(totalUsers)
                .totalRevenue(totalRevenue)
                .revenueTrend(revenueTrend)
                .growthTrend(growthTrend)
                .contentDistribution(contentDistribution)
                .build();
    }

    private CopyrightInfoDTO mapCopyright(CopyrightInfo info) {
        if (info == null) return null;
        CopyrightInfoDTO dto = CopyrightInfoDTO.builder()
                .id(info.getId())
                .ownerName(info.getOwnerName())
                .isrcCode(info.getIsrcCode())
                .certificateFileUrl(info.getCertificateFileUrl())
                .registeredAt(info.getRegisteredAt())
                .build();

        if (info.getAudioTrack() != null) {
            dto.setAudioId(info.getAudioTrack().getId());
            dto.setAudioTitle(info.getAudioTrack().getTitle());
            if (info.getAudioTrack().getArtist() != null) {
                dto.setArtistId(info.getAudioTrack().getArtist().getId());
                dto.setArtistName(info.getAudioTrack().getArtist().getName());
            }
        }

        return dto;
    }

    private List<AdminDashboardOverviewDTO.AdminRevenuePointDTO> buildRevenueTrend(String period, int points, LocalDateTime startAt) {
        Map<String, Double> valueByLabel = new LinkedHashMap<>();
        for (String label : buildLabels(period, points)) {
            valueByLabel.put(label, 0.0);
        }

        List<Object[]> rows = orderDetailRepository.sumAdminRevenueByPeriod(period, startAt);
        for (Object[] row : rows) {
            String label = row[0] != null ? String.valueOf(row[0]) : null;
            if (label != null && valueByLabel.containsKey(label)) {
                valueByLabel.put(label, row[1] == null ? 0.0 : ((Number) row[1]).doubleValue());
            }
        }

        return valueByLabel.entrySet().stream()
                .map(e -> AdminDashboardOverviewDTO.AdminRevenuePointDTO.builder()
                        .label(e.getKey())
                        .revenue(e.getValue())
                        .build())
                .toList();
    }

    private List<AdminDashboardOverviewDTO.AdminGrowthPointDTO> buildGrowthTrend(String period, int points, LocalDateTime startAt) {
        Map<String, Long> usersByLabel = toLongMap(userRepository.countRegistrationsByPeriod(ROLE_USER, period, startAt));
        Map<String, Long> artistsByLabel = toLongMap(userRepository.countRegistrationsByPeriod(ROLE_ARTIST, period, startAt));

        List<AdminDashboardOverviewDTO.AdminGrowthPointDTO> result = new ArrayList<>();
        for (String label : buildLabels(period, points)) {
            result.add(AdminDashboardOverviewDTO.AdminGrowthPointDTO.builder()
                    .label(label)
                    .newUsers(usersByLabel.getOrDefault(label, 0L))
                    .newArtists(artistsByLabel.getOrDefault(label, 0L))
                    .build());
        }
        return result;
    }

    private List<AdminDashboardOverviewDTO.AdminContentDistributionDTO> buildContentDistribution(long totalTracks) {
        Map<String, Long> distribution = new LinkedHashMap<>();
        distribution.put("Bai hat hoan chinh", 0L);
        distribution.put("Nhac khong loi", 0L);
        distribution.put("Doan am thanh ngan", 0L);

        for (Object[] row : audioTrackRepository.countByAudioType()) {
            String rawType = row[0] == null ? "" : String.valueOf(row[0]);
            long count = row[1] == null ? 0L : ((Number) row[1]).longValue();
            String key = normalizeContentType(rawType);
            if (distribution.containsKey(key)) {
                distribution.put(key, distribution.get(key) + count);
            }
        }

        List<AdminDashboardOverviewDTO.AdminContentDistributionDTO> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : distribution.entrySet()) {
            double percentage = totalTracks == 0 ? 0.0 : (entry.getValue() * 100.0) / totalTracks;
            result.add(AdminDashboardOverviewDTO.AdminContentDistributionDTO.builder()
                    .contentType(entry.getKey())
                    .count(entry.getValue())
                    .percentage(percentage)
                    .build());
        }

        return result;
    }

    private String normalizePeriod(String period) {
        if (period == null || period.isBlank()) {
            return "month";
        }
        String value = period.trim().toLowerCase(Locale.ROOT);
        if (!"day".equals(value) && !"month".equals(value) && !"year".equals(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "period không hợp lệ. Chỉ chấp nhận: day, month, year");
        }
        return value;
    }

    private int normalizePoints(int points) {
        if (points <= 0 || points > 60) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "points phải nằm trong khoảng 1..60");
        }
        return points;
    }

    private LocalDateTime buildStartAt(String period, int points) {
        LocalDateTime now = LocalDateTime.now();
        return switch (period) {
            case "day" -> now.minusDays(points - 1L).toLocalDate().atStartOfDay();
            case "year" -> now.minusYears(points - 1L).withDayOfYear(1).toLocalDate().atStartOfDay();
            default -> now.minusMonths(points - 1L).withDayOfMonth(1).toLocalDate().atStartOfDay();
        };
    }

    private List<String> buildLabels(String period, int points) {
        List<String> labels = new ArrayList<>(points);
        LocalDate today = LocalDate.now();

        if ("day".equals(period)) {
            DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate start = today.minusDays(points - 1L);
            for (int i = 0; i < points; i++) {
                labels.add(start.plusDays(i).format(f));
            }
            return labels;
        }

        if ("year".equals(period)) {
            int startYear = today.getYear() - points + 1;
            for (int i = 0; i < points; i++) {
                labels.add(String.valueOf(startYear + i));
            }
            return labels;
        }

        DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy-MM");
        YearMonth startMonth = YearMonth.now().minusMonths(points - 1L);
        for (int i = 0; i < points; i++) {
            labels.add(startMonth.plusMonths(i).format(f));
        }
        return labels;
    }

    private Map<String, Long> toLongMap(List<Object[]> rows) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String label = row[0] == null ? null : String.valueOf(row[0]);
            if (label == null) {
                continue;
            }
            long value = row[1] == null ? 0L : ((Number) row[1]).longValue();
            map.put(label, value);
        }
        return map;
    }

    private String normalizeContentType(String rawType) {
        String value = rawType.trim().toLowerCase(Locale.ROOT);
        if (value.contains("full")) {
            return "Bai hat hoan chinh";
        }
        if (value.contains("instrumental")) {
            return "Nhac khong loi";
        }
        if (value.contains("short")) {
            return "Doan am thanh ngan";
        }
        return "";
    }

    private double defaultDouble(Double value) {
        return value == null ? 0.0 : value;
    }

    @Transactional(readOnly = true)
    public AdminUserPageResponse getUsers(int page, int size, String keyword, String role, Boolean isActive) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Chuẩn hóa param để truyền vào query
        String safeKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        String safeRole = (role != null && !role.equals("all")) ? role.trim() : null;

        Page<User> userPage = userRepository.findUsersByAdminFilter(safeKeyword, safeRole, isActive, pageable);

        // Map list User sang list AdminUserDTO
        List<AdminUserDTO> userDTOs = userMapper.toDtoList(userPage.getContent());

        return AdminUserPageResponse.builder()
                .users(userDTOs)
                .currentPage(userPage.getNumber())
                .totalPages(userPage.getTotalPages())
                .totalItems(userPage.getTotalElements())
                .build();
    }

    @Transactional
    public void toggleUserStatus(Integer userId, boolean status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        // Không cho phép Admin tự khóa chính mình
        if (user.getRole().getName().equals("admin") && !status) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể khóa tài khoản quản trị viên khác");
        }

        user.setIsActive(status);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AdminUserDetailDTO getUserDetail(Integer userId) {
        User user = getUserByIdOrThrow(userId);

        return userMapper.toAdminDetailDto(user);
    }

    @Transactional(readOnly = true)
    public AdminUserOrderPageResponse getUserOrders(Integer userId, int page, int size) {
        validatePagination(page, size);
        User user = getUserByIdOrThrow(userId);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderEntity> orderPage = orderRepository.findByUserId(user.getId(), pageable);
        List<AccountOrderDTO> orders = orderPage.getContent().stream()
                .map(this::toAccountOrderDto)
                .toList();

        return AdminUserOrderPageResponse.builder()
                .orders(orders)
                .currentPage(orderPage.getNumber())
                .totalPages(orderPage.getTotalPages())
                .totalItems(orderPage.getTotalElements())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminUserTrackPageResponse getUserTracks(Integer userId, int page, int size) {
        validatePagination(page, size);
        User user = getUserByIdOrThrow(userId);

        if (user.getRole() == null || user.getRole().getName() == null
                || !ROLE_ARTIST.equalsIgnoreCase(user.getRole().getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Người dùng này không phải artist");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("uploadDate").descending());
        Page<AudioTrack> trackPage = audioTrackRepository.findByArtistId(user.getId(), pageable);
        List<AudioTrackDTO> tracks = audioTrackMapper.toDtoList(trackPage.getContent());

        return AdminUserTrackPageResponse.builder()
                .tracks(tracks)
                .currentPage(trackPage.getNumber())
                .totalPages(trackPage.getTotalPages())
                .totalItems(trackPage.getTotalElements())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminOrderPageResponse getAllOrders(int page, int size, String paymentStatus) {
        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderEntity> orderPage = orderRepository.findAllWithFilter(paymentStatus, pageable);
        List<AdminOrderDTO> orders = orderPage.getContent().stream()
                .map(this::toAdminOrderDto)
                .toList();

        return AdminOrderPageResponse.builder()
                .orders(orders)
                .currentPage(orderPage.getNumber())
                .totalPages(orderPage.getTotalPages())
                .totalItems(orderPage.getTotalElements())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminOrderWithDetailsDTO getOrderDetail(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        PaymentTransaction transaction = paymentTransactionRepository.findByOrder_Id(orderId).orElse(null);
        List<AdminOrderDetailDTO> details = new ArrayList<>();

        if (order.getDetails() != null) {
            for (OrderDetail detail : order.getDetails()) {
                AudioTrack audioTrack = detail.getAudioTrack();
                User artist = audioTrack != null ? audioTrack.getArtist() : null;
                License license = detail.getLicense();

                details.add(AdminOrderDetailDTO.builder()
                        .orderDetailId(detail.getId())
                        .audioId(audioTrack != null ? audioTrack.getId() : null)
                        .trackTitle(audioTrack != null ? audioTrack.getTitle() : null)
                        .artistName(artist != null ? artist.getName() : "Unknown Artist")
                        .coverImage(audioTrack != null ? audioTrack.getCoverImage() : null)
                        .licenseType(license != null ? license.getLicenseType() : null)
                        .price(detail.getPrice())
                        .duration(audioTrack != null ? audioTrack.getDuration() : null)
                        .watermarkId(detail.getWatermarkId())
                        .expiredAt(detail.getExpiredAt())
                        .licenseStatus(detail.getLicenseStatus())
                        .build());
            }
        }

        User customer = order.getUser();
        return AdminOrderWithDetailsDTO.builder()
                .orderId(order.getId())
                .userId(customer.getId())
                .customerName(customer.getName())
                .customerEmail(customer.getEmail())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(transaction != null ? transaction.getPaymentMethod() : null)
                .gatewayTransactionCode(transaction != null ? transaction.getGatewayTransactionCode() : null)
                .createdAt(order.getCreatedAt())
                .totalItems(details.size())
                .items(details)
                .build();
    }

    @Transactional
    public String updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request) {
        if (request == null || request.getStatus() == null || request.getStatus().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không được trống");
        }

        String newStatus = request.getStatus().trim().toUpperCase();
        if (!isValidOrderStatus(newStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ. Chỉ chấp nhận: PENDING, COMPLETED, FAILED");
        }

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        String oldStatus = order.getPaymentStatus();
        order.setPaymentStatus(newStatus);
        orderRepository.save(order);

        return "Cập nhật trạng thái từ " + oldStatus + " thành " + newStatus + " thành công";
    }

    private boolean isValidOrderStatus(String status) {
        return ORDER_STATUS_PENDING.equals(status)
                || ORDER_STATUS_COMPLETED.equals(status)
                || ORDER_STATUS_FAILED.equals(status);
    }

    private AdminOrderDTO toAdminOrderDto(OrderEntity order) {
        PaymentTransaction transaction = paymentTransactionRepository.findByOrder_Id(order.getId()).orElse(null);
        User customer = order.getUser();

        return AdminOrderDTO.builder()
                .orderId(order.getId())
                .userId(customer.getId())
                .customerName(customer.getName())
                .customerEmail(customer.getEmail())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(transaction != null ? transaction.getPaymentMethod() : null)
                .gatewayTransactionCode(transaction != null ? transaction.getGatewayTransactionCode() : null)
                .createdAt(order.getCreatedAt())
                .totalItems(order.getDetails() != null ? order.getDetails().size() : 0)
                .build();
    }

    private User getUserByIdOrThrow(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));
    }

    private void validatePagination(int page, int size) {
        if (page < 0 || size <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page/size không hợp lệ");
        }
    }

    private AccountOrderDTO toAccountOrderDto(OrderEntity order) {
        PaymentTransaction transaction = paymentTransactionRepository.findByOrder_Id(order.getId()).orElse(null);
        List<AccountOrderItemDTO> items = new ArrayList<>();

        if (order.getDetails() != null) {
            for (OrderDetail detail : order.getDetails()) {
                var audioTrack = detail.getAudioTrack();
                License license = detail.getLicense();
                User artist = audioTrack != null ? audioTrack.getArtist() : null;

                items.add(AccountOrderItemDTO.builder()
                        .orderDetailId(detail.getId())
                        .audioId(audioTrack != null ? audioTrack.getId() : null)
                        .title(audioTrack != null ? audioTrack.getTitle() : null)
                        .audioType(audioTrack != null ? audioTrack.getAudioType() : null)
                        .artistName(artist != null ? artist.getName() : "Unknown Artist")
                        .coverImage(audioTrack != null ? audioTrack.getCoverImage() : null)
                        .licenseType(license != null ? license.getLicenseType() : null)
                        .price(detail.getPrice())
                        .duration(audioTrack != null ? audioTrack.getDuration() : null)
                        .reviewSubmitted(false)
                        .build());
            }
        }

        return AccountOrderDTO.builder()
                .orderId(order.getId())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(transaction != null ? transaction.getPaymentMethod() : null)
                .gatewayTransactionCode(transaction != null ? transaction.getGatewayTransactionCode() : null)
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .totalItems(items.size())
                .items(items)
                .build();
    }
}
