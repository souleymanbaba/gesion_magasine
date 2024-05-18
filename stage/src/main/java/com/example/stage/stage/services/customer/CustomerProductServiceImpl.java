package com.example.stage.stage.services.customer;

import com.example.stage.stage.dto.ProductDetailDto;
import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.FAQ;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.entity.Review;
import com.example.stage.stage.repostory.FAQRepository;
import com.example.stage.stage.repostory.ProcuctRepository;
import com.example.stage.stage.repostory.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerProductServiceImpl implements CustomerProductService {
    private final ProcuctRepository productRepository;
    private  final FAQRepository faqRepository;
    private  final ReviewRepository reviewRepository;


    public List<ProductDto> getAllProducts(){
        List<Product> products =productRepository.findAll();
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductByName(String name){

        List<Product> products = productRepository.findAllByNameContaining(name);
        return products.stream().map(Product::getDto).collect(Collectors.toList());

    }

    public ProductDetailDto getProductDetailById(Long productId) {
        Optional<Product> optionalProduct= productRepository.findById(productId);
        if (optionalProduct.isPresent()){
            List<FAQ> faqList =faqRepository.findAllByProductId(productId);
            List<Review> reviewsList = reviewRepository.findAllByProductId(productId);
            ProductDetailDto productDetailDto= new ProductDetailDto();
            productDetailDto.setProductDto (optionalProduct.get().getDto());
            productDetailDto.setFaqDtoList(faqList.stream().map(FAQ::getFAQDto).collect(Collectors.toList()));
            productDetailDto.setRevieWtoList(reviewsList.stream().map(Review::getDto).collect(Collectors.toList()));
            return productDetailDto;
        }
        return null;
    }

}
