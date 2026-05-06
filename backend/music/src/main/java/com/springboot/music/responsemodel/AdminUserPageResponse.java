package com.springboot.music.responsemodel;

import com.springboot.music.dto.AdminUserDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserPageResponse {

    private List<AdminUserDTO> users;
    private int currentPage;
    private int totalPages;
    private long totalItems;

}
