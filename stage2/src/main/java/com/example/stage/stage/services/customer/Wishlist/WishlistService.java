package com.example.stage.stage.services.customer.Wishlist;

import com.example.stage.stage.dto.WishlistDto;

import java.util.List;

public interface WishlistService {
    WishlistDto addProductToWishlist (WishlistDto wishlistDto);
    List<WishlistDto> getWishlistByUserId(Long userId);
    void deleteWishListItem(Long wishListId);
}
