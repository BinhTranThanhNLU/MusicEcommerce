package com.springboot.music.controller;

import com.springboot.music.requestmodel.AddToCartRequest;
import com.springboot.music.requestmodel.UpdateCartItemLicenseRequest;
import com.springboot.music.responsemodel.CartItemResponse;
import com.springboot.music.responsemodel.CartResponse;
import com.springboot.music.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     * POST /cart/items
     */
    @PostMapping("/items")
    public ResponseEntity<CartItemResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        CartItemResponse response = cartService.addToCart(email, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy giỏ hàng của user
     * GET /cart
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        String email = authentication.getName();
        CartResponse response = cartService.getCart(email);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     * DELETE /cart/items/{cartItemId}
     */
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<String> removeFromCart(
            @PathVariable Integer cartItemId,
            Authentication authentication) {
        String email = authentication.getName();
        cartService.removeFromCart(email, cartItemId);
        return ResponseEntity.ok("Item removed from cart successfully");
    }

    /**
     * Cap nhat license cho item trong gio
     * PUT /cart/items/{cartItemId}/license
     */
    @PutMapping("/items/{cartItemId}/license")
    public ResponseEntity<CartItemResponse> updateCartItemLicense(
            @PathVariable Integer cartItemId,
            @Valid @RequestBody UpdateCartItemLicenseRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        CartItemResponse response = cartService.updateCartItemLicense(email, cartItemId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xoa toan bo gio hang
     * DELETE /cart
     */
    @DeleteMapping
    public ResponseEntity<String> deleteCart(Authentication authentication) {
        String email = authentication.getName();
        long deletedItems = cartService.deleteCart(email);
        if (deletedItems < 0) {
            return ResponseEntity.ok("Cart not found or already removed");
        }
        return ResponseEntity.ok("Cart deleted successfully. Removed " + deletedItems + " items.");
    }
}

