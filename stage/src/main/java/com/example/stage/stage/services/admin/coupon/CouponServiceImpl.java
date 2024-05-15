package com.example.stage.stage.services.admin.coupon;

import com.example.stage.stage.entity.Coupon;
import com.example.stage.stage.exceptions.ValidationException;
import com.example.stage.stage.repostory.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {
    private  final CouponRepository couponRepository;
    public Coupon createCoupon (Coupon coupon) {
        if(couponRepository.existsByCode(coupon.getCode())){
            throw new ValidationException("Coupon code already exists.");
        }
        return couponRepository.save(coupon);
    }
    public List<Coupon> getAllCoupons(){
        return couponRepository.findAll();
    }

}
