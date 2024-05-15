package com.example.stage.stage.controller.admin;

import com.example.stage.stage.entity.Coupon;
import com.example.stage.stage.exceptions.ValidationException;
import com.example.stage.stage.services.admin.coupon.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/coupons")
public class CouponController {
    private final CouponService adminCouponService;

    @PostMapping
    public ResponseEntity<?> createCoupon (@RequestBody Coupon coupon) {
        try {
            Coupon createdCoupon = adminCouponService.createCoupon(coupon);
            return ResponseEntity.ok(createdCoupon);
        } catch (ValidationException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

        @GetMapping
        public ResponseEntity<List<Coupon>> getAllCoupons(){
            return ResponseEntity.ok(adminCouponService.getAllCoupons());
        }
}
