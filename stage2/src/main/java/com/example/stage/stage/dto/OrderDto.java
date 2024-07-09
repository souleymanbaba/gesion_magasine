package com.example.stage.stage.dto;

import com.example.stage.stage.entity.CartItems;
import com.example.stage.stage.entity.User;
import com.example.stage.stage.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class OrderDto {
    private Long id;
    private String orderDescription;
    private Date date;
    private Long amount;
    private String address;
    private String payment;
    private OrderStatus orderStatus; // Remove if unused
    private Long totalAmount;
    private Long discount; // Remove if unused
    private UUID trackingId;
    private String userName;
    private Long user_id;
    private List<CartItemsDto> cartItems;
    private String couponName;
    private Double latitude;
    private Double longitude;
    private  String wilaya;
}
