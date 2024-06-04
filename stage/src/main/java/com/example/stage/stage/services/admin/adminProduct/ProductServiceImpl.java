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
public class ProductServiceImpl implements ProductService {
    private final ProcuctRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductDto addProduct(ProductDto productDto) throws IOException {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImg(productDto.getImg().getBytes());
        product.setMarque(productDto.getMarque());
        product.setTaille(productDto.getTaille());
        product.setName_ar(productDto.getName_ar());
        product.setDescription_ar(productDto.getDescription_ar());
        product.setTaille_ar(productDto.getTaille_ar());
        Category category = categoryRepository.findById(productDto.getCategoryId()).orElseThrow();
        product.setCategory(category);
        return productRepository.save(product).getDto("fr");
    }

    public List<ProductDto> getAllProducts(String lang) {
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> product.getDto(lang)).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductByName(String name, String lang) {
        List<Product> products = productRepository.findAllByNameContaining(name);
        return products.stream().map(product -> product.getDto(lang)).collect(Collectors.toList());
    }

    public List<ProductDto> getProductsByCategoryAndSubcategories(Long categoryId, String lang) {
        List<Product> products = productRepository.findByCategoryAndSubcategories(categoryId);
        return convertToDtoList(products, lang);
    }

    public List<ProductDto> convertToDtoList(List<Product> products, String lang) {
        List<ProductDto> productDtos = new ArrayList<>();
        for (Product product : products) {
            ProductDto productDto = new ProductDto();
            productDto.setId(product.getId());
            productDto.setName("ar".equals(lang) ? product.getName_ar() : product.getName());
            productDto.setPrice(product.getPrice());
            productDto.setDescription("ar".equals(lang) ? product.getDescription_ar() : product.getDescription());
            productDto.setByteimg(product.getImg());
            productDto.setCategoryId(product.getCategory().getId());
            productDto.setCategoryName(product.getCategory().getName());
            productDto.setMarque("ar".equals(lang) ? productDto.getMarque_ar() : product.getMarque());
            productDto.setTaille("ar".equals(lang) ? product.getTaille_ar() : product.getTaille());
            productDtos.add(productDto);
        }
        return productDtos;
    }

    public boolean deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            productRepository.deleteById(id);
        }
        return optionalProduct.isPresent();
    }

    public ProductDto getProductById(Long productId, String lang) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        return optionalProduct.map(product -> product.getDto(lang)).orElse(null);
    }

    public ProductDto updateProduct(Long productId, ProductDto productDto) throws IOException {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Optional<Category> optionalCategory = categoryRepository.findById(productDto.getCategoryId());
        if (optionalProduct.isPresent() && optionalCategory.isPresent()) {
            Product product = optionalProduct.get();
            product.setName(productDto.getName());
            product.setPrice(productDto.getPrice());
            product.setDescription(productDto.getDescription());
            product.setCategory(optionalCategory.get());
            product.setName_ar(productDto.getName_ar());
            product.setDescription_ar(productDto.getDescription_ar());
            product.setTaille_ar(productDto.getTaille_ar());
            if (productDto.getImg() != null) {
                product.setImg(productDto.getImg().getBytes());
            }
            return productRepository.save(product).getDto("fr");
        } else {
            return null;
        }
    }

    public ProductDto updateProductTranslation(Long productId, ProductDto productDto) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            if (productDto.getName_ar() != null) {
                product.setName_ar(productDto.getName_ar());
            }
            if (productDto.getDescription_ar() != null) {
                product.setDescription_ar(productDto.getDescription_ar());
            }
            if (productDto.getMarque_ar() != null) {
                product.setMarque_ar(productDto.getMarque_ar());
            }
            if (productDto.getTaille_ar() != null) {
                product.setTaille_ar(productDto.getTaille_ar());
            }
            return productRepository.save(product).getDto("ar");
        } else {
            return null;
        }
    }
}
