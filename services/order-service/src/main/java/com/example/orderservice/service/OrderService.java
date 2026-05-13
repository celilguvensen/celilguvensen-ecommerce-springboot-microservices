package com.example.orderservice.service;

import com.example.orderservice.model.*;
import com.example.orderservice.model.enums.OrderStatus;
import com.example.orderservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final LocationHistoryRepository locationHistoryRepository;
    private final KafkaProducerService kafkaProducer;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Order createOrder(Order order) {
        if (!StringUtils.hasText(order.getUserId())) {
            order.setUserId(UUID.randomUUID().toString());
            log.info("UserId boş olduğu için random id atandı: {}", order.getUserId());
        }

        validateOrder(order);

        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.PENDING);
        }
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }

        Double calculatedTotal = order.calculateTotalPrice();
        if (order.getTotalPrice() == null) {
            order.setTotalPrice(calculatedTotal);
        } else if (!order.getTotalPrice().equals(calculatedTotal)) {
            log.warn("Gönderilen toplam fiyat farklı, hesaplanan kullanılacak.");
            order.setTotalPrice(calculatedTotal);
        }

        if (!StringUtils.hasText(order.getPaymentStatus())) {
            order.setPaymentStatus("PENDING");
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Sipariş kaydedildi. OrderId: {}", savedOrder.getId());

        Location startLocation = Location.builder()
                .latitude(41.0082)
                .longitude(28.9784)
                .address("Depo - Başlangıç Noktası, İstanbul")
                .description("Sipariş hazırlandı, çıkış bekliyor.")
                .timestamp(LocalDateTime.now())
                .build();

        savedOrder.setCurrentLocation(startLocation);
        savedOrder = orderRepository.save(savedOrder);

        LocationHistory initialHistory = LocationHistory.builder()
                .orderId(savedOrder.getId())
                .userId(savedOrder.getUserId())
                .latitude(startLocation.getLatitude())
                .longitude(startLocation.getLongitude())
                .address(startLocation.getAddress())
                .description(startLocation.getDescription())
                .timestamp(startLocation.getTimestamp())
                .build();
        
        locationHistoryRepository.save(initialHistory);
        log.info("İlk konum history'ye kaydedildi");

        try {
            kafkaProducer.sendOrderCreatedEvent(savedOrder);
            kafkaProducer.sendLocationUpdateEvent(savedOrder);
        } catch (Exception e) {
            log.error("Kafka event gönderilemedi: ", e);
        }

        try {
            messagingTemplate.convertAndSend("/topic/orders/" + savedOrder.getUserId(), savedOrder);
        } catch (Exception e) {
            log.error("WebSocket mesajı gönderilemedi: ", e);
        }

        return savedOrder;
    }

    @Transactional
    public Order updateOrderLocation(String orderId, Location newLocation, String courierId) {
        Order order = getOrderById(orderId);

        if (newLocation.getLatitude() == null || newLocation.getLongitude() == null) {
            throw new IllegalArgumentException("Geçersiz lokasyon bilgisi");
        }
        
        if (newLocation.getTimestamp() == null) {
            newLocation.setTimestamp(LocalDateTime.now());
        }

        Location previousLocation = order.getCurrentLocation();
        
        Double distanceFromPrevious = null;
        if (previousLocation != null) {
            distanceFromPrevious = calculateDistance(
                previousLocation.getLatitude(),
                previousLocation.getLongitude(),
                newLocation.getLatitude(),
                newLocation.getLongitude()
            );
        }

        Double distanceToDestination = null;
        Integer estimatedMinutes = null;
        if (order.getShippingAddress() != null) {
            distanceToDestination = estimateDistanceToDestination(
                newLocation,
                order.getShippingAddress().getCity()
            );
            
            if (distanceToDestination != null) {
                estimatedMinutes = (int) Math.ceil((distanceToDestination / 60.0) * 60);
            }
        }

        order.setCurrentLocation(newLocation);
        Order savedOrder = orderRepository.save(order);

        LocationHistory historyEntry = LocationHistory.builder()
                .orderId(orderId)
                .userId(order.getUserId())
                .courierId(courierId)
                .latitude(newLocation.getLatitude())
                .longitude(newLocation.getLongitude())
                .address(newLocation.getAddress())
                .description(newLocation.getDescription())
                .timestamp(newLocation.getTimestamp())
                .distanceFromPrevious(distanceFromPrevious)
                .distanceToDestination(distanceToDestination)
                .estimatedMinutesToArrival(estimatedMinutes)
                .build();
        
        locationHistoryRepository.save(historyEntry);
        log.info("Konum güncellendi ve history'ye eklendi: {}", orderId);

        try {
            kafkaProducer.sendLocationUpdateEvent(savedOrder);
        } catch (Exception e) {
            log.error("Lokasyon güncelleme event gönderilemedi: ", e);
        }

        try {
            messagingTemplate.convertAndSend("/topic/orders/" + order.getUserId(), savedOrder);
        } catch (Exception e) {
            log.error("WebSocket broadcast başarısız: ", e);
        }

        return savedOrder;
    }

    public List<LocationHistory> getLocationHistory(String orderId) {
        return locationHistoryRepository.findByOrderIdOrderByTimestampDesc(orderId);
    }

    public List<LocationHistory> getLocationHistoryBetween(
            String orderId, LocalDateTime start, LocalDateTime end) {
        return locationHistoryRepository
            .findByOrderIdAndTimestampBetweenOrderByTimestampAsc(orderId, start, end);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Sipariş bulunamadı: " + orderId));
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<Order> getAllOrders(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> orderPage;
        if (StringUtils.hasText(status)) {
            OrderStatus orderStatus = OrderStatus.fromString(status);
            orderPage = orderRepository.findByStatus(orderStatus, pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }
        return orderPage.getContent();
    }

    @Transactional
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

     

    @Transactional
    public Order updateOrderStatus(String orderId, String newStatus) {
        return updateOrderStatus(orderId, newStatus, false);
    }

    @Transactional
    public Order updateOrderStatus(String orderId, String newStatus, boolean isAdmin) {
        if (!StringUtils.hasText(newStatus)) {
            throw new IllegalArgumentException("Sipariş durumu boş olamaz");
        }

        OrderStatus orderStatus = OrderStatus.fromString(newStatus);
        Order order = getOrderById(orderId);

        if (!isAdmin && !order.canTransitionTo(orderStatus)) {
            throw new IllegalArgumentException(
                    String.format("Sipariş %s'den %s'e geçemez",
                            order.getStatus().getDisplayName(),
                            orderStatus.getDisplayName()));
        }

        OrderStatus oldStatus = order.getStatus();
        
        if (isAdmin) {
            order.setStatus(orderStatus);
        } else {
            order.updateStatus(orderStatus);
        }
        
        Order savedOrder = orderRepository.save(order);

        try {
            kafkaProducer.sendOrderStatusUpdateEvent(savedOrder, oldStatus.name());
            messagingTemplate.convertAndSend("/topic/orders/" + order.getUserId(), savedOrder);
        } catch (Exception e) {
            log.error("Durum güncelleme event gönderilemedi: ", e);
        }

        return savedOrder;
    }

    @Transactional
    public void cancelOrder(String orderId, String reason) {
        Order order = getOrderById(orderId);

        if (order.getStatus() == OrderStatus.DELIVERED ||
            order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Bu sipariş iptal edilemez. Durum: " + order.getStatus().getDisplayName());
        }

        OrderStatus oldStatus = order.getStatus();
        order.updateStatus(OrderStatus.CANCELLED);
        if (StringUtils.hasText(reason)) {
            order.setNotes(order.getNotes() == null ? reason : order.getNotes() + "\nİptal sebebi: " + reason);
        }

        Order savedOrder = orderRepository.save(order);

        try {
            kafkaProducer.sendOrderCancelledEvent(savedOrder, reason);
            messagingTemplate.convertAndSend("/topic/orders/" + order.getUserId(), savedOrder);
        } catch (Exception e) {
            log.error("İptal event gönderilemedi: ", e);
        }

        log.info("Sipariş iptal edildi. OrderId: {}, EskiDurum: {}", orderId, oldStatus);
    }

    private Double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private Double estimateDistanceToDestination(Location currentLocation, String destinationCity) {
        Map<String, double[]> cityCoordinates = Map.of(
            "İstanbul", new double[]{41.0082, 28.9784},
            "Ankara", new double[]{39.9334, 32.8597},
            "İzmir", new double[]{38.4237, 27.1428},
            "Antalya", new double[]{36.8969, 30.7133},
            "Bursa", new double[]{40.1828, 29.0665}
        );

        double[] destCoords = cityCoordinates.getOrDefault(destinationCity, null);
        if (destCoords == null) {
            return null;
        }

        return calculateDistance(
            currentLocation.getLatitude(),
            currentLocation.getLongitude(),
            destCoords[0],
            destCoords[1]
        );
    }

    private void validateOrder(Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Sipariş ürünleri boş olamaz");
        }
        if (order.getShippingAddress() == null) {
            throw new IllegalArgumentException("Teslimat adresi gereklidir");
        }
        if (!StringUtils.hasText(order.getShippingAddress().getFullName())) {
            throw new IllegalArgumentException("Alıcı adı gereklidir");
        }
        if (!StringUtils.hasText(order.getShippingAddress().getCity())) {
            throw new IllegalArgumentException("Şehir bilgisi gereklidir");
        }
        if (!StringUtils.hasText(order.getShippingAddress().getStreet())) {
            throw new IllegalArgumentException("Adres detayı gereklidir");
        }

        order.getItems().forEach(item -> {
            if (!StringUtils.hasText(item.getProductId())) {
                throw new IllegalArgumentException("Ürün ID gereklidir");
            }
            if (item.getPrice() == null || item.getPrice() <= 0) {
                throw new IllegalArgumentException("Geçersiz ürün fiyatı: " + item.getProductName());
            }
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Geçersiz ürün miktarı: " + item.getProductName());
            }
        });
    }
}