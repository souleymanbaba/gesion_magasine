package com.example.stage.stage.entity;

import com.example.stage.stage.dto.OrderDto;
import com.example.stage.stage.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String orderDescription;


    private Date date;


    private Long amount;

    private String address;
    private String payment;
    private OrderStatus orderStatus; // Remove if unused
    private Long totalAmount;
    private Long discount; // Remove if unused

    private UUID trackingId;

    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "order")
    private List<CartItems> cartItems;

    @OneToOne (cascade =CascadeType.MERGE)
    @JoinColumn(name = "coupon_id", referencedColumnName = "id")
    private Coupon coupon;

    public OrderDto getOrderDto(){
        OrderDto orderDto= new OrderDto();
        orderDto.setId(id);
        orderDto.setOrderDescription(orderDescription);
        orderDto.setAddress(address);
        orderDto.setTrackingId(trackingId);
        orderDto.setAmount(amount);
        orderDto.setDate(date);
        orderDto.setOrderStatus(orderStatus);
        orderDto.setUserName(user.getName());
        if(coupon != null){
            orderDto.setCouponName (coupon.getName());
        }
        return orderDto;
    }

    // Getters and setters omitted for brevity
}

