package com.example.productservice.model;

import java.util.List;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Document(collection = "products")
@TypeAlias("pc")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class PC extends Product {

    private String processor;          
    private String ram;                
    private String storage;            
    private String gpu;                
    private String operatingSystem;    
    private String screenSize;         
    private String screenResolution;   
    private String color;              
    private double weight;             
    private String connectivity;       
    private List<String> ports;             
    private boolean isLaptop;          
}