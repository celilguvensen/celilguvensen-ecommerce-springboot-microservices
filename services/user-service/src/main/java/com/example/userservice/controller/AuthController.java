package com.example.userservice.controller;

import com.commonsecurity.JwtService;
import com.example.userservice.dto.LoginRequest;
import com.example.userservice.dto.LoginResponse;
import com.example.userservice.dto.RegisterRequest;
import com.example.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            var user = userService.register(registerRequest);
            
            String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole(),
                user.getId(),
                user.getEmail()
            );
            
            LoginResponse response = LoginResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .userId(user.getId())
                    .build();
                    
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            var user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            
            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole(),
                user.getId(),
                user.getEmail()
            );
            
            LoginResponse response = LoginResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .userId(user.getId())
                    .build();
                    
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            boolean isValid = jwtService.validateToken(token);
            
            if (isValid) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("username", jwtService.extractUsername(token));
                response.put("userId", jwtService.extractUserId(token));
                response.put("role", jwtService.extractRole(token));
                response.put("email", jwtService.extractEmail(token));
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token validation failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            
            if (!jwtService.validateToken(token)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token);
            String userId = jwtService.extractUserId(token);
            String email = jwtService.extractEmail(token);
            
            String newToken = jwtService.generateToken(username, role, userId, email);
            
            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token refresh failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/guest-token")
    public ResponseEntity<?> createGuestToken() {
        try {
            String guestId = "guest_" + System.currentTimeMillis();
            String guestUsername = "Guest_" + System.currentTimeMillis();
            String guestEmail = guestUsername + "@guest.local";
            
            String token = jwtService.generateToken(
                guestUsername,
                "ANONYMOUS",  
                guestId,
                guestEmail
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", guestId);
            response.put("username", guestUsername);
            response.put("email", guestEmail);
            response.put("role", "ANONYMOUS");
            response.put("isGuest", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Guest token creation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/migrate-anonymous")
    public ResponseEntity<?> migrateAnonymousCart(@RequestBody Map<String, String> request) {
        try {
            String anonymousUserId = request.get("anonymousUserId");
            String newUserId = request.get("newUserId");
            
            if (anonymousUserId == null || newUserId == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Missing required parameters");
                return ResponseEntity.badRequest().body(error);
            }

            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart migration initiated");
            response.put("anonymousUserId", anonymousUserId);
            response.put("newUserId", newUserId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Migration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}