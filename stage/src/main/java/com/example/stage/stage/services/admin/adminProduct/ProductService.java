package com.example.stage.stage.services.admin.adminProduct;

import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.Product;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductDto addProduct (ProductDto productDto) throws IOException;
    List<ProductDto> getAllProducts();
    List<ProductDto> getAllProductByName(String name);
    boolean deleteProduct(Long id);
    ProductDto getProductById(Long productId);
    ProductDto updateProduct(Long productId, ProductDto productDto) throws IOException;
    List<ProductDto> getProductsByCategoryAndSubcategories(Long categoryId);
    List<ProductDto> convertToDtoList(List<Product> products);
}
