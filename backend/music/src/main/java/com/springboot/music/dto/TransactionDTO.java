package com.springboot.music.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Integer id;
    private LocalDateTime createdAt;
    private String type;     // "sale" (bán nhạc), "withdraw" (rút tiền)
    private String title;    // Tên giao dịch (VD: Bán giấy phép Thương mại)
    private String desc;     // Mô tả (VD: Tác phẩm: Cơn Mưa Ngang Qua)
    private Double amount;   // Số tiền
    private String status;   // Trạng thái (Hoàn tất, Đang xử lý...)
}
