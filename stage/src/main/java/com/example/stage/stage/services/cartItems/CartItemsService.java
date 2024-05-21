package com.example.stage.stage.services.cartItems;
import com.example.stage.stage.repostory.CartItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartItemsService {

    private final CartItemsRepository cartItemsRepository;

    @Autowired
    public CartItemsService(CartItemsRepository cartItemsRepository) {
        this.cartItemsRepository = cartItemsRepository;
    }

    public void deleteCartItem(Long id) {
        if (cartItemsRepository.existsById(id)) {
            cartItemsRepository.deleteById(id);
        } else {
            throw new RuntimeException("Cart item with id " + id + " does not exist");
        }
    }
}

