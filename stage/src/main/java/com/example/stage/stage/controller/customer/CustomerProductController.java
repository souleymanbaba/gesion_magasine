package com.example.stage.stage.controller.customer;

import com.example.stage.stage.dto.ProductDetailDto;
import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.services.customer.CustomerProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerProductController {

    private final CustomerProductService customerProductService;

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts(){
        List<ProductDto> productDtos = customerProductService.getAllProducts("fr");
        return ResponseEntity.ok(productDtos);
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<ProductDto>> getAllProductByName(@PathVariable String name) {
        List<ProductDto> productDtos = customerProductService.getAllProductByName(name,"fr");
        return ResponseEntity.ok (productDtos);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductDetailDto> getProductDetailById(@PathVariable Long productId) {
        ProductDetailDto productDetailDto= customerProductService.getProductDetailById(productId,"fr");
        if(productDetailDto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(productDetailDto);
    }
}
