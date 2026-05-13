package com.example.cartservice.security;

import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

public class SecurityHeaderFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        try {
            String userId = request.getHeader("X-User-ID");
            String username = request.getHeader("X-Username");
            String userRole = request.getHeader("X-User-Role");
            String userEmail = request.getHeader("X-User-Email");
            
            HttpServletRequestWrapper requestWrapper = new HttpServletRequestWrapper(request) {
                @Override
                public Object getAttribute(String name) {
                    switch (name) {
                        case "userId":
                            return userId;
                        case "username":
                            return username;
                        case "userRole":
                            return userRole;
                        case "userEmail":
                            return userEmail;
                        default:
                            return super.getAttribute(name);
                    }
                }
                
                @Override
                public Enumeration<String> getAttributeNames() {
                    Set<String> attributeNames = new HashSet<>();
                    Enumeration<String> originalNames = super.getAttributeNames();
                    if (originalNames != null) {
                        while (originalNames.hasMoreElements()) {
                            attributeNames.add(originalNames.nextElement());
                        }
                    }
                    attributeNames.add("userId");
                    attributeNames.add("username");
                    attributeNames.add("userRole");
                    attributeNames.add("userEmail");
                    return Collections.enumeration(attributeNames);
                }
            };
            
            filterChain.doFilter(requestWrapper, response);
            
        } catch (Exception e) {
            System.err.println("Error in SecurityHeaderFilter: " + e.getMessage());
            filterChain.doFilter(request, response);
        }
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        String method = request.getMethod();
        
        if (path.equals("/actuator/health") || path.equals("/health")) {
            return true;
        }
        
        if ("OPTIONS".equals(method)) {
            return true;
        }
        
        if (path.startsWith("/api/auth")) {
            return true;
        }
        
        return false;
    }
}