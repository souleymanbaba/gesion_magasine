package com.example.stage.stage.services.customer.cart;


import com.example.stage.stage.dto.AddProductInCartDto;
import com.example.stage.stage.dto.OrderDto;
import org.springframework.http.ResponseEntity;

public interface CartService  {
    ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto);
    OrderDto getCartByUserId (Long userId);
}
