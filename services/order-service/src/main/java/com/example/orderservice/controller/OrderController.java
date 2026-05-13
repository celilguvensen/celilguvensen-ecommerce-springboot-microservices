package com.example.orderservice.controller;

import com.example.orderservice.dto.ReturnRequest;
import com.example.orderservice.dto.ReviewRequest;
import com.example.orderservice.model.Location;
import com.example.orderservice.model.LocationHistory;
import com.example.orderservice.model.Order;
import com.example.orderservice.service.OrderService;
import com.example.orderservice.security.SecurityContext;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    private String getUserId(HttpServletRequest request) {
        String userId = SecurityContext.getCurrentUserId(request);
        String userRole = SecurityContext.getCurrentUserRole(request);
        log.info("Order request - UserID: {}, Role: {}", userId, userRole);
        return userId != null ? userId : "anonymous";
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request,
                                      HttpServletRequest httpRequest) {
        try {
            String userId = getUserId(httpRequest);
            log.info("Checkout request for userId: {}", userId);

            Order order = request.getOrder();
            if (order == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Order data is required"));
            }

            order.setUserId(userId);
            log.info("Creating order for user: {}, items: {}", userId, order.getItems().size());

            Order createdOrder = orderService.createOrder(order);
            return ResponseEntity.ok(createdOrder);

        } catch (Exception e) {
            log.error("Checkout error: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Checkout failed: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order,
                                         HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            order.setUserId(userId);
            Order createdOrder = orderService.createOrder(order);
            return ResponseEntity.ok(createdOrder);

        } catch (Exception e) {
            log.error("Create order error: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Order creation failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable String orderId,
                                      HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            Order order = orderService.getOrderById(orderId);

            if (!order.getUserId().equals(userId) && !SecurityContext.isAdmin(request)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Access denied"));
            }
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            log.error("Get order error: {}", e.getMessage());
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Order not found"));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            List<Order> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            log.error("Get my orders error: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to fetch orders"));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable String userId,
                                           HttpServletRequest request) {
        try {
            String currentUserId = getUserId(request);
            if (!userId.equals(currentUserId) && !SecurityContext.isAdmin(request)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Access denied"));
            }

            List<Order> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            log.error("Get user orders error: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to fetch orders"));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(required = false) String status,
            HttpServletRequest request) {
        try {
            if (!SecurityContext.isAdmin(request)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Admin access required"));
            }

            List<Order> orders = orderService.getAllOrders(page, size, status);
            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            log.error("Get all orders error: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to fetch orders"));
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String,String> body,
            HttpServletRequest request) {
        try {
            if (!SecurityContext.isAdmin(request)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Admin access required"));
            }
            String status = body.get("status");
            if (status == null || status.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Status field is required"));
            }

            Order updatedOrder = orderService.updateOrderStatus(orderId, status,true);
            return ResponseEntity.ok(updatedOrder);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            log.error("Update status error: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Status update failed: " + e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/location")
    public ResponseEntity<?> updateLocation(
            @PathVariable String orderId,
            @Valid @RequestBody LocationUpdateRequest request,
            HttpServletRequest httpRequest) {
        try {
            String courierId = getUserId(httpRequest);
            
            Location location = Location.builder()
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .address(request.getAddress())
                    .description(request.getDescription())
                    .timestamp(LocalDateTime.now())
                    .build();

            Order updatedOrder = orderService.updateOrderLocation(orderId, location, courierId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Konum güncellendi",
                "order", updatedOrder
            ));

        } catch (Exception e) {
            log.error("Location update failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/location/history")
    public ResponseEntity<?> getLocationHistory(
            @PathVariable String orderId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            Order order = orderService.getOrderById(orderId);

            if (!order.getUserId().equals(userId) && !SecurityContext.isAdmin(request)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }

            List<LocationHistory> history;
            if (start != null && end != null) {
                history = orderService.getLocationHistoryBetween(orderId, start, end);
            } else {
                history = orderService.getLocationHistory(orderId);
            }

            return ResponseEntity.ok(Map.of(
                "orderId", orderId,
                "locationHistory", history,
                "currentLocation", order.getCurrentLocation(),
                "totalPoints", history.size()
            ));

        } catch (Exception e) {
            log.error("Get location history error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{orderId}/return")
    public ResponseEntity<?> createReturnRequest(
            @PathVariable String orderId,
            @RequestBody ReturnRequest request,
            HttpServletRequest httpRequest) {
        try {
            String userId = getUserId(httpRequest);
            Order order = orderService.getOrderById(orderId);

            if (!order.getUserId().equals(userId) && !SecurityContext.isAdmin(httpRequest)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Bu siparişi iade edemezsiniz"));
            }

            if (!"DELIVERED".equals(order.getStatus().toString())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Sadece teslim edilmiş siparişler iade edilebilir"));
            }

            String returnNote = String.format(
                "İADE TALEBİ - Sebep: %s | Açıklama: %s | Tarih: %s",
                request.getReason(),
                request.getDescription() != null ? request.getDescription() : "Yok",
                LocalDateTime.now()
            );
            
            String currentNotes = order.getNotes();
            order.setNotes(currentNotes != null ? currentNotes + "\n" + returnNote : returnNote);
            
            orderService.updateOrder(order);
            
            log.info("İade talebi oluşturuldu. OrderId: {}, UserId: {}", orderId, userId);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "İade talebiniz alındı. En kısa sürede değerlendirilecek.",
                "orderId", orderId
            ));

        } catch (Exception e) {
            log.error("İade talebi oluşturma hatası: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "İade talebi oluşturulamadı: " + e.getMessage()));
        }
    }

    @PostMapping("/{orderId}/review")
    public ResponseEntity<?> submitReview(
            @PathVariable String orderId,
            @Valid @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {
        try {
            String userId = getUserId(httpRequest);
            Order order = orderService.getOrderById(orderId);

            if (!order.getUserId().equals(userId)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Bu siparişe yorum yapamazsınız"));
            }

            if (!"DELIVERED".equals(order.getStatus().toString())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Sadece teslim edilmiş siparişlere yorum yapılabilir"));
            }

            boolean productExists = order.getItems().stream()
                    .anyMatch(item -> item.getProductId().equals(request.getProductId()));
            
            if (!productExists) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Bu ürün siparişinizde bulunmuyor"));
            }

            String reviewNote = String.format(
                "YORUM - Ürün: %s | Puan: %d/5 | Yorum: %s | Tarih: %s",
                request.getProductId(),
                request.getRating(),
                request.getComment(),
                LocalDateTime.now()
            );
            
            String currentNotes = order.getNotes();
            order.setNotes(currentNotes != null ? currentNotes + "\n" + reviewNote : reviewNote);
            orderService.updateOrder(order);

            log.info("Yorum kaydedildi. OrderId: {}, ProductId: {}, Rating: {}", 
                    orderId, request.getProductId(), request.getRating());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Yorumunuz kaydedildi. Teşekkürler!",
                "rating", request.getRating()
            ));

        } catch (Exception e) {
            log.error("Yorum kaydetme hatası: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Yorum gönderilemedi: " + e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/invoice")
    public ResponseEntity<?> downloadInvoice(
            @PathVariable String orderId,
            HttpServletRequest httpRequest) {
        try {
            String userId = getUserId(httpRequest);
            Order order = orderService.getOrderById(orderId);

            if (!order.getUserId().equals(userId) && !SecurityContext.isAdmin(httpRequest)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Bu faturaya erişim yetkiniz yok"));
            }

            String htmlInvoice = generateHtmlInvoice(order);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            headers.setContentDispositionFormData("attachment", "fatura-" + orderId + ".html");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(htmlInvoice.getBytes());

        } catch (Exception e) {
            log.error("Fatura indirme hatası: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Fatura indirilemedi"));
        }
    }

    private String generateHtmlInvoice(Order order) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
        html.append("<title>Fatura - ").append(order.getId()).append("</title>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; padding: 20px; }");
        html.append(".header { text-align: center; margin-bottom: 30px; }");
        html.append("table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }");
        html.append("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }");
        html.append("th { background-color: #4F46E5; color: white; }");
        html.append(".total { text-align: right; font-size: 18px; font-weight: bold; }");
        html.append("</style></head><body>");
        
        html.append("<div class='header'>");
        html.append("<h1>FATURA</h1>");
        html.append("<p>Sipariş No: ").append(order.getId()).append("</p>");
        html.append("<p>Tarih: ").append(order.getOrderDate()).append("</p>");
        html.append("</div>");
        
        html.append("<div class='info'>");
        html.append("<h3>Teslimat Bilgileri</h3>");
        html.append("<p><strong>Alıcı:</strong> ").append(order.getShippingAddress().getFullName()).append("</p>");
        html.append("<p><strong>Adres:</strong> ").append(order.getShippingAddress().getStreet())
            .append(", ").append(order.getShippingAddress().getCity()).append("</p>");
        html.append("</div>");
        
        html.append("<table><thead><tr>");
        html.append("<th>Ürün</th><th>Adet</th><th>Birim Fiyat</th><th>Toplam</th>");
        html.append("</tr></thead><tbody>");
        
        for (var item : order.getItems()) {
            html.append("<tr>");
            html.append("<td>").append(item.getProductName()).append("</td>");
            html.append("<td>").append(item.getQuantity()).append("</td>");
            html.append("<td>₺").append(String.format("%.2f", item.getPrice())).append("</td>");
            html.append("<td>₺").append(String.format("%.2f", item.getPrice() * item.getQuantity())).append("</td>");
            html.append("</tr>");
        }
        
        html.append("</tbody></table>");
        
        html.append("<div class='total'>");
        html.append("<p>Toplam: ₺").append(String.format("%.2f", order.getTotalPrice())).append("</p>");
        html.append("</div>");
        
        html.append("</body></html>");
        
        return html.toString();
    }
    @Data
    public static class LocationUpdateRequest {
        @NotNull
        @DecimalMin("-90.0")
        @DecimalMax("90.0")
        private Double latitude;
        
        @NotNull
        @DecimalMin("-180.0")
        @DecimalMax("180.0")
        private Double longitude;
        
        private String address;
        private String description;
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderId,
                                         @RequestParam(required = false) String reason,
                                         HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            Order order = orderService.getOrderById(orderId);

            if (!order.getUserId().equals(userId) && !SecurityContext.isAdmin(request)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Access denied"));
            }

            orderService.cancelOrder(orderId, reason);
            return ResponseEntity.ok(Map.of("success", true, "message", "Order cancelled"));

        } catch (Exception e) {
            log.error("Cancel order error: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Cancellation failed"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "service", "order-service"
        ));
    }

    public static class CheckoutRequest {
        private Order order;

        public Order getOrder() {
            return order;
        }

        public void setOrder(Order order) {
            this.order = order;
        }

        @Override
        public String toString() {
            return "CheckoutRequest{order=" + order + '}';
        }
    }
}
