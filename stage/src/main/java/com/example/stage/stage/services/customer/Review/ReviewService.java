package com.example.stage.stage.services.customer.Review;

import com.example.stage.stage.dto.OrderedProductsResponseDto;
import com.example.stage.stage.dto.ReviewDto;

import java.io.IOException;

public interface ReviewService {
    OrderedProductsResponseDto getOrderedProductsDetailsByOrderId(Long orderId);
    ReviewDto giveRevies(ReviewDto reviewDto) throws IOException;
}
