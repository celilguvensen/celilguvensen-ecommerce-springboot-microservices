package com.example.userservice.dto;

public class LoginResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private String userId;
    
    public LoginResponse() {}
    
    public LoginResponse(String token, String username, String email, String role, String userId) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.userId = userId;
    }
    
    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public static class LoginResponseBuilder {
        private String token;
        private String username;
        private String email;
        private String role;
        private String userId;
        
        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }
        
        public LoginResponseBuilder username(String username) {
            this.username = username;
            return this;
        }
        
        public LoginResponseBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public LoginResponseBuilder role(String role) {
            this.role = role;
            return this;
        }
        
        public LoginResponseBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }
        
        public LoginResponse build() {
            return new LoginResponse(token, username, email, role, userId);
        }
    }
}