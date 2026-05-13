package com.example.cartservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private String id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private List<String> imageUrls;
    private String category;
    private String mainCategory;
    private String brand;
    
    public String getFirstImageUrl() {
        return (imageUrls != null && !imageUrls.isEmpty()) ? imageUrls.get(0) : null;
    }
    
    public boolean isInStock() {
        return stock != null && stock > 0;
    }
}