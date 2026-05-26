package com.springboot.music.responsemodel;

import com.springboot.music.dto.AdminLicenseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLicensePageResponse {

    private List<AdminLicenseDTO> licenses;
    private int currentPage;
    private int totalPages;
    private long totalItems;
}

