package com.ecommerce.search.service;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.json.JsonData;
import co.elastic.clients.util.ObjectBuilder;
import com.ecommerce.search.document.ProductDocument;
import com.ecommerce.search.dto.ProductSearchDTO;
import com.ecommerce.search.dto.SearchRequest;
import com.ecommerce.search.dto.SearchResponse;
import com.ecommerce.search.repository.ProductSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final ElasticsearchOperations elasticsearchOperations;
    private final ProductSearchRepository productSearchRepository;

    public SearchResponse search(SearchRequest request) {
        long startTime = System.currentTimeMillis();

        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(Query.of(q -> q
                        .bool(b -> buildBoolQuery(b, request))
                ))
                .withPageable(PageRequest.of(request.getPage(), request.getSize()))
                .withSort(getSortOrder(request.getSortBy()))
                .build();

        SearchHits<ProductDocument> searchHits = elasticsearchOperations.search(searchQuery, ProductDocument.class);

        long searchTime = System.currentTimeMillis() - startTime;
        log.info("🔍 Search executed: q='{}', results={}", request.getQuery(), searchHits.getTotalHits());

        List<ProductSearchDTO> products = searchHits.getSearchHits().stream()
                .map(hit -> mapToDTO(hit.getContent()))
                .collect(Collectors.toList());

        return SearchResponse.builder()
                .products(products)
                .totalHits(searchHits.getTotalHits())
                .page(request.getPage())
                .size(request.getSize())
                .totalPages((int) Math.ceil((double) searchHits.getTotalHits() / request.getSize()))
                .searchTime(searchTime)
                .query(request.getQuery())
                .build();
    }

    private ObjectBuilder<BoolQuery> buildBoolQuery(BoolQuery.Builder b, SearchRequest request) {
        
        if (StringUtils.hasText(request.getQuery())) {
            b.must(m -> m.multiMatch(mm -> mm
                    .fields("name^3", "description", "brand^2")
                    .query(request.getQuery())
                    .fuzziness("AUTO")));
        }

        if (StringUtils.hasText(request.getCategory())) {
            b.filter(f -> f.term(t -> t.field("category").value(request.getCategory())));
        }
        if (StringUtils.hasText(request.getBrand())) {
            b.filter(f -> f.term(t -> t.field("brand").value(request.getBrand())));
        }

        if (request.getMinPrice() != null || request.getMaxPrice() != null) {
            b.filter(f -> f.range(r -> {
                if (request.getMinPrice() != null) r.field("price").gte(JsonData.of(request.getMinPrice()));
                if (request.getMaxPrice() != null) r.field("price").lte(JsonData.of(request.getMaxPrice()));
                return r;
            }));
        }

        b.filter(f -> f.term(t -> t.field("isActive").value(true)));
        b.filter(f -> f.range(r -> r.field("stock").gt(JsonData.of(0))));

        return b;
    }

    private Sort getSortOrder(String sortBy) {
        if (!StringUtils.hasText(sortBy)) return Sort.by(Sort.Direction.DESC, "popularityScore");
        return switch (sortBy) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "popularityScore");
        };
    }

    public List<String> autocomplete(String prefix) {
        if (!StringUtils.hasText(prefix) || prefix.length() < 2) return Collections.emptyList();

        NativeQuery query = NativeQuery.builder()
                .withQuery(Query.of(q -> q.matchPhrasePrefix(m -> m.field("name").query(prefix))))
                .withPageable(PageRequest.of(0, 10))
                .build();

        return elasticsearchOperations.search(query, ProductDocument.class)
                .stream()
                .map(h -> h.getContent().getName())
                .distinct()
                .toList();
    }

    public void incrementViewCount(String productId) {
        productSearchRepository.findById(productId).ifPresent(product -> {
            int currentViewCount = product.getViewCount() != null ? product.getViewCount() : 0;
            product.setViewCount(currentViewCount + 1);
            
            int orderCount = product.getOrderCount() != null ? product.getOrderCount() : 0;
            double score = (orderCount * 10.0) + (product.getViewCount() * 0.1);
            product.setPopularityScore(score);
            
            productSearchRepository.save(product);
            log.info("📈 Updated view count for product {}: new count = {}", productId, product.getViewCount());
        });
    }

    private ProductSearchDTO mapToDTO(ProductDocument doc) {
        return ProductSearchDTO.builder()
                .id(doc.getId())
                .name(doc.getName())
                .description(doc.getDescription())
                .price(doc.getPrice())
                .brand(doc.getBrand())
                .category(doc.getCategory())
                .imageUrls(doc.getImageUrls())
                .stock(doc.getStock())
                .isActive(doc.getIsActive())
                .popularityScore(doc.getPopularityScore())
                .build();
    }

    public ProductSearchDTO getProductById(String id) {
        return productSearchRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

 
}