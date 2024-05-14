package com.example.stage.stage.controller.admin;

import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.services.admin.adminProduct.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService adminProductService;
    @PostMapping("/product")
    public ResponseEntity<ProductDto> addProduct(@ModelAttribute ProductDto productDto) throws IOException {
        ProductDto productDto1 = adminProductService.addProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productDto1);
    }

    @GetMapping("/products")

    public ResponseEntity<List<ProductDto>> getAllProducts(){
        List<ProductDto> productDto =adminProductService.getAllProducts();
        return ResponseEntity.ok(productDto);
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<ProductDto>> getAllProductByName(@PathVariable String name) {
        List<ProductDto> productDtos = adminProductService.getAllProductByName(name);
        return ResponseEntity.ok(productDtos);
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {

        boolean deleted = adminProductService.deleteProduct(productId);

        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
