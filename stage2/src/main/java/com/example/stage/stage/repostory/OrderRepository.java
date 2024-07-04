package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.Order;
import com.example.stage.stage.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    Order findByUserIdAndOrderStatus(Long Id, OrderStatus orderStatus);
List<Order> findAllByOrderStatusIn(List<OrderStatus> orderStatus);
List<Order> findByUserIdAndOrderStatusIn(Long Id, List<OrderStatus> orderStatus);
    Optional<Order> findByTrackingId(UUID trackingId);
    List<Order> findByDateBetweenAndOrderStatus(Date startDate, Date endDate, OrderStatus orderStatus);
    Long countByOrderStatus(OrderStatus orderStatus);
    List<Order> findByUserId(Long userId);
    Optional<Order> findByIdAndUserId(Long orderId, Long userId);
}
