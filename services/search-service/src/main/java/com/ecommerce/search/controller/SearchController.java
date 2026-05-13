package com.ecommerce.search.controller;

import com.ecommerce.search.dto.ProductSearchDTO;
import com.ecommerce.search.dto.SearchRequest;
import com.ecommerce.search.dto.SearchResponse;
import com.ecommerce.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class SearchController {
    
    private final SearchService searchService;

    @GetMapping("/products")
    public ResponseEntity<SearchResponse> searchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String mainCategory,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) String energyClass,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "relevance") String sortBy,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size
    ) {
        SearchRequest request = SearchRequest.builder()
                .query(q)
                .category(category)
                .mainCategory(mainCategory)
                .brand(brand)
                .productType(productType)
                .energyClass(energyClass)
                .color(color)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .sortBy(sortBy)
                .page(page)
                .size(size)
                .build();
        
        SearchResponse response = searchService.search(request);
        return ResponseEntity.ok(response);
    }
    

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam String q) {
        List<String> suggestions = searchService.autocomplete(q);
        return ResponseEntity.ok(suggestions);
    }
    

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductSearchDTO> getProductById(@PathVariable String id) {
        ProductSearchDTO product = searchService.getProductById(id);
        
        if (product != null) {
            searchService.incrementViewCount(id);
            return ResponseEntity.ok(product);
        }
        
        return ResponseEntity.notFound().build();
    }
    

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("🔍 Search Service is running!");
    }
}