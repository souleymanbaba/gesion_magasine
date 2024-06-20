package com.example.stage.stage.entity;

import com.example.stage.stage.dto.CartItemsDto;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Entity
@Data

public class CartItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long price;


// No usages

    private Long quantity;

// No usages

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    public CartItemsDto getCartto(String lang){
        CartItemsDto cartItemsDto=new CartItemsDto();
        cartItemsDto.setId(id);
        cartItemsDto.setPrice(price);
        cartItemsDto.setProductId(product.getId());
        cartItemsDto.setQuantity(quantity);
        cartItemsDto.setUserId(user.getId());
        if("ar".equals(lang) && product.getName_ar()!=null ){
            cartItemsDto.setProductNane(product.getName_ar());
        }
        else {
            cartItemsDto.setProductNane(product.getName());
        }
        cartItemsDto.setReturnedImg(product.getImg());


        if("ar".equals(lang) && product.getMarque().getNom_ar()!=null ){
            cartItemsDto.setMarque(product.getMarque().getNom_ar());
        }
        else {
            cartItemsDto.setMarque(product.getMarque().getNom());
        }
        if("ar".equals(lang) && product.getTaille_ar()!=null ){
            cartItemsDto.setTaille(product.getTaille_ar());
        }
        else {
            cartItemsDto.setTaille(product.getTaille());
        }
        return cartItemsDto;
    }

}
