package com.example.stage.stage.controller.admin;

import com.example.stage.stage.dto.AnalyticsResponse;
import com.example.stage.stage.dto.OrderDto;
import com.example.stage.stage.services.admin.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService adminOrderService;

    @DeleteMapping("/reset/{userId}")
    public void resetOrderAndCartItems(@PathVariable Long userId) {
        adminOrderService.updateOrderAndDeleteCartItems(userId);
    }

    @GetMapping("/placedOrders")
    public ResponseEntity<List<OrderDto>> getAllPlacedOrders(){
        return ResponseEntity.ok(adminOrderService.getAllPlacedOrders());
    }

    @GetMapping("/order/{orderId}/{status}")
    public ResponseEntity<?> changeOrderStatus(@PathVariable Long orderId, @PathVariable String status) {
        OrderDto orderDto = adminOrderService.changeOrderStatus(orderId, status);
        if (orderDto == null) {
            return new ResponseEntity<>("Something went wrong!", HttpStatus.BAD_REQUEST);
        }
        if ("Delivered".equalsIgnoreCase(status)) {
            Long userId = orderDto.getUser_id(); // Assurez-vous que OrderDto a un champ userId ou récupérez-le autrement
            adminOrderService.updateOrderAndDeleteCartItems(userId);
        }
        return ResponseEntity.status(HttpStatus.OK).body(orderDto);
    }

    @GetMapping("/order/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics(){
        return ResponseEntity.ok(adminOrderService.calculateAnalytics());
    }
}
