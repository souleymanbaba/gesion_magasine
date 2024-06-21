package com.example.stage.stage.controller.customer;

import com.example.stage.stage.dto.WishlistDto;
import com.example.stage.stage.services.customer.Wishlist.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
public class WishlistController {

    private final WishlistService wishlistService;


    @PostMapping("/wishlist")
    public ResponseEntity<?> addProductTollWishlist (@RequestBody WishlistDto wishlistDto) {
        WishlistDto postedWishlistDto= wishlistService.addProductToWishlist(wishlistDto);
        if(postedWishlistDto == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");


        return ResponseEntity.status(HttpStatus.CREATED).body(postedWishlistDto);
    }

    @GetMapping("/wishlist/{userId}")
    public ResponseEntity<List<WishlistDto>> getWishlistByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistByUserId(userId));
    }

    @DeleteMapping("/wishlist/{id}")
    public ResponseEntity<Void> deleteWishListItem(@PathVariable Long id) {
        wishlistService.deleteWishListItem(id);
        return ResponseEntity.noContent().build();
    }

}
