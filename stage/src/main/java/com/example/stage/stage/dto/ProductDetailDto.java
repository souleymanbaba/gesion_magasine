package com.example.stage.stage.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductDetailDto {

    private ProductDto productDto;

    private List<ReviewDto> revieWtoList;
    private List<FAQDto> faqDtoList;
}
