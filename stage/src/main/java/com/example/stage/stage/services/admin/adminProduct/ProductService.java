package com.example.stage.stage.services.admin.adminProduct;

import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.Product;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductDto addProduct (ProductDto productDto) throws IOException;

    ProductDto updateProductTranslation(Long productId, ProductDto productDto);
    List<ProductDto> getAllProductByName(String name, String lang);
    boolean deleteProduct(Long id);
    ProductDto getProductById(Long productId, String lang);
    ProductDto updateProduct(Long productId, ProductDto productDto) throws IOException;
    List<ProductDto> getProductsByCategoryAndSubcategories(Long categoryId, String lang);
    List<ProductDto> convertToDtoList(List<Product> products, String lang);
    List<ProductDto> getAllProducts(String lang);
}
