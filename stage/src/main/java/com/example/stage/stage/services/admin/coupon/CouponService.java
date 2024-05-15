package com.example.stage.stage.services.admin.coupon;

import com.example.stage.stage.entity.Coupon;

import java.util.List;

public interface CouponService {
    Coupon createCoupon (Coupon coupon);
    List<Coupon> getAllCoupons();
}
