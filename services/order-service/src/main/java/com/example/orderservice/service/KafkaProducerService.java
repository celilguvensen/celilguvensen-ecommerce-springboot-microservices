package com.example.orderservice.service;

import com.example.orderservice.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String ORDER_EVENTS_TOPIC = "order-events";
    private static final String NOTIFICATION_EVENTS_TOPIC = "notification-events";
    private static final String INVENTORY_EVENTS_TOPIC = "inventory-events";
    private static final String PAYMENT_EVENTS_TOPIC = "payment-events";

    public void sendOrderCreatedEvent(Order order) {
        try {
            Map<String, Object> event = createBaseEvent("ORDER_CREATED", order);
            event.put("totalPrice", order.getTotalPrice());
            event.put("itemCount", order.getItems().size());
            event.put("shippingAddress", order.getShippingAddress());
            event.put("items", order.getItems());
            event.put("message", "Yeni sipariş oluşturuldu");
            
            sendEvent(ORDER_EVENTS_TOPIC, order.getUserId(), event);
            
            sendNotificationEvent(order, "ORDER_CREATED", 
                "Siparişiniz başarıyla oluşturuldu. Sipariş No: " + order.getUserId());
            
            sendInventoryReservationEvent(order);
            
            log.info("Order created events sent successfully. OrderId: {}", order.getUserId());
            
        } catch (Exception e) {
            log.error("Failed to send order created event. OrderId: {}, Error: {}", 
                    order.getUserId(), e.getMessage(), e);
        }
    }

    public void sendLocationUpdateEvent(Order order) {
        try {
            Map<String, Object> event = createBaseEvent("ORDER_LOCATION_UPDATED", order);
            event.put("location", order.getCurrentLocation());
            event.put("message", "Sipariş konumu güncellendi");
            
            sendEvent(NOTIFICATION_EVENTS_TOPIC, order.getUserId(), event);
            
            log.debug("Location update event sent. OrderId: {}", order.getUserId());
            
        } catch (Exception e) {
            log.error("Failed to send location update event. OrderId: {}, Error: {}", 
                    order.getUserId(), e.getMessage(), e);
        }
    }

    public void sendOrderStatusUpdateEvent(Order order, String oldStatus) {
        try {
            Map<String, Object> event = createBaseEvent("ORDER_STATUS_UPDATED", order);
            event.put("oldStatus", oldStatus);
            event.put("newStatus", order.getStatus());
            event.put("message", getStatusUpdateMessage(order.getStatus().toString()));
            
            sendEvent(ORDER_EVENTS_TOPIC, order.getUserId(), event);
            
            sendNotificationEvent(order, "ORDER_STATUS_UPDATED", 
                "Siparişinizin durumu güncellendi: " + getStatusDisplayName(order.getStatus().toString()));
            
            handleStatusSpecificEvents(order, oldStatus);
            
            log.info("Order status update events sent. OrderId: {}, Status: {} -> {}", 
                    order.getUserId(), oldStatus, order.getStatus());
            
        } catch (Exception e) {
            log.error("Failed to send order status update event. OrderId: {}, Error: {}", 
                    order.getUserId(), e.getMessage(), e);
        }
    }

    public void sendOrderCancelledEvent(Order order, String reason) {
        try {
            Map<String, Object> event = createBaseEvent("ORDER_CANCELLED", order);
            event.put("cancelReason", reason);
            event.put("cancelledAt", LocalDateTime.now());
            event.put("message", "Sipariş iptal edildi");
            
            sendEvent(ORDER_EVENTS_TOPIC, order.getUserId(), event);
            
            sendNotificationEvent(order, "ORDER_CANCELLED", 
                "Siparişiniz iptal edildi. Sebep: " + reason);
            
            sendInventoryReleaseEvent(order, reason);
            
            if ("PAID".equals(order.getPaymentStatus())) {
                sendPaymentRefundEvent(order, reason);
            }
            
            log.info("Order cancelled events sent. OrderId: {}, Reason: {}", order.getUserId(), reason);
            
        } catch (Exception e) {
            log.error("Failed to send order cancelled event. OrderId: {}, Error: {}", 
                    order.getUserId(), e.getMessage(), e);
        }
    }

    public void sendOrderDeliveredEvent(Order order) {
        try {
            Map<String, Object> event = createBaseEvent("ORDER_DELIVERED", order);
            event.put("deliveredAt", order.getDeliveryDate());
            event.put("message", "Sipariş teslim edildi");
            
            sendEvent(ORDER_EVENTS_TOPIC, order.getUserId(), event);
            
            sendNotificationEvent(order, "ORDER_DELIVERED", 
                "Siparişiniz başarıyla teslim edildi!");
            
            sendInventoryConfirmationEvent(order);
            
            log.info("Order delivered events sent. OrderId: {}", order.getUserId());
            
        } catch (Exception e) {
            log.error("Failed to send order delivered event. OrderId: {}, Error: {}", 
                    order.getUserId(), e.getMessage(), e);
        }
    }

    private void sendNotificationEvent(Order order, String eventType, String message) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("event", eventType);
        notification.put("userId", order.getUserId());
        notification.put("message", message);
        notification.put("timestamp", LocalDateTime.now());
        notification.put("type", "ORDER_NOTIFICATION");
        notification.put("priority", getNotificationPriority(eventType));
        if (order.getCurrentLocation() != null) {
            notification.put("location", order.getCurrentLocation());
        }
        sendEvent(NOTIFICATION_EVENTS_TOPIC, order.getUserId(), notification);
    }

    private void sendInventoryReservationEvent(Order order) {
        Map<String, Object> event = new HashMap<>();
        event.put("event", "INVENTORY_RESERVE");
        event.put("userId", order.getUserId());
        event.put("items", order.getItems());
        event.put("timestamp", LocalDateTime.now());
        
        sendEvent(INVENTORY_EVENTS_TOPIC, order.getUserId(), event);
    }

    private void sendInventoryReleaseEvent(Order order, String reason) {
        Map<String, Object> event = new HashMap<>();
        event.put("event", "INVENTORY_RELEASE");
        event.put("userId", order.getUserId());
        event.put("items", order.getItems());
        event.put("reason", reason);
        event.put("timestamp", LocalDateTime.now());
        
        sendEvent(INVENTORY_EVENTS_TOPIC, order.getUserId(), event);
    }

    private void sendInventoryConfirmationEvent(Order order) {
        Map<String, Object> event = new HashMap<>();
        event.put("event", "INVENTORY_CONFIRM");
        event.put("userId", order.getUserId());
        event.put("items", order.getItems());
        event.put("timestamp", LocalDateTime.now());
        
        sendEvent(INVENTORY_EVENTS_TOPIC, order.getUserId(), event);
    }

    private void sendPaymentRefundEvent(Order order, String reason) {
        Map<String, Object> event = new HashMap<>();
        event.put("event", "PAYMENT_REFUND_REQUEST");
        event.put("userId", order.getUserId());
        event.put("amount", order.getTotalPrice());
        event.put("reason", reason);
        event.put("timestamp", LocalDateTime.now());
        
        sendEvent(PAYMENT_EVENTS_TOPIC, order.getUserId(), event);
    }

    private void handleStatusSpecificEvents(Order order, String oldStatus) {
        switch (order.getStatus().toString()) {
            case "CONFIRMED":
                if ("PENDING".equals(order.getPaymentStatus())) {
                    sendPaymentProcessEvent(order);
                }
                break;
            case "SHIPPED":
                sendShippingEvent(order);
                break;
            case "DELIVERED":
                sendOrderDeliveredEvent(order);
                break;
        }
    }

    private void sendPaymentProcessEvent(Order order) {
        Map<String, Object> event = new HashMap<>();
        event.put("event", "PAYMENT_PROCESS_REQUEST");
        event.put("userId", order.getUserId());
        event.put("amount", order.getTotalPrice());
        event.put("paymentMethod", order.getPaymentMethod());
        event.put("timestamp", LocalDateTime.now());
        
        sendEvent(PAYMENT_EVENTS_TOPIC, order.getUserId(), event);
    }

    private void sendShippingEvent(Order order) {
        Map<String, Object> event = createBaseEvent("ORDER_SHIPPED", order);
        event.put("shippingAddress", order.getShippingAddress());
        event.put("trackingNumber", order.getTrackingNumber());
        event.put("message", "Sipariş kargoya verildi");
        
        sendEvent("shipping-events", order.getUserId(), event);
    }

    private void sendEvent(String topic, String key, Map<String, Object> event) {
        try {
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send(topic, key, event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.debug("Event sent successfully to topic: {}, key: {}, event: {}", 
                            topic, key, event.get("event"));
                } else {
                    log.error("Failed to send event to topic: {}, key: {}, event: {}, error: {}", 
                            topic, key, event.get("event"), ex.getMessage());
                }
            });
            
        } catch (Exception e) {
            log.error("Exception while sending event to topic: {}, key: {}, error: {}", 
                    topic, key, e.getMessage(), e);
        }
    }

    private Map<String, Object> createBaseEvent(String eventType, Order order) {
        Map<String, Object> event = new HashMap<>();
        event.put("event", eventType);
        event.put("orderId",order.getId());
        event.put("userId", order.getUserId());
        event.put("status", order.getStatus().toString());
        event.put("timestamp", LocalDateTime.now());
        return event;
    }

    private String getStatusUpdateMessage(String status) {
        switch (status) {
            case "PENDING": return "Sipariş onay bekliyor";
            case "CONFIRMED": return "Sipariş onaylandı";
            case "PREPARING": return "Sipariş hazırlanıyor";
            case "SHIPPED": return "Sipariş kargoya verildi";
            case "DELIVERED": return "Sipariş teslim edildi";
            case "CANCELLED": return "Sipariş iptal edildi";
            default: return "Sipariş durumu güncellendi";
        }
    }

    private String getStatusDisplayName(String status) {
        switch (status) {
            case "PENDING": return "Beklemede";
            case "CONFIRMED": return "Onaylandı";
            case "PREPARING": return "Hazırlanıyor";
            case "SHIPPED": return "Kargoda";
            case "DELIVERED": return "Teslim Edildi";
            case "CANCELLED": return "İptal Edildi";
            default: return status;
        }
    }

    private String getNotificationPriority(String eventType) {
        switch (eventType) {
            case "ORDER_DELIVERED":
            case "ORDER_CANCELLED":
                return "HIGH";
            case "ORDER_SHIPPED":
            case "ORDER_CONFIRMED":
                return "MEDIUM";
            default:
                return "LOW";
        }
    }
}