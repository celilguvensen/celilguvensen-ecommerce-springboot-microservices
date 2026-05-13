package com.example.orderservice.repository;

import com.example.orderservice.model.Order;
import com.example.orderservice.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    List<Order> findByUserIdOrderByOrderDateDesc(String userId);
    
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    List<Order> findByStatusOrderByOrderDateDesc(OrderStatus status);
    
    long countByUserId(String userId);
    
    List<Order> findByUserIdAndStatus(String userId, OrderStatus status);
    
    Page<Order> findByUserIdAndStatus(String userId, OrderStatus status, Pageable pageable);
    
    List<Order> findByOrderDateBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
    
    Order findByTrackingNumber(String trackingNumber);
    
    List<Order> findByPaymentStatus(String paymentStatus);
    
    List<Order> findByStatusNotOrderByOrderDateDesc(OrderStatus status);
    
}