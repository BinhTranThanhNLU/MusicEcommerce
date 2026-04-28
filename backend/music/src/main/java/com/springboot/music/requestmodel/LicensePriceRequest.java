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
public class LicensePriceRequest {

    @NotNull(message = "License id khong duoc de trong")
    private Integer licenseId;

    @NotNull(message = "Gia license khong duoc de trong")
    @Positive(message = "Gia license phai lon hon 0")
    private Double price;
}

