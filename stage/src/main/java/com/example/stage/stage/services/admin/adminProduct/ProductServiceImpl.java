package com.example.stage.stage.services.admin.adminProduct;

import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.Category;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.repostory.CategoryRepository;
import com.example.stage.stage.repostory.ProcuctRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
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
        product.setMarque(productDto.getMarque());
        product.setTaille(productDto.getTaille());
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


    public List<ProductDto> getProductsByCategoryAndSubcategories(Long categoryId) {
        List<Product> products = productRepository.findByCategoryAndSubcategories(categoryId);
        return convertToDtoList(products);
    }

    public List<ProductDto> convertToDtoList(List<Product> products) {
        List<ProductDto> productDtos = new ArrayList<>();
        for (Product product : products) {
            ProductDto productDto = new ProductDto();
            // Map product properties to productDto
            productDto.setId(product.getId());
            productDto.setName(product.getName());
            productDto.setPrice(product.getPrice());
            productDto.setDescription(product.getDescription());
            productDto.setByteimg(product.getImg());
            productDto.setCategoryId(product.getCategory().getId());
            productDto.setCategoryName(product.getCategory().getName());
            productDto.setMarque(product.getMarque());
            productDto.setTaille(product.getTaille());
            productDtos.add(productDto);
        }
        return productDtos;
    }
    public boolean deleteProduct(Long id) {

        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            productRepository.deleteById(id);
        }
        return optionalProduct.isPresent(); // return true if product was found and deleted, false otherwise
    }

    public ProductDto getProductById(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if(optionalProduct.isPresent()){
            return optionalProduct.get().getDto();
        }else{
            return null;
        }
    }

    public ProductDto updateProduct (Long productId, ProductDto productDto) throws IOException {
        Optional<Product> optionalProduct= productRepository.findById(productId);
        Optional<Category> optionalCategory =categoryRepository.findById(productDto.getCategoryId());
        if (optionalProduct.isPresent() && optionalCategory.isPresent()){
            Product product= optionalProduct.get();
            product.setName(productDto.getName());
            product.setPrice(productDto.getPrice());
            product.setDescription (productDto.getDescription());
            product.setCategory(optionalCategory.get());
            if(productDto.getImg() != null){
                product.setImg(productDto.getImg().getBytes());
            }
            return productRepository.save(product).getDto();
        }else{
            return null;
        }
    }


}
