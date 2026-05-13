package com.ecommerce.search.config;

import com.ecommerce.search.document.OrderDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderConsumer {

    private final ElasticsearchOperations elasticsearchOperations;

    @KafkaListener(topics = "order-events", groupId = "search-service-group")
    public void consumeOrderEvent(Map<String, Object> event) { // Map olarak bekliyoruz
        try {
            log.info("Kafka'dan ham veri alındı: {}", event);
            
            String eventType = (String) event.get("event");
            
            if (eventType != null && (eventType.contains("CREATED") || eventType.contains("UPDATED"))) {
                OrderDocument document = convertToDocument(event);
                elasticsearchOperations.save(document);
                log.info("Sipariş başarıyla ES'e kaydedildi: {}", document.getId());
            }
        } catch (Exception e) {
            log.error("Sipariş işlenirken hata oluştu: ", e);
        }
    }

    private OrderDocument convertToDocument(Map<String, Object> event) {
        Map<String, Object> address = (Map<String, Object>) event.get("shippingAddress");
        List<Map<String, Object>> items = (List<Map<String, Object>>) event.get("items");
        
        List<String> productNames = items != null ? 
            items.stream().map(i -> (String) i.get("productName")).toList() : List.of();

        return OrderDocument.builder()
                .id((String) event.get("orderId"))
                .userId((String) event.get("userId"))
                .totalPrice(event.get("totalPrice") != null ? Double.parseDouble(event.get("totalPrice").toString()) : 0.0)
                .status((String) event.get("status"))
                .city(address != null ? (String) address.get("city") : "Bilinmiyor")
                .district(address != null ? (String) address.get("district") : "Bilinmiyor")
                .itemCount(event.get("itemCount") != null ? (int) event.get("itemCount") : 0)
                .productNames(productNames)
                .timestamp(LocalDateTime.now())
                .build();
    }
}