package com.example.productservice.kafka;

import com.example.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryConsumer {

    private final ProductRepository productRepository;

    @KafkaListener(
        topics = "inventory-events",
        groupId = "product-service-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleInventoryEvent(Map<String, Object> event) {
        String eventType = (String) event.get("event");
        List<Map<String, Object>> items = (List<Map<String, Object>>) event.get("items");

        log.info("Inventory event alındı: {}", eventType);

        if (items == null || items.isEmpty()) {
            log.warn("Items boş geldi, event: {}", eventType);
            return;
        }

        switch (eventType) {
            case "INVENTORY_RESERVE" -> reserveStock(items);
            case "INVENTORY_RELEASE" -> releaseStock(items);
            case "INVENTORY_CONFIRM" -> log.info("Stok tüketimi onaylandı.");
            default -> log.debug("Bilinmeyen event tipi: {}", eventType);
        }
    }

    private void reserveStock(List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            String productId = (String) item.get("productId");
            int quantity = ((Number) item.get("quantity")).intValue();

            productRepository.findById(productId).ifPresentOrElse(product -> {
                if (product.getStock() < quantity) {
                    log.error("Yetersiz stok! productId={}, mevcut={}, istenen={}",
                            productId, product.getStock(), quantity);
                    return;
                }
                product.setStock(product.getStock() - quantity);
                productRepository.save(product);
                log.info("Stok düşüldü: productId={}, yeni stok={}", productId, product.getStock());
            }, () -> log.error("Ürün bulunamadı: {}", productId));
        }
    }

    private void releaseStock(List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            String productId = (String) item.get("productId");
            int quantity = ((Number) item.get("quantity")).intValue();

            productRepository.findById(productId).ifPresentOrElse(product -> {
                product.setStock(product.getStock() + quantity);
                productRepository.save(product);
                log.info("Stok iade edildi: productId={}, yeni stok={}", productId, product.getStock());
            }, () -> log.error("Ürün bulunamadı: {}", productId));
        }
    }
}