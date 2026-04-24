package com.springboot.music.requestmodel;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @NotNull(message = "Rating khong duoc de trong")
    @Min(value = 1, message = "Rating phai tu 1 den 5")
    @Max(value = 5, message = "Rating phai tu 1 den 5")
    private Integer rating;

    @Size(max = 2000, message = "Comment khong duoc vuot qua 2000 ky tu")
    private String comment;
}
