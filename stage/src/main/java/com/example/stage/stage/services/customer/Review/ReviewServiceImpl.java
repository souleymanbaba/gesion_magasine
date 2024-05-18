package com.example.stage.stage.services.customer.Review;

import com.example.stage.stage.dto.OrderedProductsResponseDto;
import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.dto.ReviewDto;
import com.example.stage.stage.entity.*;
import com.example.stage.stage.repostory.OrderRepository;
import com.example.stage.stage.repostory.ProcuctRepository;
import com.example.stage.stage.repostory.ReviewRepository;
import com.example.stage.stage.repostory.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final OrderRepository orderRepository;

    private final ProcuctRepository productRepository;

    private final UserRepository userRepository;

    private final ReviewRepository reviesRepository;

    public OrderedProductsResponseDto getOrderedProductsDetailsByOrderId(Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        OrderedProductsResponseDto orderedProductsResponseDto =
                new OrderedProductsResponseDto();
        if (optionalOrder.isPresent()) {
            orderedProductsResponseDto.setOrderAmount(optionalOrder.get().getAmount());
            List<ProductDto> productDtoList = new ArrayList<>();
            for (CartItems cartItems : optionalOrder.get().getCartItems()) {
                ProductDto productDto = new ProductDto();
                productDto.setId(cartItems.getProduct().getId());
                productDto.setName(cartItems.getProduct().getName());
                productDto.setName(cartItems.getProduct().getName());
                productDto.setPrice(cartItems.getProduct().getPrice());
                productDto.setQuantity(cartItems.getQuantity());
                productDto.setByteimg(cartItems.getProduct().getImg());

                productDtoList.add(productDto);
            }
            orderedProductsResponseDto.setProductDtoList(productDtoList);
        }
            return orderedProductsResponseDto;
        }

    public ReviewDto giveRevies (ReviewDto reviewDto) throws IOException {
        Optional<Product> optionalProduct= productRepository.findById(reviewDto.getProductId());
                Optional<User> optionalUser=   userRepository.findById(reviewDto.getUserId());


        if (optionalProduct.isPresent() && optionalUser.isPresent()) {
            Review review = new Review();
            review.setRating(reviewDto.getRating());
            review.setDescription(reviewDto.getDescription());
            review.setUser(optionalUser.get());
            review.setProduct(optionalProduct.get());
            review.setImg(reviewDto.getImg().getBytes());
            return reviesRepository.save(review).getDto();
        }
        return null;
    }


}
