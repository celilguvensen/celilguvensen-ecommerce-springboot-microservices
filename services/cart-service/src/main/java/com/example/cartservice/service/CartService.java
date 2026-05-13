package com.example.cartservice.service;

import com.example.cartservice.client.ProductServiceClient;
import com.example.cartservice.dto.ProductDTO;
import com.example.cartservice.model.Cart;
import com.example.cartservice.model.CartItem;
import com.example.cartservice.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final ProductServiceClient productServiceClient;
    private final MongoTemplate mongoTemplate; 
 
    public Cart getCartByUserId(String userId) {
        return cartRepository.findById(userId)
                .orElse(new Cart(userId, new ArrayList<>()));
    }
 
    public Cart addItemToCart(String userId, String productId, Integer quantity) {
        ProductDTO product = productServiceClient.getProductById(productId);
        
        if (product == null) {
            throw new RuntimeException("Product not found with ID: " + productId);
        }
        
        if (!product.isInStock()) {
            throw new RuntimeException("Product is out of stock");
        }
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }

        Cart cart = getCartByUserId(userId);
        
        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + quantity;
            if (newQuantity > product.getStock()) {
                throw new RuntimeException("Cannot add more items. Available stock: " + product.getStock());
            }
            
            existingItem.setQuantity(newQuantity);
            existingItem.setUpdatedAt(LocalDateTime.now());
            existingItem.setPrice(BigDecimal.valueOf(product.getPrice()));
            existingItem.setAvailableStock(product.getStock());
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductId(product.getId());
            newItem.setProductName(product.getName());
            newItem.setQuantity(quantity);
            newItem.setPrice(BigDecimal.valueOf(product.getPrice()));
            newItem.setProductImage(product.getFirstImageUrl());
            newItem.setCategory(product.getCategory());
            newItem.setMainCategory(product.getMainCategory());
            newItem.setBrand(product.getBrand());
            newItem.setAvailableStock(product.getStock());
            newItem.setCreatedAt(LocalDateTime.now());
            newItem.setUpdatedAt(LocalDateTime.now());
            
            cart.getItems().add(newItem);
        }

        cart.updateTotals();
        
        log.info("Product added to cart - User: {}, Product: {}, Quantity: {}, Price: ${}", 
                 userId, productId, quantity, product.getPrice());
        
        return cartRepository.save(cart);
    }


    public Cart updateCartItem(String userId, String productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));

        if (quantity == 0) {
            cart.getItems().remove(item);
        } else {
            ProductDTO product = productServiceClient.getProductById(productId);
            if (product != null) {
                if (quantity > product.getStock()) {
                    throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
                }
                
                item.setPrice(BigDecimal.valueOf(product.getPrice()));
                item.setAvailableStock(product.getStock());
                item.setProductImage(product.getFirstImageUrl());
                item.setProductName(product.getName());
            }
            
            item.setQuantity(quantity);
            item.setUpdatedAt(LocalDateTime.now());
        }

        cart.updateTotals();
        return cartRepository.save(cart);
    }


    public Cart removeItemFromCart(String userId, String productId) {
        Cart cart = getCartByUserId(userId);

        if (cart.getItems() != null) {
            cart.getItems().removeIf(item -> item.getProductId().equals(productId));
            cart.updateTotals();
        }

        return cartRepository.save(cart);
    }


    public void clearCart(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.setItems(new ArrayList<>());
        cart.updateTotals();
        cartRepository.save(cart);
    }


    @Transactional
    public void migrateGuestCart(String guestUserId, String newUserId) {
        Cart guestCart = cartRepository.findById(guestUserId).orElse(null);
        
        if (guestCart == null || guestCart.getItems() == null || guestCart.getItems().isEmpty()) {
            log.info("No guest cart to migrate for guest: {}", guestUserId);
            return;
        }

        Cart userCart = getCartByUserId(newUserId);

        for (CartItem guestItem : guestCart.getItems()) {
            ProductDTO product = productServiceClient.getProductById(guestItem.getProductId());
            if (product != null) {
                guestItem.setPrice(BigDecimal.valueOf(product.getPrice()));
                guestItem.setAvailableStock(product.getStock());
                guestItem.setProductImage(product.getFirstImageUrl());
                guestItem.setProductName(product.getName());
                guestItem.setCategory(product.getCategory());
                guestItem.setMainCategory(product.getMainCategory());
                guestItem.setBrand(product.getBrand());
            }
            
            CartItem existingItem = userCart.getItems().stream()
                    .filter(item -> item.getProductId().equals(guestItem.getProductId()))
                    .findFirst()
                    .orElse(null);

            if (existingItem != null) {
                int newQuantity = existingItem.getQuantity() + guestItem.getQuantity();
                if (product != null && newQuantity > product.getStock()) {
                    newQuantity = product.getStock();
                }
                existingItem.setQuantity(newQuantity);
                existingItem.setUpdatedAt(LocalDateTime.now());
            } else {
                userCart.getItems().add(guestItem);
            }
        }

        userCart.updateTotals();
        cartRepository.save(userCart);
        
        Query deleteQuery = new Query(Criteria.where("_id").is(guestUserId));
        mongoTemplate.remove(deleteQuery, Cart.class);
        
        log.info("Migrated guest cart from {} to {}", guestUserId, newUserId);
    }
    

    public Cart refreshCartItems(String userId) {
        Cart cart = getCartByUserId(userId);
        
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            return cart;
        }
        
        List<CartItem> itemsToRemove = new ArrayList<>();
        
        for (CartItem item : cart.getItems()) {
            ProductDTO product = productServiceClient.getProductById(item.getProductId());
            
            if (product == null || !product.isInStock()) {
                itemsToRemove.add(item);
                log.warn("Product {} is no longer available, removing from cart", item.getProductId());
                continue;
            }
            
            item.setPrice(BigDecimal.valueOf(product.getPrice()));
            item.setProductName(product.getName());
            item.setProductImage(product.getFirstImageUrl());
            item.setAvailableStock(product.getStock());
            item.setCategory(product.getCategory());
            item.setMainCategory(product.getMainCategory());
            item.setBrand(product.getBrand());
            
            if (item.getQuantity() > product.getStock()) {
                log.warn("Quantity adjusted for product {} from {} to {}", 
                    item.getProductId(), item.getQuantity(), product.getStock());
                item.setQuantity(product.getStock());
            }
            
            item.setUpdatedAt(LocalDateTime.now());
        }
        
        cart.getItems().removeAll(itemsToRemove);
        cart.updateTotals();
        
        return cartRepository.save(cart);
    }
}