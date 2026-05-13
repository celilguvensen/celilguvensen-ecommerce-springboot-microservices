package com.ecommerce.search.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;
import java.time.LocalDateTime;
import java.util.List;

@Document(indexName = "orders")  
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocument {

    @Id
    private String id;  

    @Field(type = FieldType.Keyword)
    private String userId;

    private Double totalPrice;

    @Field(type = FieldType.Keyword)
    private String status;

 
    @Field(type = FieldType.Keyword)
    private String city;

    @Field(type = FieldType.Keyword)
    private String district;

    private int itemCount;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime timestamp;
 
    private List<String> productNames;
}