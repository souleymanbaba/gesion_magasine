package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemsRepository extends JpaRepository<CartItems, Long> {
    Optional<CartItems> findByProductIdAndOrderIdAndUserId(Long ProductId, Long OrderId, Long UserId);
    List<CartItems> findByUserId(Long userId);
    void deleteByUserId(Long userId);

    @Query("SELECT c FROM CartItems c WHERE c.product.id = :productId AND c.user.id = :userId AND c.order.orderStatus = com.example.stage.stage.enums.OrderStatus.Pending")
    CartItems findByProductIdAndUserIdAndPendingOrderStatus(@Param("productId") Long productId, @Param("userId") Long userId);

}
