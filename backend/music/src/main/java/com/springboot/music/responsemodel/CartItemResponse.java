package com.springboot.music.responsemodel;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Integer cartId;
    private Integer cartItemId;

    private Integer audioId;
    private String audioTitle;
    private String artistName;

    private Integer licenseId;
    private String licenseType;
    private String licenseDescription;

    private Double price;
    private boolean alreadyInCart;
}

