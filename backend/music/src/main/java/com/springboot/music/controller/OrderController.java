package com.springboot.music.controller;

import com.springboot.music.requestmodel.CheckoutRequest;
import com.springboot.music.responsemodel.CheckoutResponse;
import com.springboot.music.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

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
            Authentication authentication,
            HttpServletRequest httpServletRequest) {
        String email = authentication.getName();
        CheckoutResponse response = orderService.checkout(email, request, httpServletRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<Void> vnpayReturn(@RequestParam Map<String, String> params) {
        String redirectUrl = orderService.handleVnPayReturn(params);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }
}
