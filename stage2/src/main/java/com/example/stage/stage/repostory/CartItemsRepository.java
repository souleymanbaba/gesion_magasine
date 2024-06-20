package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemsRepository extends JpaRepository<CartItems, Long> {
    Optional<CartItems> findByProductIdAndOrderIdAndUserId(Long ProductId, Long OrderId, Long UserId);
    List<CartItems> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
