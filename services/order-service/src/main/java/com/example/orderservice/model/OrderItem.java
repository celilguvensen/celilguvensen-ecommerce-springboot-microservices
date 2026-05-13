package com.example.orderservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    
    private String productId;
    
    @JsonProperty("productName")
    private String productName;
    
    private Double price;
    private Integer quantity;
    private String imageUrl;
    
    @JsonProperty("name")
    public void setName(String name) {
        if (this.productName == null || this.productName.isEmpty()) {
            this.productName = name;
        }
    }
    
    @JsonProperty("name")
    public String getName() {
        return this.productName;
    }
}