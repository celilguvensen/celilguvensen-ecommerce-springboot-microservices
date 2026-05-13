package com.example.productservice.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductCreatedEvent {
    private String eventId;
    private String eventType;
    private LocalDateTime timestamp;
    private ProductEventData data;
}