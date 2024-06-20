package com.example.stage.stage.dto;

import lombok.Data;

@Data
public class CartItemsDto {

    private Long id;

    private Long price;

    private Long quantity;

    private Long productId;

    private Long orderId;

    private String productNane;

    private byte[] returnedImg;

    private Long userId;

    private String marque;
    private String taille;
}