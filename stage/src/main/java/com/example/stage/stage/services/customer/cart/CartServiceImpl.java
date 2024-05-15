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
    @Autowired
    private CouponRepository couponRepository;

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
        if(activeOrder.getCoupon() != null){
            orderDto.setCouponName(activeOrder.getCoupon().getName());
    };

        return orderDto;
    }

    public OrderDto applyCoupon (Long userId, String code) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.Pending);
        Coupon coupon= couponRepository.findByCode(code).orElseThrow(()-> new ValidationException("Coupon not found."));
        if (couponIsExpired(coupon)){
            throw new ValidationException("Coupon has expired.");
        }
        double discountAmount = ((coupon.getDiscount() / 108.8) * activeOrder.getTotalAmount());
        double netAmount =activeOrder.getTotalAmount() - discountAmount;
        activeOrder.setAmount((long)netAmount);
        activeOrder.setDiscount((long) discountAmount);
        activeOrder.setCoupon (coupon);
        orderRepository.save(activeOrder);
        return activeOrder.getOrderDto();
    }



    private boolean couponIsExpired (Coupon coupon) {
        Date currentdate= new Date();
        Date expirationDate =coupon.getExpirationDate();
        return expirationDate != null && currentdate.after(expirationDate);
    }

    public OrderDto increaseProductQuantity (AddProductInCartDto addProductInCartDto) {
        Order activeOrder =orderRepository.findByUserIdAndOrderStatus (addProductInCartDto.getUserId(), OrderStatus.Pending); Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
        Optional<CartItems> optionalCartItem =cartItemsRepository.findByProductIdAndOrderIdAndUserId(
                addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId()
        );
        if (optionalProduct.isPresent() && optionalCartItem.isPresent()) {
            CartItems cartItem= optionalCartItem.get();
            Product product= optionalProduct.get();
            activeOrder.setAmount(activeOrder.getAmount()+ product.getPrice());
            activeOrder.setTotalAmount(activeOrder.getTotalAmount()+ product.getPrice());
            cartItem.setQuantity(cartItem.getQuantity() + 1);
            if(activeOrder.getCoupon() != null){
                double discountAmount = ((activeOrder.getCoupon(). getDiscount() / 100.0) * activeOrder.getTotalAmount());
                double netAmount= activeOrder.getTotalAmount() - discountAmount;
                activeOrder.setAmount((long)netAmount);
                activeOrder.setDiscount((long) discountAmount);
            }
            cartItemsRepository.save(cartItem);
            orderRepository.save(activeOrder);
            return activeOrder.getOrderDto();
        }
        return null;}


    public OrderDto decreaseProductQuantity (AddProductInCartDto addProductInCartDto) {
        Order activeOrder =orderRepository.findByUserIdAndOrderStatus (addProductInCartDto.getUserId(), OrderStatus.Pending); Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
        Optional<CartItems> optionalCartItem =cartItemsRepository.findByProductIdAndOrderIdAndUserId(
                addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId()
        );
        if (optionalProduct.isPresent() && optionalCartItem.isPresent()) {
            CartItems cartItem= optionalCartItem.get();
            Product product= optionalProduct.get();
            activeOrder.setAmount(activeOrder.getAmount()- product.getPrice());
            activeOrder.setTotalAmount(activeOrder.getTotalAmount()- product.getPrice());
            cartItem.setQuantity(cartItem.getQuantity() - 1);
            if(activeOrder.getCoupon() != null){
                double discountAmount = ((activeOrder.getCoupon(). getDiscount() / 100.0) * activeOrder.getTotalAmount());
                double netAmount= activeOrder.getTotalAmount() - discountAmount;
                activeOrder.setAmount((long)netAmount);
                activeOrder.setDiscount((long) discountAmount);
            }
            cartItemsRepository.save(cartItem);
            orderRepository.save(activeOrder);
            return activeOrder.getOrderDto();
        }
        return null;}
    public OrderDto placeOrder (PlaceOrderDto placeOrderDto) {
        Order activeOrder= orderRepository.findByUserIdAndOrderStatus (placeOrderDto.getUserId(), OrderStatus.Pending);
        Optional<User> optionalUser = userRepository.findById(placeOrderDto.getUserId());
        if (optionalUser.isPresent()){
            activeOrder.setOrderDescription (placeOrderDto.getOrderDescription());
            activeOrder.setAddress(placeOrderDto.getAddress());
            activeOrder.setDate(new Date());
            activeOrder.setOrderStatus(OrderStatus.Placed);
            activeOrder.setTrackingId(UUID.randomUUID());
            orderRepository.save(activeOrder);

            Order order = new Order();
            order.setAmount (0L);
            order.setTotalAmount(0L);
            order.setDiscount(0L);
            order.setUser(optionalUser.get());
            order.setOrderStatus (OrderStatus.Pending);
            orderRepository.save(order);
            return activeOrder.getOrderDto();

        }
        return null;
    }
    public List<OrderDto> getMyPlacedOrders (Long userId){
return orderRepository.findByUserIdAndOrderStatusIn(userId, List.of (OrderStatus. Placed, OrderStatus. Shipped,
    OrderStatus.Delivered)).stream().map(Order::getOrderDto).collect(Collectors.toList());
}

}
