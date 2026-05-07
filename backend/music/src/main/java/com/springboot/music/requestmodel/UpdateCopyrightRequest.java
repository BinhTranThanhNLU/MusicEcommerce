package com.springboot.music.requestmodel;

import lombok.Data;

@Data
public class UpdateCopyrightRequest {
    private String ownerName;
    private String isrcCode;
    private String certificateFileUrl;
}

