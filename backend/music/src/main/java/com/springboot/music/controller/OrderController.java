package com.springboot.music.controller;

import com.springboot.music.requestmodel.CheckoutRequest;
import com.springboot.music.responsemodel.CheckoutResponse;
import com.springboot.music.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(
            @RequestBody(required = false) CheckoutRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        CheckoutResponse response = orderService.checkout(email, request);
        return ResponseEntity.ok(response);
    }
}
