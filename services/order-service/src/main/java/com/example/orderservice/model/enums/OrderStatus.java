package com.example.orderservice.model.enums;

import lombok.Getter;

@Getter
public enum OrderStatus {
    PENDING("Beklemede", "Sipariş onay bekliyor", "#FFA500"),
    CONFIRMED("Onaylandı", "Sipariş onaylandı ve işleme alındı", "#4CAF50"),
    PREPARING("Hazırlanıyor", "Sipariş hazırlanıyor", "#2196F3"),
    SHIPPED("Kargoda", "Sipariş kargoya verildi", "#9C27B0"),
    DELIVERED("Teslim Edildi", "Sipariş başarıyla teslim edildi", "#4CAF50"),
    CANCELLED("İptal Edildi", "Sipariş iptal edildi", "#F44336"),
    RETURNED("İade Edildi", "Sipariş iade edildi", "#FF9800"),
    REFUNDED("İade Tamamlandı", "İade işlemi tamamlandı", "#607D8B");

    private final String displayName;
    private final String description;
    private final String color;

    OrderStatus(String displayName, String description, String color) {
        this.displayName = displayName;
        this.description = description;
        this.color = color;
    }

    public static OrderStatus fromString(String status) {
        if (status == null || status.trim().isEmpty()) {
            return PENDING;
        }
        
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            switch (status.toUpperCase()) {
                case "CREATED":
                    return PENDING;
                case "PROCESSING":
                    return PREPARING;
                case "COMPLETED":
                    return DELIVERED;
                default:
                    throw new IllegalArgumentException("Geçersiz sipariş durumu: " + status);
            }
        }
    }

    public static boolean isValidStatus(String status) {
        try {
            fromString(status);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public boolean canBeCancelled() {
        return this == PENDING || this == CONFIRMED;
    }

    public boolean canBeReturned() {
        return this == DELIVERED;
    }

    public boolean canBeRefunded() {
        return this == RETURNED || this == CANCELLED;
    }

    public boolean isActive() {
        return this != CANCELLED && this != RETURNED && this != REFUNDED;
    }

    public boolean isCompleted() {
        return this == DELIVERED;
    }

    public boolean isFinal() {
        return this == DELIVERED || this == CANCELLED || this == REFUNDED;
    }

    public boolean canTransitionTo(OrderStatus newStatus) {
        switch (this) {
            case PENDING:
                return newStatus == CONFIRMED || newStatus == CANCELLED;
            case CONFIRMED:
                return newStatus == PREPARING || newStatus == CANCELLED;
            case PREPARING:
                return newStatus == SHIPPED || newStatus == CANCELLED;
            case SHIPPED:
                return newStatus == DELIVERED || newStatus == CANCELLED;
            case DELIVERED:
                return newStatus == RETURNED;
            case RETURNED:
                return newStatus == REFUNDED;
            case CANCELLED:
            case REFUNDED:
                return false; 
            default:
                return false;
        }
    }

    public OrderStatus[] getNextPossibleStatuses() {
        switch (this) {
            case PENDING:
                return new OrderStatus[]{CONFIRMED, CANCELLED};
            case CONFIRMED:
                return new OrderStatus[]{PREPARING, CANCELLED};
            case PREPARING:
                return new OrderStatus[]{SHIPPED, CANCELLED};
            case SHIPPED:
                return new OrderStatus[]{DELIVERED, CANCELLED};
            case DELIVERED:
                return new OrderStatus[]{RETURNED};
            case RETURNED:
                return new OrderStatus[]{REFUNDED};
            case CANCELLED:
            case REFUNDED:
                return new OrderStatus[]{}; 
            default:
                return new OrderStatus[]{};
        }
    }

    public int getProgressPercentage() {
        switch (this) {
            case PENDING:
                return 10;
            case CONFIRMED:
                return 25;
            case PREPARING:
                return 50;
            case SHIPPED:
                return 75;
            case DELIVERED:
                return 100;
            case CANCELLED:
            case RETURNED:
            case REFUNDED:
                return 0;
            default:
                return 0;
        }
    }

    public int getTimelineOrder() {
        switch (this) {
            case PENDING:
                return 1;
            case CONFIRMED:
                return 2;
            case PREPARING:
                return 3;
            case SHIPPED:
                return 4;
            case DELIVERED:
                return 5;
            case RETURNED:
                return 6;
            case REFUNDED:
                return 7;
            case CANCELLED:
                return 99; 
            default:
                return 0;
        }
    }

    @Override
    public String toString() {
        return this.displayName;
    }
}