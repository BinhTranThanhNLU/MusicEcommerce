package com.springboot.music.responsemodel;

import com.springboot.music.dto.AccountOrderDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserOrderPageResponse {

    private List<AccountOrderDTO> orders;
    private int currentPage;
    private int totalPages;
    private long totalItems;
}

