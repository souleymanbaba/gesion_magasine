package com.example.stage.stage.services.customer;

import com.example.stage.stage.dto.ProductDetailDto;
import com.example.stage.stage.dto.ProductDto;

import java.util.List;

public interface CustomerProductService {
    List<ProductDto> getAllProducts(String lang);
    List<ProductDto> getAllProductByName(String name, String lang);
    ProductDetailDto getProductDetailById(Long productId, String lang);
}
