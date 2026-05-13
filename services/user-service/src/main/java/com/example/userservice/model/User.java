package com.example.userservice.model;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)  
public class User {
    @Id
    private String id;

    @Indexed(unique = true)  
    private String username;
    
    @Indexed(unique = true)  
    private String email;
    
    private String password;  
    private String role;  
    private String phone;
    private String firstName;
    private String lastName;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
}