package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Boolean existsByCode(String code);
    Optional<Coupon> findByCode(String code);
}
