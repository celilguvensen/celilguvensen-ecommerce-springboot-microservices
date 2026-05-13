package com.ecommerce.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchDTO {
    
    private String id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String mainCategory;
    private String brand;
    private String model;
    private String productType;
    private List<String> imageUrls;
    
    private String color;
    private String energyClass;
    private String screenSize;
    private String resolution;
    private String capacity;
    private String processor;
    private String ram;
    private String storage;
    private String gpu;
    private String operatingSystem;
    private Integer noiseLevel;
    private Integer numberOfPrograms;
    
    private Integer viewCount;
    private Integer orderCount;
    private Double popularityScore;
    
    private Boolean isActive;
    private LocalDateTime createdAt;
    
    private Float score;
}