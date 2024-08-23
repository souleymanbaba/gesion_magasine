package com.example.stage.stage.services.customer.cart;
import com.example.stage.stage.dto.AddProductInCartDto;
import com.example.stage.stage.dto.CartItemsDto;
import com.example.stage.stage.dto.OrderDto;
import com.example.stage.stage.dto.PlaceOrderDto;
import com.example.stage.stage.entity.*;
import com.example.stage.stage.enums.OrderStatus;
import com.example.stage.stage.exceptions.ValidationException;
import com.example.stage.stage.repostory.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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

    public ResponseEntity<?> removeProductFromCart(Long cartItemId) {
        Optional<CartItems> optionalCartItem = cartItemsRepository.findById(cartItemId);
        if (optionalCartItem.isPresent()) {
            CartItems cartItem = optionalCartItem.get();
            Order activeOrder = cartItem.getOrder();

            if (activeOrder != null) {
                activeOrder.setAmount(activeOrder.getAmount() - cartItem.getPrice() * cartItem.getQuantity());
                activeOrder.setTotalAmount(activeOrder.getTotalAmount() - cartItem.getPrice() * cartItem.getQuantity());
                activeOrder.getCartItems().remove(cartItem);
                cartItemsRepository.delete(cartItem);
                orderRepository.save(activeOrder);
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot remove product from cart");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }
    }

    public ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);
        Optional<CartItems> optionalCartItems = cartItemsRepository.findByProductIdAndOrderIdAndUserId(addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId());
        if (optionalCartItems.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } else {
            Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
            Optional<User> optionalUser = userRepository.findById(addProductInCartDto.getUserId());
            if (optionalProduct.isPresent() && optionalUser.isPresent()) {
                CartItems cart = new CartItems();
                cart.setProduct(optionalProduct.get());
                cart.setPrice(optionalProduct.get().getPrice());
                cart.setQuantity(1L);
                cart.setUser(optionalUser.get());
                cart.setOrder(activeOrder);
                CartItems updatedCart = cartItemsRepository.save(cart);
                activeOrder.setTotalAmount(activeOrder.getTotalAmount() + cart.getPrice());
                activeOrder.setAmount(activeOrder.getAmount() + cart.getPrice());
                activeOrder.getCartItems().add(cart);
                orderRepository.save(activeOrder);

                return ResponseEntity.status(HttpStatus.CREATED).body(cart);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or product not found");
            }
        }

    }

    public OrderDto getCartByUserId(Long userId,String  lang) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.Pending);
        List<CartItemsDto> cartItemsDtoList = activeOrder.getCartItems().stream()
                .map(cartItem -> cartItem.getCartto(lang))
                .collect(Collectors.toList());
        OrderDto orderDto = new OrderDto();
        orderDto.setAmount(activeOrder.getAmount());
        orderDto.setId(activeOrder.getId());
        orderDto.setOrderStatus(activeOrder.getOrderStatus());
        orderDto.setDiscount(activeOrder.getDiscount());
        orderDto.setTotalAmount(activeOrder.getTotalAmount());
        orderDto.setCartItems(cartItemsDtoList);
        return orderDto;
    }

    @Transactional
    public ResponseEntity<?> removeProductFromcart(Long productId, Long userId) {
        CartItems optionalCartItem = cartItemsRepository.findByProductIdAndUserIdAndPendingOrderStatus(productId, userId);
        Order activeOrder = optionalCartItem.getOrder();
        if (activeOrder != null) {
            activeOrder.setAmount(activeOrder.getAmount() - optionalCartItem.getPrice() * optionalCartItem.getQuantity());
            activeOrder.setTotalAmount(activeOrder.getTotalAmount() - optionalCartItem.getPrice() * optionalCartItem.getQuantity());
            activeOrder.getCartItems().remove(optionalCartItem);
            cartItemsRepository.delete(optionalCartItem);
            orderRepository.save(activeOrder);


            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot remove product from cart");
        }

    }

    public OrderDto getCartByUserIdAndOrderId(Long userId, Long orderId, String lang) {
        Optional<Order> optionalOrder = orderRepository.findByIdAndUserId(orderId, userId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            List<CartItemsDto> cartItemsDtoList = order.getCartItems().stream()
                    .map(cartItem -> cartItem.getCartto(lang))
                    .collect(Collectors.toList());
            OrderDto orderDto = new OrderDto();
            orderDto.setAmount(order.getAmount());
            orderDto.setId(order.getId());
            orderDto.setOrderStatus(order.getOrderStatus());
            orderDto.setDiscount(order.getDiscount());
            orderDto.setTotalAmount(order.getTotalAmount());
            orderDto.setCartItems(cartItemsDtoList);
            return orderDto;
        }
        return null; // Or throw an exception if order is not found
    }




    public OrderDto getCartByUserIdI(Long userId,String lang) {

        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.Placed);
        List<CartItemsDto> cartItemsDtoList = activeOrder.getCartItems().stream().map(cartItem -> cartItem.getCartto(lang)).collect(Collectors.toList());
        OrderDto orderDto = new OrderDto();
        orderDto.setAmount(activeOrder.getAmount());
        orderDto.setId(activeOrder.getId());
        orderDto.setOrderStatus(activeOrder.getOrderStatus());
        orderDto.setDiscount(activeOrder.getDiscount());
        orderDto.setTotalAmount(activeOrder.getTotalAmount());
        orderDto.setCartItems(cartItemsDtoList);



        return orderDto;
    }

    public OrderDto getCartByUserIdIi(Long userId,String lang) {

        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.Shipped);
        List<CartItemsDto> cartItemsDtoList = activeOrder.getCartItems().stream().map(cartItem -> cartItem.getCartto(lang)).collect(Collectors.toList());
        OrderDto orderDto = new OrderDto();
        orderDto.setAmount(activeOrder.getAmount());
        orderDto.setId(activeOrder.getId());
        orderDto.setOrderStatus(activeOrder.getOrderStatus());
        orderDto.setDiscount(activeOrder.getDiscount());
        orderDto.setTotalAmount(activeOrder.getTotalAmount());
        orderDto.setCartItems(cartItemsDtoList);



        return orderDto;
    }


    public OrderDto increaseProductQuantity(AddProductInCartDto addProductInCartDto) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);
        Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
        Optional<CartItems> optionalCartItem = cartItemsRepository.findByProductIdAndOrderIdAndUserId(
                addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId()
        );
        if (optionalProduct.isPresent() && optionalCartItem.isPresent()) {
            CartItems cartItem = optionalCartItem.get();
            Product product = optionalProduct.get();
            activeOrder.setAmount(activeOrder.getAmount() + product.getPrice());
            activeOrder.setTotalAmount(activeOrder.getTotalAmount() + product.getPrice());
            cartItem.setQuantity(cartItem.getQuantity() + 1);

            cartItemsRepository.save(cartItem);
            orderRepository.save(activeOrder);
            return activeOrder.getOrderDto();
        }
        return null;
    }


    public OrderDto decreaseProductQuantity(AddProductInCartDto addProductInCartDto) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);
        Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
        Optional<CartItems> optionalCartItem = cartItemsRepository.findByProductIdAndOrderIdAndUserId(
                addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId()
        );
        if (optionalProduct.isPresent() && optionalCartItem.isPresent()) {
            CartItems cartItem = optionalCartItem.get();
            Product product = optionalProduct.get();
            if(cartItem.getQuantity()>0){
                activeOrder.setAmount(activeOrder.getAmount() - product.getPrice());
                activeOrder.setTotalAmount(activeOrder.getTotalAmount() - product.getPrice());
                cartItem.setQuantity(cartItem.getQuantity() - 1);
            }
            cartItemsRepository.save(cartItem);
            orderRepository.save(activeOrder);
            return activeOrder.getOrderDto();
        }
        return null;
    }

    public OrderDto placeOrder(PlaceOrderDto placeOrderDto) {
        Optional<User> optionalUser = userRepository.findById(placeOrderDto.getUserId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            Order activeOrder = orderRepository.findByUserIdAndOrderStatus(user.getId(), OrderStatus.Pending);

            if (activeOrder != null) {
                activeOrder.setOrderDescription(placeOrderDto.getOrderDescription());
                activeOrder.setAddress(placeOrderDto.getAddress());
                activeOrder.setLatitude(placeOrderDto.getLatitude());
                activeOrder.setLongitude(placeOrderDto.getLongitude());
                activeOrder.setWilaya(placeOrderDto.getWilaya());
                activeOrder.setDate(new Date());
                activeOrder.setOrderStatus(OrderStatus.Placed);
                activeOrder.setTrackingId(UUID.randomUUID());
                orderRepository.save(activeOrder);
            }


            Order newOrder = new Order();
            newOrder.setOrderDescription(null);
            newOrder.setDate(null);
            newOrder.setAmount(0L);
            newOrder.setAddress(null);
            newOrder.setPayment(null);
            newOrder.setTotalAmount(0L);
            newOrder.setDiscount(0L);
            newOrder.setTrackingId(null);
            newOrder.setUser(user);
            newOrder.setOrderStatus(OrderStatus.Pending);
            orderRepository.save(newOrder);
            return activeOrder != null ? activeOrder.getOrderDto() : null;
        }
        return null;
    }


    public List<OrderDto> getMyPlacedOrders(Long userId) {
        return orderRepository.findByUserIdAndOrderStatusIn(userId, List.of(OrderStatus.Placed, OrderStatus.Shipped,
                OrderStatus.Delivered)).stream().map(Order::getOrderDto).collect(Collectors.toList());
    }

    public OrderDto searchOrderByTrackingId(UUID trackingId) {
        Optional<Order> optionalOrder = orderRepository.findByTrackingId(trackingId);
        if (optionalOrder.isPresent()) {
            return optionalOrder.get().getOrderDto();
        }
        return null;

    }
}
