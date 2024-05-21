package com.example.stage.stage.services.customer.cart;


import com.example.stage.stage.dto.AddProductInCartDto;
import com.example.stage.stage.dto.OrderDto;
import com.example.stage.stage.dto.PlaceOrderDto;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

public interface CartService  {
    ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto);
    OrderDto getCartByUserId (Long userId);
    OrderDto getCartByUserIdI(Long userId);
    OrderDto applyCoupon (Long userId, String code);
    OrderDto increaseProductQuantity (AddProductInCartDto addProductInCartDto);
    OrderDto decreaseProductQuantity (AddProductInCartDto addProductInCartDto);
    OrderDto placeOrder (PlaceOrderDto placeOrderDto) ;
    List<OrderDto> getMyPlacedOrders (Long userId);
    OrderDto searchOrderByTrackingId(UUID trackingId);
}
