package com.ecommerce.search.repository;

import com.ecommerce.search.document.ProductDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductSearchRepository extends ElasticsearchRepository<ProductDocument, String> {
    
    List<ProductDocument> findByCategory(String category);
    List<ProductDocument> findByBrand(String brand);
    List<ProductDocument> findByProductType(String productType);
    List<ProductDocument> findByPriceBetween(Double minPrice, Double maxPrice);
}