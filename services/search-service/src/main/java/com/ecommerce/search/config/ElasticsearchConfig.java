package com.ecommerce.search.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import java.time.Duration;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.ecommerce.search.repository")
public class ElasticsearchConfig extends ElasticsearchConfiguration {

    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUrl;

    @Value("${spring.elasticsearch.username}")
    private String username;

    @Value("${spring.elasticsearch.password}")
    private String password;

    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(elasticsearchUrl.replace("http://", "").replace("https://", ""))
                .withConnectTimeout(Duration.ofSeconds(60))
                .withSocketTimeout(Duration.ofSeconds(120))
                .withBasicAuth(username, password)
                .build();
    }
}