package com.springboot.music.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_detail_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audio_id", nullable = false)
    private AudioTrack audioTrack;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "license_id", nullable = false)
    private License license;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "watermark_id", length = 100)
    private String watermarkId;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    @Column(name = "license_status", length = 50)
    private String licenseStatus;
}

