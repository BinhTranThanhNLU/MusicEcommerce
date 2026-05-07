package com.springboot.music.responsemodel;

import com.springboot.music.dto.AdminOrderDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOrderPageResponse {

    private List<AdminOrderDTO> orders;
    private int currentPage;
    private int totalPages;
    private long totalItems;
}

