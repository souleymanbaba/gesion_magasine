package com.example.stage.stage.dto;

import lombok.Data;

@Data
public class PlaceOrderDto {
    private  Long userId;
    private  String address;
    private  String orderDescription;
    private Double latitude;
    private Double longitude;
    private  String wilaya;

}
