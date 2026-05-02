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
import com.springboot.music.responsemodel.TransactionPageResponse;
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

        List<ArtistLicenseDTO> licenseDTOs = orderDetailPage.getContent().stream().map(detail -> {
            return ArtistLicenseDTO.builder()
                    .orderDetailId(detail.getId())
                    .watermarkId(detail.getWatermarkId() != null ? detail.getWatermarkId() : "Không áp dụng")
                    .customerName(detail.getOrder().getUser().getName())
                    .customerEmail(detail.getOrder().getUser().getEmail())
                    .audioId(detail.getAudioTrack().getId())
                    .trackName(detail.getAudioTrack().getTitle())
                    .coverImage(detail.getAudioTrack().getCoverImage())
                    .licenseType(detail.getLicense().getLicenseType())
                    .price(detail.getPrice())
                    .licenseStatus(detail.getLicenseStatus())
                    .issuedAt(detail.getOrder().getCreatedAt())
                    .expiredAt(detail.getExpiredAt())
                    .build();
        }).collect(Collectors.toList());

        return new ArtistLicensePageResponse(
                licenseDTOs,
                orderDetailPage.getNumber(),
                orderDetailPage.getTotalPages(),
                orderDetailPage.getTotalElements()
        );
    }

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

    @Transactional(readOnly = true)
    public ArtistRevenueSummaryDTO getArtistRevenueSummary(String email) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }

        Integer artistId = artist.getId();

        // 1. Tính tổng doanh thu & Số dư khả dụng (Trừ 10% phí sàn)
        Double totalRevenue = orderDetailRepository.sumTotalRevenueByArtistId(artistId);
        if (totalRevenue == null) totalRevenue = 0.0;

        double platformFeeRate = 0.10; // 10%
        Double availableBalance = totalRevenue * (1.0 - platformFeeRate);
        Double pendingBalance = 500000.0; // Tạm thời để số cứng mô phỏng tiền đang bị Hold (chờ đối soát)

        // 2. Dữ liệu Biểu đồ Tròn (Cơ cấu doanh thu)
        List<Object[]> pieDataObj = orderDetailRepository.sumRevenueByLicenseType(artistId);
        List<RevenuePieDTO> distributionData = pieDataObj.stream().map(obj -> {
            String licenseType = (String) obj[0];
            Double value = (Double) obj[1];
            String color = "#0dcaf0"; // Mặc định màu xanh (Personal)

            if (licenseType.contains("Commercial")) color = "#dc3545"; // Đỏ
            else if (licenseType.contains("Extended")) color = "#ffc107"; // Vàng

            return new RevenuePieDTO(licenseType, value, color);
        }).collect(Collectors.toList());

        // 3. Dữ liệu Top 5 bài hát
        Pageable top5 = PageRequest.of(0, 5);
        List<Object[]> topTracksObj = orderDetailRepository.findTopSellingTracks(artistId, top5);
        List<TopTrackDTO> topTracks = topTracksObj.stream().map(obj -> {
            Integer trackId = (Integer) obj[0];
            String title = (String) obj[1];
            String cover = (String) obj[2];
            String type = (String) obj[3];
            Double revenue = (Double) obj[4];
            return new TopTrackDTO(trackId, title, type, revenue, cover);
        }).collect(Collectors.toList());

        // 4. Dữ liệu Biểu đồ Đường (Tự động tính 6 tháng gần nhất)
        List<OrderDetail> allOrders = orderDetailRepository.findAllCompletedByArtistId(artistId);
        List<RevenueChartDTO> chartData = generateChartData(allOrders);

        return ArtistRevenueSummaryDTO.builder()
                .availableBalance(availableBalance)
                .pendingBalance(pendingBalance)
                .totalRevenue(totalRevenue)
                .distributionData(distributionData)
                .topTracks(topTracks)
                .chartData(chartData)
                .build();
    }

    // Hàm phụ trợ: Nhóm doanh thu theo 6 tháng gần nhất
    private List<RevenueChartDTO> generateChartData(List<OrderDetail> orders) {
        List<RevenueChartDTO> chartData = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        // Lặp từ 5 tháng trước cho đến tháng hiện tại
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            String monthName = "Tháng " + targetMonth.getMonthValue();

            // Tính tổng tiền của những order nằm trong tháng 'targetMonth'
            double monthRevenue = orders.stream()
                    .filter(od -> {
                        LocalDateTime createdAt = od.getOrder().getCreatedAt();
                        return createdAt != null && YearMonth.from(createdAt).equals(targetMonth);
                    })
                    .mapToDouble(OrderDetail::getPrice)
                    .sum();

            chartData.add(new RevenueChartDTO(monthName, monthRevenue));
        }

        return chartData;
    }

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

            // Tính tiền thực nhận (đã trừ 10% phí nền tảng)
            Double actualAmount = od.getPrice() * 0.9;

            return TransactionDTO.builder()
                    .id(od.getId())
                    .createdAt(od.getOrder().getCreatedAt())
                    .type("sale") // Vì hiện tại chưa có bảng rút tiền, mọi GD đều là 'sale'
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

    @Transactional(readOnly = true)
    public ArtistDashboardSummaryDTO getDashboardSummary(String email) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }
        Integer artistId = artist.getId();

        // 1. Lấy dữ liệu 4 thẻ thống kê
        Double monthlyRevenue = orderDetailRepository.sumMonthlyRevenueByArtistId(artistId);
        Long totalCustomers = orderDetailRepository.countDistinctCustomersByArtistId(artistId);
        Long totalReviews = audioTrackReviewRepository.countReviewsByArtistId(artistId);
        Long activeTracks = audioTrackRepository.countActiveTracksByArtistId(artistId);

        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .monthlyRevenue(monthlyRevenue != null ? monthlyRevenue * 0.9 : 0.0) // Nhớ trừ 10% phí sàn nhé
                .totalCustomers(totalCustomers != null ? totalCustomers : 0L)
                .totalReviews(totalReviews != null ? totalReviews : 0L)
                .activeTracks(activeTracks != null ? activeTracks : 0L)
                .build();

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
                .recentActivities(activities)
                .build();
    }
}