package com.ecommerce.search.listener;

import com.ecommerce.search.document.ProductDocument;
import com.ecommerce.search.event.ProductEventData;
import com.ecommerce.search.repository.ProductSearchRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductEventListener {

    private final ProductSearchRepository productSearchRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @KafkaListener(topics = "product.created", groupId = "search-service-group")
    public void handleProductCreated(@Payload Map<String, Object> payload) {
        try {
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            ProductEventData eventData = objectMapper.convertValue(data, ProductEventData.class);
            ProductDocument document = mapToDocument(eventData);
            productSearchRepository.save(document);
            log.info("✅ Product indexed: {}", document.getId());
        } catch (Exception e) {
            log.error("❌ Error indexing product: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "product.updated", groupId = "search-service-group")
    public void handleProductUpdated(@Payload Map<String, Object> payload) {
        try {
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            ProductEventData eventData = objectMapper.convertValue(data, ProductEventData.class);
            ProductDocument document = mapToDocument(eventData);
            productSearchRepository.save(document);
            log.info("✅ Product updated: {}", document.getId());
        } catch (Exception e) {
            log.error("❌ Error updating product: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "product.deleted", groupId = "search-service-group")
    public void handleProductDeleted(@Payload Map<String, Object> payload) {
        try {
            String productId = (String) payload.get("productId");
            productSearchRepository.deleteById(productId);
            log.info("✅ Product deleted: {}", productId);
        } catch (Exception e) {
            log.error("❌ Error deleting product: {}", e.getMessage());
        }
    }

    private ProductDocument mapToDocument(ProductEventData data) {
        return ProductDocument.builder()
                .id(data.getProductId())
                .name(data.getName())
                .description(data.getDescription())
                .price(data.getPrice())
                .stock(data.getStock())
                .category(data.getCategory())
                .mainCategory(data.getMainCategory())
                .imageUrls(data.getImageUrls())
                .productType(data.getProductType())
                .brand(data.getBrand())
                .model(data.getModel())
                .color(data.getColor())
                .energyClass(data.getEnergyClass())
                .screenSize(data.getScreenSize())
                .resolution(data.getResolution())
                .capacity(data.getCapacity())
                .processor(data.getProcessor())
                .ram(data.getRam())
                .storage(data.getStorage())
                .gpu(data.getGpu())
                .operatingSystem(data.getOperatingSystem())
                .noiseLevel(data.getNoiseLevel())
                .numberOfPrograms(data.getNumberOfPrograms())
                .viewCount(0)
                .orderCount(0)
                .popularityScore(0.0)
                .isActive(data.getIsActive() != null ? data.getIsActive() : true)
                .createdAt(data.getCreatedAt() != null ? data.getCreatedAt() : LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}