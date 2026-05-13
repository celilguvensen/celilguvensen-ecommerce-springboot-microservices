package com.example.cartservice.controller;

import com.example.cartservice.security.SecurityContext;
import com.example.cartservice.model.Cart;
import com.example.cartservice.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    private String getUserId(HttpServletRequest request) {
        String userId = SecurityContext.getCurrentUserId(request);
        String userRole = SecurityContext.getCurrentUserRole(request);
        
        System.out.println("Cart request - UserID: " + userId + ", Role: " + userRole);
        
        return userId != null ? userId : "anonymous";
    }

    @GetMapping("")
    public ResponseEntity<?> getCart(HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            Cart cart = cartService.getCartByUserId(userId);
            
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get cart: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

 
    @PostMapping("/items")
    public ResponseEntity<?> addItem(@RequestBody Map<String, Object> request, 
                                      HttpServletRequest httpRequest) {
        try {
            String userId = getUserId(httpRequest);
            String productId = (String) request.get("productId");
            Integer quantity = request.get("quantity") != null 
                ? ((Number) request.get("quantity")).intValue() 
                : 1;
            
            if (productId == null || productId.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Product ID is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (quantity <= 0) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Quantity must be greater than 0");
                return ResponseEntity.badRequest().body(error);
            }
 
            Cart cart = cartService.addItemToCart(userId, productId, quantity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cart", cart);
            response.put("message", "Item added to cart");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add item: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<?> updateItem(@PathVariable String productId,
                                        @RequestBody Map<String, Integer> request,
                                        HttpServletRequest httpRequest) {
        try {
            String userId = getUserId(httpRequest);
            Integer quantity = request.get("quantity");
            
            if (quantity == null || quantity < 0) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Valid quantity is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            Cart cart = cartService.updateCartItem(userId, productId, quantity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cart", cart);
            response.put("message", "Item updated");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update item: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<?> removeItem(@PathVariable String productId,
                                        HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            Cart cart = cartService.removeItemFromCart(userId, productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cart", cart);
            response.put("message", "Item removed from cart");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to remove item: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @DeleteMapping("")
    public ResponseEntity<?> clearCart(HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            cartService.clearCart(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart cleared");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear cart: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/migrate")
    public ResponseEntity<?> migrateCart(@RequestBody Map<String, String> request) {
        try {
            String guestUserId = request.get("guestUserId");
            String newUserId = request.get("newUserId");
            
            if (guestUserId == null || newUserId == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Both guestUserId and newUserId are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            cartService.migrateGuestCart(guestUserId, newUserId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart migrated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to migrate cart: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "cart-service");
        return ResponseEntity.ok(response);
    }
    
 
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshCart(HttpServletRequest request) {
        try {
            String userId = getUserId(request);
            Cart cart = cartService.refreshCartItems(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cart", cart);
            response.put("message", "Cart refreshed");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to refresh cart: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}