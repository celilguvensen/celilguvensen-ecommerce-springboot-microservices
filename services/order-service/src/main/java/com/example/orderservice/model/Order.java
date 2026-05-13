package com.example.orderservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.example.orderservice.model.enums.OrderStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "orders")
public class Order {
    
    @Id
    private String id;

    @NotNull
    private String userId;
    
    @NotEmpty(message = "Sipariş ürünleri boş olamaz")
    @Valid
    private List<OrderItem> items;
    
    @NotNull(message = "Teslimat adresi gereklidir")
    @Valid
    private Address shippingAddress;
    
    @NotNull(message = "Toplam fiyat gereklidir")
    @Positive(message = "Toplam fiyat pozitif olmalıdır")
    private Double totalPrice;
    
    @Builder.Default
    @NotNull
    private OrderStatus status = OrderStatus.PENDING;

    @Builder.Default
    private LocalDateTime orderDate = LocalDateTime.now();

    private LocalDateTime deliveryDate;
    private String paymentMethod;
    private String paymentStatus;  
    private String trackingNumber;
    private Location currentLocation;
    private String notes;
    
    public Double calculateTotalPrice() {
        if (items == null || items.isEmpty()) {
            return 0.0;
        }
        return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
    
    public boolean isPending() { 
        return OrderStatus.PENDING.equals(status); 
    }
    
    public boolean isConfirmed() { 
        return OrderStatus.CONFIRMED.equals(status); 
    }
    
    public boolean isDelivered() { 
        return OrderStatus.DELIVERED.equals(status); 
    }
    
    public boolean isCancelled() { 
        return OrderStatus.CANCELLED.equals(status); 
    }
    
    public boolean canBeCancelled() {
        return status != null && status.canBeCancelled();
    }
    
    public boolean canBeReturned() {
        return status != null && status.canBeReturned();
    }
    
    public boolean isActive() {
        return status != null && status.isActive();
    }
    
    public boolean isFinal() {
        return status != null && status.isFinal();
    }
    
    public boolean canTransitionTo(OrderStatus newStatus) {
        return status != null && status.canTransitionTo(newStatus);
    }
    
    public void updateStatus(OrderStatus newStatus) {
        if (!canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                String.format("Cannot transition from %s to %s", 
                    status != null ? status.getDisplayName() : "null", 
                    newStatus.getDisplayName())
            );
        }
        this.status = newStatus;
        
        if (OrderStatus.DELIVERED.equals(newStatus) && deliveryDate == null) {
            this.deliveryDate = LocalDateTime.now();
        }
    }
    
    public String getStatusDisplayName() {
        return status != null ? status.getDisplayName() : "Bilinmiyor";
    }
    
    public String getStatusDescription() {
        return status != null ? status.getDescription() : "";
    }
    
    public String getStatusColor() {
        return status != null ? status.getColor() : "#999999";
    }
    
    public int getProgressPercentage() {
        return status != null ? status.getProgressPercentage() : 0;
    }
    
    public String getStatusAsString() {
        return status != null ? status.name() : OrderStatus.PENDING.name();
    }
    
     public void setStatusFromString(String statusStr) {
        this.status = OrderStatus.fromString(statusStr);
    }
}