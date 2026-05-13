package com.example.cartservice.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    
    private String productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal price;
    private String category;
    private String mainCategory;
    private String brand;
    private Integer availableStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    

    public BigDecimal getTotalPrice() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }

    public boolean isStockSufficient() {
        return availableStock != null && availableStock >= quantity;
    }
}