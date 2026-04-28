package com.springboot.music.requestmodel;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAudioTrackRequest {

    @NotBlank(message = "Title khong duoc de trong")
    private String title;

    @NotBlank(message = "Audio type khong duoc de trong")
    private String audioType;

    private String description;

    private String lyrics;

    @NotBlank(message = "Author khong duoc de trong")
    private String authorName;

    @NotNull(message = "Duration khong duoc de trong")
    @Positive(message = "Duration phai lon hon 0")
    private Integer duration;

    @NotEmpty(message = "Can it nhat 1 genre")
    private List<@NotNull(message = "Genre id khong duoc null") @Positive(message = "Genre id phai lon hon 0") Integer> genreIds;

    @NotEmpty(message = "Can it nhat 1 mood")
    private List<@NotNull(message = "Mood id khong duoc null") @Positive(message = "Mood id phai lon hon 0") Integer> moodIds;

    private List<@NotNull(message = "Theme id khong duoc null") @Positive(message = "Theme id phai lon hon 0") Integer> themeIds;

    @NotEmpty(message = "Can it nhat 1 license price")
    @Valid
    private List<LicensePriceRequest> licensePrices;
}

