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
    public ResponseEntity<List<WishlistDto>> getWishlistByUserId(@PathVariable Long userId, @RequestParam(value = "lang", defaultValue = "fr") String lang) {
        return ResponseEntity.ok(wishlistService.getWishlistByUserId(userId,lang));
    }

    @DeleteMapping("/removedd/{productId}/{userId}")
    public ResponseEntity<?> removeProductFromWishlist(@PathVariable Long productId, @PathVariable Long userId) {
        System.out.println(productId);
        System.out.println("--------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
        System.out.println(userId);

        System.out.println("--------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
        wishlistService.removeProductFromWishlist(productId, userId);
        return ResponseEntity.ok("Produit supprimé de la wishlist avec succès");
    }

    @DeleteMapping("/wishlist/{id}")
    public ResponseEntity<Void> deleteWishListItem(@PathVariable Long id) {
        wishlistService.deleteWishListItem(id);
        return ResponseEntity.noContent().build();
    }

}
