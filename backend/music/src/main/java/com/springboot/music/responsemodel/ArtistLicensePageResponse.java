package com.springboot.music.responsemodel;

import com.springboot.music.dto.ArtistLicenseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtistLicensePageResponse {
    private List<ArtistLicenseDTO> licenses;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
