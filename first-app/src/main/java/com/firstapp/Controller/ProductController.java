package com.firstapp.Controller;

import com.firstapp.Exception.ResourceNotFoundException;
import com.firstapp.Model.Product;
import com.firstapp.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProduct() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) throws ResourceNotFoundException {
        return productService.getProductById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }


    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) throws ResourceNotFoundException {
        Product product = productService.getProductById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        return productService.saveProduct(product);
    }


    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}

