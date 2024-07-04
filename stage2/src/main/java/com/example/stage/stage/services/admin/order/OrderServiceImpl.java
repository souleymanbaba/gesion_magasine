package com.example.stage.stage.services.admin.order;

import com.example.stage.stage.dto.AnalyticsResponse;
import com.example.stage.stage.dto.OrderDto;
import com.example.stage.stage.entity.CartItems;
import com.example.stage.stage.entity.MouvementStock;
import com.example.stage.stage.entity.Order;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.enums.OrderStatus;
import com.example.stage.stage.repostory.CartItemsRepository;
import com.example.stage.stage.repostory.MouvementStockRepository;
import com.example.stage.stage.repostory.OrderRepository;
import com.example.stage.stage.repostory.ProcuctRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository ;
    @Autowired
    private CartItemsRepository cartItemsRepository;

    @Autowired
    private OrderRepository orderRepositoryy;



    @Autowired
    private ProcuctRepository productRepository;

    @Autowired
    private MouvementStockRepository mouvementStockRepository;



    public List<OrderDto> getAllPlacedOrders(){
            List<Order> orderList =orderRepository.findAllByOrderStatusIn(List.of (OrderStatus.Placed, OrderStatus. Shipped, OrderStatus.Delivered));
return orderList.stream().map(Order::getOrderDto).collect(Collectors.toList());
}

    public OrderDto changeOrderStatus (Long orderId, String status){
    Optional<Order> optionalOrder= orderRepository.findById(orderId);
if (optionalOrder.isPresent()){
        Order order =optionalOrder.get();
        if(Objects.equals(status,  "Shipped")){
            order.setOrderStatus (OrderStatus.Shipped);
        }else if(Objects.equals(status,  "Delivered")){
            order.setOrderStatus(OrderStatus.Delivered);

        }
        return orderRepository.save(order).getOrderDto();
    }
return null;
}

    public AnalyticsResponse calculateAnalytics(){
        LocalDate currentDate= LocalDate.now();
        LocalDate previousMonth= currentDate.minusMonths (1);
        Long currentMonthOrders= getTotalOrdersForMonth(currentDate.getMonthValue(), currentDate.getYear());
        Long previousMonthOrders= getTotalOrdersForMonth (previousMonth.getMonthValue(), previousMonth.getYear());
        Long currentMonthEarnings = getTotalEarningsforMonth(currentDate.getMonthValue(), currentDate.getYear());
        Long previousMonthEarnings= getTotalEarningsforMonth (previousMonth.getMonthValue(), previousMonth.getYear());
        Long placed =orderRepository.countByOrderStatus (OrderStatus.Placed);
        Long shipped= orderRepository.countByOrderStatus (OrderStatus.Shipped);
        Long delivered= orderRepository.countByOrderStatus (OrderStatus.Delivered);
        return new AnalyticsResponse (placed, shipped, delivered, currentMonthOrders, previousMonthOrders, currentMonthEarnings, previousMonthEarnings);
    }

    public Long getTotalOrdersForMonth (int month, int year) {
        Calendar calendar= Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month - 1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        Date startOfMonth= calendar.getTime();
// Move the calendar to the end of the specified month
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum (Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        Date endOfMonth= calendar.getTime();

        List<Order> orders=orderRepository.findByDateBetweenAndOrderStatus (startOfMonth, endOfMonth, OrderStatus.Delivered);
        return (long) orders.size();
    }

    public Long getTotalEarningsforMonth(int month, int year) {
        Calendar calendar= Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month - 1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        Date startOfMonth= calendar.getTime();
// Move the calendar to the end of the specified month
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum (Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        Date endOfMonth= calendar.getTime();

        List<Order> orders=orderRepository.findByDateBetweenAndOrderStatus (startOfMonth, endOfMonth, OrderStatus.Delivered);
        Long sum =0L;
        for
        (Order order: orders) {
            sum += order.getAmount();
        }
        return sum;
    }

    @Transactional
    public void updateOrderAndDeleteCartItems(Long userId) {
        List<CartItems> cartItems = cartItemsRepository.findByUserId(userId);
        for (CartItems item : cartItems) {
            Product product = item.getProduct();
            Long quantity = item.getQuantity();
            int quantite = quantity.intValue();

            product.updateStockQuantity(quantite, MouvementStock.TypeMouvement.SORTIE);
            productRepository.save(product);

            MouvementStock mouvementStock = new MouvementStock();
            mouvementStock.setProduct(product);
            mouvementStock.setType(MouvementStock.TypeMouvement.SORTIE);
            mouvementStock.setQuantite(quantite);
            mouvementStock.setDateMouvement(LocalDateTime.now());
            mouvementStock.setRemarque("Produit acheté par l'utilisateur ID: " + userId);
            mouvementStockRepository.save(mouvementStock);
        }



    }



}
