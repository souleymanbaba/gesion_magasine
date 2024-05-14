package com.example.stage.stage.services.admin.adminProduct;

import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.Category;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.repostory.CategoryRepository;
import com.example.stage.stage.repostory.ProcuctRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService{
    private final ProcuctRepository productRepository;

    private final CategoryRepository categoryRepository;

    public ProductDto addProduct (ProductDto productDto) throws IOException {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImg(productDto.getImg().getBytes());
        Category category=categoryRepository.findById(productDto.getCategoryId()).orElseThrow();
        product.setCategory (category);
        return productRepository.save(product).getDto();
    }
    public List<ProductDto> getAllProducts(){
        List<Product> products =productRepository.findAll();
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductByName(String name){

        List<Product> products = productRepository.findAllByNameContaining(name);
        return products.stream().map(Product::getDto).collect(Collectors.toList());

    }
    public boolean deleteProduct(Long id) {

        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            productRepository.deleteById(id);
        }
        return optionalProduct.isPresent(); // return true if product was found and deleted, false otherwise
    }


}
