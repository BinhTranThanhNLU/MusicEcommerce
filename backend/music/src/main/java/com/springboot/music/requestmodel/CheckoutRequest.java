package com.springboot.music.requestmodel;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String paymentMethod;
}

