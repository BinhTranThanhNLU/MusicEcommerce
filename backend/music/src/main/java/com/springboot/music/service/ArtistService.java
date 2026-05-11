package com.springboot.music.service;

import com.springboot.music.dto.*;
import com.springboot.music.entity.AudioTrackReview;
import com.springboot.music.entity.OrderDetail;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.AudioTrackReviewRepository;
import com.springboot.music.repository.OrderDetailRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.responsemodel.ArtistLicensePageResponse;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.responsemodel.TransactionPageResponse;
import com.springboot.music.specification.AudioTrackSpecification;
import com.springboot.music.specification.OrderDetailSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import java.time.YearMonth;

@Service
public class ArtistService {


    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackMapper audioTrackMapper;
    private final UserRepository userRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final AudioTrackReviewRepository audioTrackReviewRepository;

    public ArtistService(AudioTrackRepository audioTrackRepository, AudioTrackMapper audioTrackMapper, UserRepository userRepository, OrderDetailRepository orderDetailRepository, AudioTrackReviewRepository audioTrackReviewRepository) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackMapper = audioTrackMapper;
        this.userRepository = userRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.audioTrackReviewRepository = audioTrackReviewRepository;
    }

    public List<ArtistDTO> getAllArtists() {
        List<User> artists = audioTrackRepository.findDistinctArtists();

        return artists.stream()
                .map(audioTrackMapper::toArtistSummary)
                .sorted(Comparator.comparing(ArtistDTO::getName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    // Lấy dữ liệu tổng quan cho trang Dashboard chính của Nghệ sĩ
    @Transactional(readOnly = true)
    public ArtistDashboardSummaryDTO getDashboardSummary(String email) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }
        Integer artistId = artist.getId();

        // 1. Lấy dữ liệu KPI chính (sử dụng artistEarnings đã tính hoa hồng)
        Double monthlyRevenue = defaultDouble(orderDetailRepository.sumMonthlyArtistEarningsByArtistId(artistId));
        Long totalCustomers = defaultLong(orderDetailRepository.countDistinctCustomersByArtistId(artistId));
        Long totalReviews = defaultLong(audioTrackReviewRepository.countReviewsByArtistId(artistId));
        Long activeTracks = defaultLong(audioTrackRepository.countActiveTracksByArtistId(artistId));
        long totalSalesDownloads = orderDetailRepository.countTotalLicensesByArtistId(artistId);
        long totalPlayCount = audioTrackRepository.sumPlayCountByArtistId(artistId);
        Double conversionRate = totalPlayCount == 0 ? 0.0 : (totalSalesDownloads * 100.0) / totalPlayCount;

        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .monthlyRevenue(monthlyRevenue)
                .totalCustomers(totalCustomers)
                .totalReviews(totalReviews)
                .activeTracks(activeTracks)
                .totalSalesDownloads(totalSalesDownloads)
                .conversionRate(conversionRate)
                .build();

        List<RevenueChartDTO> revenueChart = buildRevenueChartData(artistId);
        List<RevenuePieDTO> licenseDistribution = buildLicenseDistribution(artistId);
        List<TopTrackDTO> topPerformingTracks = buildTopPerformingTracks(artistId);

        // 2. Lấy dữ liệu Hoạt động tương tác (Trộn Order và Review)
        Pageable top5 = PageRequest.of(0, 5);
        List<OrderDetail> recentOrders = orderDetailRepository.findRecentOrdersByArtistId(artistId, top5);
        List<AudioTrackReview> recentReviews = audioTrackReviewRepository.findRecentReviewsByArtistId(artistId, top5);

        List<RecentActivityDTO> activities = new ArrayList<>();

        // Map Đơn hàng sang Activity
        for (OrderDetail od : recentOrders) {
            String licenseType = od.getLicense().getLicenseType().contains("Commercial") ? "Thương mại" : "Cá nhân";
            activities.add(RecentActivityDTO.builder()
                    .user(od.getOrder().getUser().getName())
                    .action("Đã mua Giấy phép " + licenseType + ": '" + od.getAudioTrack().getTitle() + "'")
                    .icon("bi-cart-check")
                    .color("text-success")
                    .createdAt(od.getOrder().getCreatedAt())
                    .build());
        }

        // Map Review sang Activity
        for (AudioTrackReview rev : recentReviews) {
            activities.add(RecentActivityDTO.builder()
                    .user(rev.getUser().getName())
                    .action("Đã đánh giá " + rev.getRating() + " sao: '" + rev.getAudioTrack().getTitle() + "'")
                    .icon("bi-star-fill")
                    .color("text-warning")
                    .createdAt(rev.getCreatedAt())
                    .build());
        }

        // Sắp xếp trộn lẫn theo thời gian mới nhất (DESC) và lấy 5 cái đầu tiên
        activities.sort((a1, a2) -> a2.getCreatedAt().compareTo(a1.getCreatedAt()));
        if (activities.size() > 5) {
            activities = activities.subList(0, 5);
        }

        return ArtistDashboardSummaryDTO.builder()
                .stats(stats)
                .revenueChart(revenueChart)
                .licenseDistribution(licenseDistribution)
                .topPerformingTracks(topPerformingTracks)
                .recentActivities(activities)
                .build();
    }

    // Lấy danh sách giấy phép đã bán của nghệ sĩ đang đăng nhập, có hỗ trợ phân trang, lọc và tìm kiếm
    @Transactional(readOnly = true)
    public ArtistLicensePageResponse getArtistLicenses(String email, int page, int size, String search, String licenseType, String status) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }

        Pageable pageable = PageRequest.of(page, size);

        Page<OrderDetail> orderDetailPage = orderDetailRepository.findAll(
                OrderDetailSpecification.filterForArtist(artist.getId(), search, licenseType, status),
                pageable
        );

        List<ArtistLicenseDTO> licenseDTOs = orderDetailPage.getContent().stream().map(detail ->
            ArtistLicenseDTO.builder()
                    .orderDetailId(detail.getId())
                    .watermarkId(detail.getWatermarkId() != null ? detail.getWatermarkId() : "Không áp dụng")
                    .customerName(detail.getOrder().getUser().getName())
                    .customerEmail(detail.getOrder().getUser().getEmail())
                    .audioId(detail.getAudioTrack().getId())
                    .trackName(detail.getAudioTrack().getTitle())
                    .coverImage(detail.getAudioTrack().getCoverImage())
                    .licenseType(detail.getLicense().getLicenseType())
                    .price(resolveArtistEarnings(detail))
                    .licenseStatus(detail.getLicenseStatus())
                    .issuedAt(detail.getOrder().getCreatedAt())
                    .expiredAt(detail.getExpiredAt())
                    .build()).collect(Collectors.toList());

        return new ArtistLicensePageResponse(
                licenseDTOs,
                orderDetailPage.getNumber(),
                orderDetailPage.getTotalPages(),
                orderDetailPage.getTotalElements()
        );
    }

    // Lấy thống kê nhanh về giấy phép của nghệ sĩ (Tổng số giấy phép đã bán, số giấy phép thương mại/độc quyền, số cảnh báo bản quyền)
    @Transactional(readOnly = true)
    public ArtistLicenseStatsDTO getArtistLicenseStats(String email) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }

        long total = orderDetailRepository.countTotalLicensesByArtistId(artist.getId());
        long commercial = orderDetailRepository.countCommercialLicensesByArtistId(artist.getId());

        return ArtistLicenseStatsDTO.builder()
                .totalLicenses(total)
                .commercialAndExclusiveLicenses(commercial)
                .copyrightWarnings(0) // Tạm thời để 0, sau này làm module Report sẽ thay thế bằng Query thật
                .build();
    }

    // Lấy dữ liệu tổng quan về doanh thu của nghệ sĩ: Tổng doanh thu, số dư khả dụng, số tiền đang Hold, cơ cấu doanh thu theo loại giấy phép (dữ liệu cho biểu đồ tròn), top 5 bài hát bán chạy nhất (dữ liệu cho danh sách), doanh thu theo thời gian (dữ liệu cho biểu đồ đường)
    @Transactional(readOnly = true)
    public ArtistRevenueSummaryDTO getArtistRevenueSummary(String email) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }

        Integer artistId = artist.getId();

        // 1. Tính tổng doanh thu (sử dụng artistEarnings đã trừ hoa hồng)
        Double totalRevenue = defaultDouble(orderDetailRepository.sumTotalArtistEarningsByArtistId(artistId));
        Double availableBalance = totalRevenue;  // Không cần trừ thêm vì artistEarnings đã trừ hoa hồng
        Double pendingBalance = 500000.0; // Tạm thời để số cứng mô phỏng tiền đang bị Hold (chờ đối soát)

        // 2. Dữ liệu Biểu đồ Tròn (Cơ cấu doanh thu)
        List<RevenuePieDTO> distributionData = buildLicenseDistribution(artistId);

        // 3. Dữ liệu Top 5 bài hát
        List<TopTrackDTO> topTracks = buildTopPerformingTracks(artistId);

        // 4. Dữ liệu Biểu đồ Đường (Tự động tính 6 tháng gần nhất)
        List<RevenueChartDTO> chartData = buildRevenueChartData(artistId);

        return ArtistRevenueSummaryDTO.builder()
                .availableBalance(availableBalance)
                .pendingBalance(pendingBalance)
                .totalRevenue(totalRevenue)
                .distributionData(distributionData)
                .topTracks(topTracks)
                .chartData(chartData)
                .build();
    }

    // Hàm phụ trợ: Nhóm doanh thu theo 6 tháng gần nhất (sử dụng artistEarnings)
    private List<RevenueChartDTO> generateChartData(List<OrderDetail> orders) {
        List<RevenueChartDTO> chartData = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        // Lặp từ 5 tháng trước cho đến tháng hiện tại
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            String monthName = "Tháng " + targetMonth.getMonthValue();

            // Tính tổng tiền của những order nằm trong tháng 'targetMonth' (sử dụng artistEarnings)
            double monthRevenue = orders.stream()
                    .filter(od -> {
                        LocalDateTime createdAt = od.getOrder().getCreatedAt();
                        return createdAt != null && YearMonth.from(createdAt).equals(targetMonth);
                    })
                    .mapToDouble(od -> od.getArtistEarnings() == null ? 0.0 : od.getArtistEarnings())
                    .sum();

            chartData.add(new RevenueChartDTO(monthName, monthRevenue));
        }

        return chartData;
    }

    private List<RevenueChartDTO> buildRevenueChartData(Integer artistId) {
        return generateChartData(orderDetailRepository.findAllCompletedByArtistId(artistId));
    }

    private List<RevenuePieDTO> buildLicenseDistribution(Integer artistId) {
        return orderDetailRepository.sumArtistEarningsByLicenseType(artistId).stream().map(obj -> {
            String licenseType = obj[0] == null ? "Unknown" : String.valueOf(obj[0]);
            Double value = obj[1] == null ? 0.0 : ((Number) obj[1]).doubleValue();
            String color = "#0dcaf0";
            if (licenseType.contains("Commercial")) {
                color = "#dc3545";
            } else if (licenseType.contains("Extended")) {
                color = "#ffc107";
            }
            return new RevenuePieDTO(licenseType, value, color);
        }).collect(Collectors.toList());
    }

    private List<TopTrackDTO> buildTopPerformingTracks(Integer artistId) {
        Pageable top5 = PageRequest.of(0, 5);
        List<Object[]> topTracksObj = orderDetailRepository.findTopPerformingTracksByArtistIdUsingEarnings(artistId, top5);
        return topTracksObj.stream().map(obj -> {
            Integer trackId = obj[0] == null ? null : ((Number) obj[0]).intValue();
            String title = obj[1] == null ? null : String.valueOf(obj[1]);
            String cover = obj[2] == null ? null : String.valueOf(obj[2]);
            String type = obj[3] == null ? null : String.valueOf(obj[3]);
            Long salesCount = obj[4] == null ? 0L : ((Number) obj[4]).longValue();
            Double revenue = obj[5] == null ? 0.0 : ((Number) obj[5]).doubleValue();
            return new TopTrackDTO(trackId, title, type, salesCount, revenue, cover);
        }).collect(Collectors.toList());
    }

    private Double defaultDouble(Double value) {
        return value == null ? 0.0 : value;
    }

    private Long defaultLong(Long value) {
        return value == null ? 0L : value;
    }

    // Lấy danh sách giao dịch của nghệ sĩ (bao gồm cả bán giấy phép và rút tiền), có hỗ trợ phân trang
    @Transactional(readOnly = true)
    public TransactionPageResponse getArtistTransactions(String email, int page, int size) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }

        // Sắp xếp mặc định mới nhất lên đầu
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("order.createdAt").descending());
        Page<OrderDetail> orderDetailPage = orderDetailRepository.findTransactionsByArtistId(artist.getId(), pageable);

        // Chuyển đổi Entity sang DTO
        List<TransactionDTO> dtos = orderDetailPage.getContent().stream().map(od -> {
            String licenseName = od.getLicense().getLicenseType();
            String trackTitle = od.getAudioTrack().getTitle();

            // Use a single source of truth for net artist revenue.
            Double actualAmount = resolveArtistEarnings(od);

            return TransactionDTO.builder()
                    .id(od.getId())
                    .createdAt(od.getOrder().getCreatedAt())
                    .type("sale")
                    .title("Bán giấy phép " + (licenseName.contains("Commercial") ? "Thương mại" : licenseName.contains("Extended") ? "Độc quyền" : "Cá nhân"))
                    .desc("Tác phẩm: " + trackTitle)
                    .amount(actualAmount)
                    .status("Hoàn tất")
                    .build();
        }).collect(Collectors.toList());

        return new TransactionPageResponse(
                dtos,
                orderDetailPage.getNumber(),
                orderDetailPage.getTotalPages(),
                orderDetailPage.getTotalElements()
        );
    }

    // Lấy danh sách track của nghệ sĩ
    @Transactional(readOnly = true)
    public AudioTrackPageResponse getMyTracks(String email, int page, int size, String keyword, String genreName, String status) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }

        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("uploadDate").descending());

        // Gọi Specification mới
        Page<com.springboot.music.entity.AudioTrack> trackPage = audioTrackRepository.findAll(
                AudioTrackSpecification.filterForArtist(artist.getId(), keyword, genreName, null, null, null, null, status),
                pageable
        );

        List<AudioTrackDTO> audioTracks = audioTrackMapper.toDtoList(trackPage.getContent());
        return new AudioTrackPageResponse(
                audioTracks,
                trackPage.getNumber(),
                trackPage.getTotalPages(),
                trackPage.getTotalElements()
        );
    }

    private Double resolveArtistEarnings(OrderDetail detail) {
        if (detail == null) {
            return 0.0;
        }

        if (detail.getArtistEarnings() != null) {
            return detail.getArtistEarnings();
        }

        double grossPrice = detail.getPrice() == null ? 0.0 : detail.getPrice();
        Double commission = detail.getCommissionRate();

        // Fallback for legacy rows where artistEarnings was not persisted.
        if (commission == null && detail.getLicense() != null) {
            commission = detail.getLicense().getCommissionRate();
        }

        double normalizedCommission = normalizeCommissionRate(commission);
        return grossPrice * (1.0 - normalizedCommission);
    }

    private double normalizeCommissionRate(Double commission) {
        if (commission == null) {
            return 0.0;
        }

        double rate = commission;
        if (rate > 1.0) {
            rate = rate / 100.0;
        }

        if (rate < 0.0) {
            return 0.0;
        }
        if (rate > 1.0) {
            return 1.0;
        }

        return rate;
    }

}
