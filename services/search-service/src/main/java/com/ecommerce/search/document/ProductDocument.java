package com.ecommerce.search.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.time.LocalDateTime;
import java.util.List;

@Document(indexName = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDocument {

    @Id
    private String id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String category;

    @Field(type = FieldType.Keyword)
    private String mainCategory;

    @Field(type = FieldType.Keyword)
    private String productType;

    @Field(type = FieldType.Double)
    private Double price;

    @Field(type = FieldType.Integer)
    private Integer stock;

    @Field(type = FieldType.Keyword)
    private List<String> imageUrls;

    @Field(type = FieldType.Keyword)
    private String brand;

    @Field(type = FieldType.Keyword)
    private String model;

    @Field(type = FieldType.Keyword)
    private String color;

    @Field(type = FieldType.Keyword)
    private String energyClass;

    @Field(type = FieldType.Keyword)
    private String screenSize;

    @Field(type = FieldType.Keyword)
    private String resolution;

    @Field(type = FieldType.Keyword)
    private Double capacity;

    @Field(type = FieldType.Keyword)
    private String processor;

    @Field(type = FieldType.Keyword)
    private String ram;

    @Field(type = FieldType.Keyword)
    private String storage;

    @Field(type = FieldType.Keyword)
    private String gpu;

    @Field(type = FieldType.Keyword)
    private String operatingSystem;

    @Field(type = FieldType.Integer)
    private Integer noiseLevel;

    @Field(type = FieldType.Integer)
    private Integer numberOfPrograms;

    @Field(type = FieldType.Integer)
    private Integer viewCount;

    @Field(type = FieldType.Integer)
    private Integer orderCount;

    @Field(type = FieldType.Double)
    private Double popularityScore;

    @Field(type = FieldType.Boolean)
    private Boolean isActive;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime createdAt;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime updatedAt;
}