package com.example.productservice.model;

import java.util.List;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Document(collection = "products")
@TypeAlias("tv")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Tv extends Product {
    private double screenSize;
    private String resolution;
    private List<String> smartPlatform;
    private List<String> ports;
    private boolean isSmartTv;
    private String panelType;
    private boolean hasHDR;
    private String energyClass;
    private String tunerType;
    private List<String> supportedApps;
}
