package com.springboot.music.responsemodel;

import com.springboot.music.dto.TransactionDTO;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionPageResponse {
    private List<TransactionDTO> transactions;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
