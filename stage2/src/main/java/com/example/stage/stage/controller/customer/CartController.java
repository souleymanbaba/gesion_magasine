package com.example.stage.stage.controller.customer;

import com.example.stage.stage.dto.AddProductInCartDto;
import com.example.stage.stage.dto.OrderDto;
import com.example.stage.stage.dto.PlaceOrderDto;
import com.example.stage.stage.exceptions.ValidationException;
import com.example.stage.stage.services.cartItems.CartItemsService;
import com.example.stage.stage.services.customer.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final CartItemsService cartItemsService;


    @GetMapping("/cartI/{userId}")
    public ResponseEntity<?> getCartByUserIdAndOrderId(@PathVariable Long userId, @RequestParam Long orderId, @RequestParam(defaultValue = "fr") String lang) {
        OrderDto orderDto = cartService.getCartByUserIdAndOrderId(userId, orderId, lang);
        return ResponseEntity.status(HttpStatus.OK).body(orderDto);
    }


    @GetMapping("/cart/{userId}")
    public ResponseEntity<?> getCartByUserIdI(@PathVariable Long userId,@RequestParam(defaultValue = "fr") String lang) {
        OrderDto orderDto= cartService.getCartByUserId(userId,lang);
        return ResponseEntity.status(HttpStatus.OK).body (orderDto);
    }



    @GetMapping("/cartIi/{userId}")
    public ResponseEntity<?> getCartByUserIdIi(@PathVariable Long userId,@RequestParam(defaultValue = "fr") String lang) {
        OrderDto orderDto= cartService.getCartByUserIdIi(userId,lang);
        return ResponseEntity.status(HttpStatus.OK).body (orderDto);
    }


    @DeleteMapping("/test/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {
        cartItemsService.deleteCartItem(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/removee/{productId}/{userId}")
    public ResponseEntity<?> removeProductFromcart(@PathVariable Long productId, @PathVariable Long userId) {
        System.out.println(productId);
        System.out.println("--------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
        System.out.println(userId);

        System.out.println("--------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
        cartService.removeProductFromcart(productId, userId);
        return ResponseEntity.ok("Produit supprimé de la cart avec succès");
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<?> removeProductFromCart(@PathVariable Long cartItemId) {
        return cartService.removeProductFromCart(cartItemId);
    }


    @PostMapping("/cart")
    public ResponseEntity<?> addProductToCart(@RequestBody AddProductInCartDto addProductInCartDto) {
        return cartService.addProductToCart(addProductInCartDto);
    }



    @PostMapping("/addition")
    public ResponseEntity<OrderDto> increaseProductQuantity(@RequestBody AddProductInCartDto addProductInCartDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.increaseProductQuantity(addProductInCartDto));
    }
    @PostMapping("/deduction")
    public ResponseEntity<OrderDto> decreaseProductQuantity(@RequestBody AddProductInCartDto addProductInCartDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.decreaseProductQuantity(addProductInCartDto));
    }

    @PostMapping("/placeOrder")
    public ResponseEntity<OrderDto> placeOrder(@RequestBody PlaceOrderDto placeOrderDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body (cartService.placeOrder(placeOrderDto));
    }
    @GetMapping("/myOrders/{userId}")
    public ResponseEntity<List<OrderDto>> getMyPlacedOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getMyPlacedOrders (userId));
    }

}