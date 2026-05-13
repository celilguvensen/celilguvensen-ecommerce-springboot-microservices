package com.example.orderservice.security;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class SecurityContext {
    
    public static String getCurrentUserId(HttpServletRequest request) {
        return (String) request.getAttribute("userId");
    }
    
    public static String getCurrentUsername(HttpServletRequest request) {
        return (String) request.getAttribute("username");
    }
    
    public static String getCurrentUserRole(HttpServletRequest request) {
        return (String) request.getAttribute("userRole");
    }
    
    public static String getCurrentUserEmail(HttpServletRequest request) {
        return (String) request.getAttribute("userEmail");
    }
    
    public static boolean hasRole(HttpServletRequest request, String role) {
        String userRole = getCurrentUserRole(request);
        return role.equals(userRole);
    }
    
    public static boolean isAdmin(HttpServletRequest request) {
        return hasRole(request, "ADMIN");
    }
    
    public static boolean isUser(HttpServletRequest request) {
        return hasRole(request, "USER");
    }
}