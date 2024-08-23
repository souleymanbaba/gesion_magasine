package com.example.stage.stage.services.customer.Wishlist;

import com.example.stage.stage.dto.WishlistDto;

import java.util.List;

public interface WishlistService {
    WishlistDto addProductToWishlist (WishlistDto wishlistDto);
    List<WishlistDto> getWishlistByUserId(Long userId,String lang);
    void deleteWishListItem(Long wishListId);
    void removeProductFromWishlist(Long productId, Long userId);
}
