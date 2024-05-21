package com.example.stage.stage.services.admin.order;

import com.example.stage.stage.dto.AnalyticsResponse;
import com.example.stage.stage.dto.OrderDto;

import java.util.List;

public interface OrderService {
    public List<OrderDto> getAllPlacedOrders();
    OrderDto changeOrderStatus (Long orderId, String status);
    AnalyticsResponse calculateAnalytics();
    void updateOrderAndDeleteCartItems(Long userId);
}
