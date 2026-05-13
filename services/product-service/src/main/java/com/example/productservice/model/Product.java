package com.example.productservice.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Document(collection = "products")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type",
    visible = true 
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = Tv.class, name = "tv"),
    @JsonSubTypes.Type(value = Fridge.class, name= "fridge"),
    @JsonSubTypes.Type(value = Dishwasher.class, name= "dishwasher"),
    @JsonSubTypes.Type(value = PC.class, name= "pc")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Product {
    @Id
    private String id;
    private String name;
    private double price;
    private int stock;
    private Category category;
    private MainCategory mainCategory;
    private List<String> imageUrls;
    private String description;
    private String brand;
    private String model;
    private Boolean isActive = true;
}