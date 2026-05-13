package com.ecommerce.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequest {
    
    private String query;             
 
    private String category;
    private String mainCategory;
    private String brand;
    private String productType;       
    private String energyClass;
    private String color;
    
 
    private Double minPrice;
    private Double maxPrice;
 
    private String sortBy;           
 
    private Integer page;
    private Integer size;
 
    public Integer getPage() {
        return page != null ? page : 0;
    }
    
    public Integer getSize() {
        return size != null && size > 0 ? size : 20;
    }
    
    public String getSortBy() {
        return sortBy != null ? sortBy : "relevance";
    }
}