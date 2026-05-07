package com.springboot.music.responsemodel;

import com.springboot.music.dto.CopyrightInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CopyrightPageResponse {
    private List<CopyrightInfoDTO> items;
    private int currentPage;
    private int totalPages;
    private long totalItems;
}

