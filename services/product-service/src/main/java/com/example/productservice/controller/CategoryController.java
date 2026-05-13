package com.example.productservice.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.productservice.model.Category;
import com.example.productservice.model.MainCategory;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @GetMapping("/main")
    public List<String> getMainCategories() {
        return Arrays.stream(MainCategory.values())
            .map(MainCategory::getDisplayName)
            .collect(Collectors.toList());
    }

    @GetMapping("/sub")
    public List<String> getCategories() {
        return Arrays.stream(Category.values())
            .map(Category::getDisplayName)
            .collect(Collectors.toList());
    }
}