package com.example.productservice.controller;

import com.example.productservice.kafka.ProductEventData;
import com.example.productservice.kafka.ProductProducer;
import com.example.productservice.model.*;
import com.example.productservice.repository.ProductRepository;
import com.example.productservice.service.ImageService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductProducer productProducer;
    private final ImageService imageService;

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .registerModule(new JavaTimeModule());

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/json")
    public Product saveJson(@RequestBody String productJson) {
        try {
            Product product = mapper.readValue(productJson, Product.class);
            return saveProductInternal(product);
        } catch (Exception e) {
            log.error("JSON Save Error: ", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "JSON parse error: " + e.getMessage());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product save(
            @RequestParam("product") String productJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) throws IOException {

        try {
            Product product = mapper.readValue(productJson, Product.class);
            
            if (images != null) {
                if (product.getImageUrls() == null) product.setImageUrls(new ArrayList<>());
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String url = imageService.saveImage(image);
                        product.getImageUrls().add(url);
                    }
                }
            }

            return saveProductInternal(product);
        } catch (Exception e) {
            log.error("Multipart Save Error: ", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error saving product: " + e.getMessage());
        }
    }

    private Product saveProductInternal(Product product) {
        Product saved = productRepository.save(product);
        sendKafkaEvent(saved);
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody String productJson) {
        try {
            if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
            Product product = mapper.readValue(productJson, Product.class);
            product.setId(id);
            Product saved = productRepository.save(product);
            sendKafkaEvent(saved); 
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    private void sendKafkaEvent(Product saved) {
        var builder = ProductEventData.builder()
                .productId(saved.getId())
                .name(saved.getName())
                .price(saved.getPrice())
                .stock(saved.getStock())
                .description(saved.getDescription())
                .imageUrls(saved.getImageUrls())
                .category(saved.getCategory() != null ? saved.getCategory().getDisplayName() : null)
                .mainCategory(saved.getMainCategory() != null ? saved.getMainCategory().getDisplayName() : null)
                .isActive(true) 
                .createdAt(LocalDateTime.now());

        if (saved instanceof PC pc) {
            builder.productType("pc")
                    .brand(pc.getBrand())
                    .model(pc.getModel())
                    .color(pc.getColor())
                    .processor(pc.getProcessor())
                    .ram(pc.getRam())
                    .gpu(pc.getGpu())
                    .storage(pc.getStorage())
                    .operatingSystem(pc.getOperatingSystem())
                    .screenSize(pc.getScreenSize());
        } 
        else if (saved instanceof Tv tv) {
            builder.productType("tv")
                    .screenSize(String.valueOf(tv.getScreenSize()))
                    .resolution(tv.getResolution())
                    .energyClass(tv.getEnergyClass())
                    .panelType(tv.getPanelType());
        }
        else if (saved instanceof Fridge fridge) {
            builder.productType("fridge")
                    .capacity(fridge.getCapacity()) 
                    .energyClass(fridge.getEnergyClass())
                    .color(fridge.getColor());
        }
        else if (saved instanceof Dishwasher dw) {
            builder.productType("dishwasher")
                    .energyClass(dw.getEnergyClass())
                    .noiseLevel(dw.getNoiseLevel())
                    .capacity(Double.valueOf(dw.getCapacity())) 
                    .numberOfPrograms(dw.getNumberOfPrograms());
        }

        productProducer.sendProductCreatedEvent(builder.build());
    }

    @GetMapping("/category/{categoryStr}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String categoryStr) {
        try {
            Category category = Category.fromString(categoryStr);
            List<Product> products = productRepository.findByCategory(category);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/main-category/{mainCategoryStr}")
    public ResponseEntity<List<Product>> getByMainCategory(@PathVariable String mainCategoryStr) {
        try {
            MainCategory mainCategory = MainCategory.fromString(mainCategoryStr);
            List<Product> products = productRepository.findByMainCategory(mainCategory);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }


}