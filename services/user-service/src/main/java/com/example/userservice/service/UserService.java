package com.example.userservice.service;

import com.example.userservice.dto.RegisterRequest;
import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

   
    public User createUser(String username, String email, String password, String role,
                           String firstName, String lastName, String phone) {
        String hashedPassword = passwordEncoder.encode(password);
        User user = User.builder()
                .username(username)
                .email(email)
                .password(hashedPassword)
                .role(role)
                .firstName(firstName)
                .lastName(lastName)
                .phone(phone)
                .createdAt(LocalDateTime.now())
                .build();
        return userRepository.save(user);
    }

    public User findById(String id) {
        Optional<User> userOpt = userRepository.findById(id);
        return userOpt.orElse(null);
    }
    
    public User findByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);
    }

    public User findByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.orElse(null);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public void updateLastLogin(String username) {
        User user = findByUsername(username);
        if (user != null) {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    public User register(RegisterRequest registerRequest) throws Exception {
        if (findByUsername(registerRequest.getUsername()) != null) {
            throw new Exception("Username already exists");
        }
        
        if (findByEmail(registerRequest.getEmail()) != null) {
            throw new Exception("Email already exists");
        }
        
        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(hashedPassword)
                .role("USER") 
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .phone(null) 
                .createdAt(LocalDateTime.now())
                .build();
        
        return userRepository.save(user);
    }

    public User authenticate(String username, String password) {
        User user = findByUsername(username);
        
        if (user != null && checkPassword(user, password)) {
            updateLastLogin(username);
            return user;
        }
        
        return null; 
    }
}