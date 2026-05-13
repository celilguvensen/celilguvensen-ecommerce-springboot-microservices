package com.example.orderservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "location_history")
public class LocationHistory {
    @Id
    private String id;
    private String orderId;
    private String userId;
    private String courierId;
    private Double latitude;
    private Double longitude;
    private String address;
    private String description;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    private Double speed;
    private Double distanceFromPrevious;
    private Double distanceToDestination;
    private Integer estimatedMinutesToArrival;
}