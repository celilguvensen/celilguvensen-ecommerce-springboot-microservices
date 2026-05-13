package com.example.productservice.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendProductCreatedEvent(ProductEventData productData) {
        ProductCreatedEvent event = ProductCreatedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType("PRODUCT_CREATED")
                .timestamp(LocalDateTime.now())
                .data(productData)
                .build();

        kafkaTemplate.send("product.created", event);
        log.info("✅ Kafka event gönderildi: {}", event.getEventId());
    }
}