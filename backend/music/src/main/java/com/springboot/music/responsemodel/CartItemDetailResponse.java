package com.springboot.music.responsemodel;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDetailResponse {

    private Integer cartItemId;
    private Integer audioId;
    private String audioTitle;
    private String coverImage;
    private Integer duration;

    private Integer licenseId;
    private String licenseType;
    private String licenseDescription;

    private Double price;
}

