package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.Order;
import com.example.stage.stage.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
Order findByUserIdAndOrderStatus(Long Id, OrderStatus orderStatus);
}
