package com.example.productservice.kafka; 

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductEventData {
    private String productId;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String brand;
    private String model;
    private String category;
    private String mainCategory;
    private List<String> imageUrls;
    private Boolean isActive;
    private String productType; 
    private String processor;
    private String ram;
    private String storage;
    private String gpu;
    private String operatingSystem;

    private String screenSize;
    private String resolution;
    private String panelType;

    private String energyClass;
    private Double capacity;
    private Integer noiseLevel;
    private Integer numberOfPrograms;
    private String color;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}