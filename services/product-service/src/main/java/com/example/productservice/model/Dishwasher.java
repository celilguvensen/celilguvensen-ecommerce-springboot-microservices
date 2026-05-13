package com.example.productservice.model;

import java.util.List;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Document(collection = "products")
@TypeAlias("dishwasher")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Dishwasher extends Product {
    private String energyClass;            
    private int capacity;                  
    private int noiseLevel;              
    private boolean hasHalfLoadOption;     
    private boolean hasChildLock;         
    private boolean hasDelayStart;         
    private int waterConsumptionPerCycle;  
    private int numberOfPrograms;          
    private List<Integer> dimensions; 
}
