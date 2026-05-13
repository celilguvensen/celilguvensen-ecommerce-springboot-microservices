package com.example.cartservice.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.util.List;


@Document(collection = "carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    
    @Id
    private String userId; 
    
    private List<CartItem> items;
    
    private BigDecimal totalAmount;
    
    private Integer totalItems;

    public Cart(String userId, List<CartItem> items) {
        this.userId = userId;
        this.items = items;
        this.totalAmount = calculateTotalAmount();
        this.totalItems = calculateTotalItems();
    }


    private BigDecimal calculateTotalAmount() {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return items.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Integer calculateTotalItems() {
        if (items == null || items.isEmpty()) {
            return 0;
        }
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    public void updateTotals() {
        this.totalAmount = calculateTotalAmount();
        this.totalItems = calculateTotalItems();
    }
}