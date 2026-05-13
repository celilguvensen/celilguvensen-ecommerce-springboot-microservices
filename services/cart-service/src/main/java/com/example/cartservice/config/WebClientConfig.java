package com.example.cartservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration   
public class WebClientConfig {

    @Value("${product.service.url:http://localhost:8081}")
    private String productServiceUrl;

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(productServiceUrl)
                .build();
    }
}