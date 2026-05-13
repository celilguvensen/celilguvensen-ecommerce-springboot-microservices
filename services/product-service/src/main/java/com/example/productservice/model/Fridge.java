package com.example.productservice.model;

import java.util.List;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Document(collection = "products")
@TypeAlias("fridge")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Fridge extends Product {
    private double capacity;
    private boolean hasFreezer;
    private int doorCount;
    private String energyClass;
    private List<String> features;
    private String color;
    private List<Integer> dimensions; 
}