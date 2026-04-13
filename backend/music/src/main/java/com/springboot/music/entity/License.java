package com.springboot.music.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "License")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class License {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "license_id")
    private Integer id;

    @Column(name = "license_type")
    private String licenseType;

    @Column(name = "description")
    private String description;


}
