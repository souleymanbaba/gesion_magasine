package com.example.stage.stage.controller.customer;

import com.example.stage.stage.dto.AddProductInCartDto;
import com.example.stage.stage.dto.OrderDto;
import com.example.stage.stage.services.customer.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping("/cart/{userId}")
    public ResponseEntity<?> getCartByUserId(@PathVariable Long userId) {
        OrderDto orderDto= cartService.getCartByUserId(userId);
        return ResponseEntity.status(HttpStatus.OK).body (orderDto);
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addProductToCart(@RequestBody AddProductInCartDto addProductInCartDto) {
        return cartService.addProductToCart(addProductInCartDto);
    }
}