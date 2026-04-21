package com.springboot.music.requestmodel;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "audioId is required")
    @Positive(message = "audioId must be > 0")
    private Integer audioId;

    @NotNull(message = "licenseId is required")
    @Positive(message = "licenseId must be > 0")
    private Integer licenseId;
}

