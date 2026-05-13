package com.example.orderservice.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    @NotNull
    private String productId;
    
    @Min(1)
    @Max(5)
    private Integer rating;
    
    private String comment;
}