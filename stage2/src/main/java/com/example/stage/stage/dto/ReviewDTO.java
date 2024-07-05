package com.example.stage.stage.dto;


import lombok.Data;

@Data
public class ReviewDTO {
    private Long id;
    private String content;
    private int rating;
    private Long userId;
    private String userName;
}
