package com.example.stage.stage.services.customer.cart;
import com.example.stage.stage.dto.AddProductInCartDto;
import com.example.stage.stage.dto.CartItemsDto;
import com.example.stage.stage.dto.OrderDto;
import com.example.stage.stage.entity.CartItems;
import com.example.stage.stage.entity.Order;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.entity.User;
import com.example.stage.stage.enums.OrderStatus;
import com.example.stage.stage.repostory.CartItemsRepository;
import com.example.stage.stage.repostory.OrderRepository;
import com.example.stage.stage.repostory.ProcuctRepository;
import com.example.stage.stage.repostory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartItemsRepository cartItemsRepository;
    @Autowired
    private ProcuctRepository productRepository;

    public ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);
        Optional<CartItems> optionalCartItems = cartItemsRepository.findByProductIdAndOrderIdAndUserId(addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId());
        if (optionalCartItems.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }else{
            Optional<Product>  optionalProduct= productRepository.findById(addProductInCartDto.getProductId());
            Optional<User> optionalUser = userRepository.findById(addProductInCartDto.getUserId());
            if(optionalProduct.isPresent() && optionalUser.isPresent()){
                CartItems cart = new CartItems();
                cart.setProduct(optionalProduct.get());
                cart.setPrice (optionalProduct.get().getPrice());
                cart.setQuantity(1L);
                cart.setUser(optionalUser.get());
                cart.setOrder(activeOrder);
                CartItems updatedCart =cartItemsRepository.save(cart);
                activeOrder.setTotalAmount(activeOrder.getTotalAmount() + cart.getPrice());
                activeOrder.setAmount(activeOrder.getAmount() + cart.getPrice());
                activeOrder.getCartItems().add(cart );
                orderRepository.save(activeOrder);

                return ResponseEntity.status(HttpStatus.CREATED).body(cart);
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or product not found");
            }
        }

}
    public OrderDto getCartByUserId (Long userId) {
        Order activeOrder= orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.Pending);
        List<CartItemsDto> cartItemsDtoList = activeOrder.getCartItems().stream().map(CartItems::getCartto).collect(Collectors.toList());
        OrderDto orderDto =new OrderDto();
        orderDto.setAmount(activeOrder.getAmount());
        orderDto.setId(activeOrder.getId());
        orderDto.setOrderStatus(activeOrder.getOrderStatus());
        orderDto.setDiscount(activeOrder.getDiscount());
        orderDto.setTotalAmount(activeOrder.getTotalAmount());
        orderDto.setCartItems(cartItemsDtoList);
        return orderDto;
    }


}
