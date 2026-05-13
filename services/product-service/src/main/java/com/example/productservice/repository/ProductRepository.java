package com.example.productservice.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.productservice.model.Category;
import com.example.productservice.model.MainCategory;
import com.example.productservice.model.Product;

public interface ProductRepository extends MongoRepository<Product,String>{

    List<Product> findByCategory(Category category);
    List<Product> findByMainCategory(MainCategory mainCategory);

}
