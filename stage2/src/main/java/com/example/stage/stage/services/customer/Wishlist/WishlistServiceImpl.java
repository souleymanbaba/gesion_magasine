package com.example.stage.stage.services.customer.Wishlist;

import com.example.stage.stage.dto.WishlistDto;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.entity.User;
import com.example.stage.stage.entity.WishList;
import com.example.stage.stage.repostory.ProcuctRepository;
import com.example.stage.stage.repostory.UserRepository;
import com.example.stage.stage.repostory.WishListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService{
    String l="ar";
    private final UserRepository userRepository;

    private final ProcuctRepository productRepository;

    private final WishListRepository wishlistRepository;
    public WishlistDto addProductToWishlist (WishlistDto wishlistDto) {
        Optional<Product> optionalProduct=  productRepository.findById(wishlistDto.getProductId());
        Optional<User> optionalUser=userRepository.findById(wishlistDto.getUserId());
        if (optionalProduct.isPresent() && optionalUser.isPresent()){
            WishList wishlist = new WishList();
            wishlist.setProduct(optionalProduct.get());

            wishlist.setUser(optionalUser.get());
            return wishlistRepository.save(wishlist).getWishlistDto(l);
        }
        return null;
    }
    @Transactional
    public void removeProductFromWishlist(Long productId, Long userId) {
        wishlistRepository.deleteByProductIdAndUserId(productId, userId);
    }


    public void deleteWishListItem(Long wishListId) {
        wishlistRepository.deleteById(wishListId);
    }

    public List<WishlistDto> getWishlistByUserId(Long userId,String lang) {
        return wishlistRepository.findAllByUserId(userId).stream()
                .map(wishlist -> wishlist.getWishlistDto(lang))
                .collect(Collectors.toList());
    }
}
