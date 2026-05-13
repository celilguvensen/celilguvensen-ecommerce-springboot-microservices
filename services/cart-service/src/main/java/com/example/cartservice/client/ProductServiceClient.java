package com.example.cartservice.client;

import com.example.cartservice.dto.ProductDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductServiceClient {

    private final WebClient webClient;
 
    public ProductDTO getProductById(String productId) {
        try {
            log.debug("Fetching product from Product Service: {}", productId);
            
            ProductDTO product = webClient.get()
                    .uri("/api/products/{id}", productId)
                    .retrieve()
                    .bodyToMono(ProductDTO.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            
            if (product != null) {
                log.debug("Product fetched successfully: {} - {} - ${}", 
                    product.getId(), product.getName(), product.getPrice());
            }
            
            return product;
        } catch (Exception e) {
            log.error("Failed to fetch product with ID: {}, Error: {}", productId, e.getMessage());
            return null;
        }
    }
}