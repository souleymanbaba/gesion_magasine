package com.example.stage.stage.controller.admin;

import com.example.stage.stage.dto.FAQDto;
import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.services.admin.FAQ.FAQService;
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
    private final FAQService faqService;

    @PostMapping("/product")
    public ResponseEntity<ProductDto> addProduct(@ModelAttribute ProductDto productDto) throws IOException {
        ProductDto productDto1 = adminProductService.addProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productDto1);
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts(@RequestParam(defaultValue = "fr") String lang) {
        List<ProductDto> productDto = adminProductService.getAllProducts(lang);
        return ResponseEntity.ok(productDto);
    }

    @PutMapping("/product/{productId}/translation")
    public ResponseEntity<ProductDto> updateProductTranslation(@PathVariable Long productId,
                                                               @RequestBody ProductDto productDto,
                                                               @RequestParam(defaultValue = "en") String lang) {
        ProductDto updatedProduct = adminProductService.updateProductTranslation(productId, productDto);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDto>> getProductsByCategoryAndSubcategories(@PathVariable Long categoryId,
                                                                                  @RequestParam(defaultValue = "fr") String lang) {
        List<ProductDto> products = adminProductService.getProductsByCategoryAndSubcategories(categoryId, lang);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<ProductDto>> getAllProductByName(@PathVariable String name,
                                                                @RequestParam(defaultValue = "fr") String lang) {
        List<ProductDto> productDtos = adminProductService.getAllProductByName(name, lang);
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

    @PostMapping("/faq/{productId}")
    public ResponseEntity<FAQDto> postFAQ(@PathVariable Long productId, @RequestBody FAQDto faqDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(faqService.postFAQ(productId, faqDto));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long productId,
                                                     @RequestParam(defaultValue = "fr") String lang) {
        ProductDto productDto = adminProductService.getProductById(productId, lang);
        if (productDto != null) {
            return ResponseEntity.ok(productDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/product/{productId}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long productId,
                                                    @ModelAttribute ProductDto productDto,
                                                    @RequestParam(defaultValue = "fr") String lang) throws IOException {
        ProductDto updatedProduct = adminProductService.updateProduct(productId, productDto);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
