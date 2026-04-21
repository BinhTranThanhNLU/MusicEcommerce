package com.springboot.music.requestmodel;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartItemLicenseRequest {

    @NotNull(message = "licenseId is required")
    @Positive(message = "licenseId must be > 0")
    private Integer licenseId;
}

