package com.springboot.music.responsemodel;

import com.springboot.music.dto.AdminTransactionDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminTransactionPageResponse {
    private List<AdminTransactionDTO> transactions;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}

