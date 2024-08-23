package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface WishListRepository  extends JpaRepository<WishList,Long> {
    List<WishList> findAllByUserId (Long userId);
    @Modifying
    @Transactional
    @Query("DELETE FROM WishList w WHERE w.product.id = :productId AND w.user.id = :userId")
    void deleteByProductIdAndUserId(Long productId, Long userId);
}
