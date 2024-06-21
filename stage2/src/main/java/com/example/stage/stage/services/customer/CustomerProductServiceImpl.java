package com.example.stage.stage.services.customer;

import com.example.stage.stage.dto.ProductDetailDto;
import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.repostory.ProcuctRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerProductServiceImpl implements CustomerProductService {
    private final ProcuctRepository productRepository;


    public List<ProductDto> getAllProducts(String lang) {
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> product.getDto(lang)).collect(Collectors.toList());
    }


    public List<ProductDto> getAllProductByName(String name, String lang) {
        List<Product> products = productRepository.findAllByNameContaining(name);
        return products.stream().map(product -> product.getDto(lang)).collect(Collectors.toList());
    }

    public ProductDetailDto getProductDetailById(Long productId, String lang) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            ProductDetailDto productDetailDto = new ProductDetailDto();
            productDetailDto.setProductDto(optionalProduct.get().getDto(lang));

            return productDetailDto;
        }
        return null;
    }


}
