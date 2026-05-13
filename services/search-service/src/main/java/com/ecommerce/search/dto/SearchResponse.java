package com.ecommerce.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse {
    private List<ProductSearchDTO> products;
    private Long totalHits;
    private Integer page;
    private Integer size;
    private Integer totalPages;
    private Long searchTime;  // ms
    private Map<String, Long> categoryCounts;
    private Map<String, Long> brandCounts;
    private Map<String, Long> productTypeCounts;
    private String query;
}