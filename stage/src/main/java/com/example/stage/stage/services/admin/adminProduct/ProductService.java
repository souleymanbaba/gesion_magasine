package com.example.stage.stage.services.admin.adminProduct;

import com.example.stage.stage.dto.ProductDto;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductDto addProduct (ProductDto productDto) throws IOException;
    List<ProductDto> getAllProducts();
    List<ProductDto> getAllProductByName(String name);
    public boolean deleteProduct(Long id);
}
